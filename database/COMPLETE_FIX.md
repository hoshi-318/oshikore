# データベース構造の完全修復手順

## 状況

テーブル（`profiles`、`posts`）は存在するが、カラムが不足している可能性があります。

## 解決手順

### ステップ1: テーブル構造の確認

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. SQL Editorを開く
3. `database/check_table_structure.sql` の内容を実行
4. 結果を確認し、不足しているカラムを特定

### ステップ2: 不足しているカラムの追加

1. SQL Editorで `database/fix_missing_columns.sql` の内容を実行
2. メッセージを確認：
   - 「カラムを追加しました」→ 追加成功
   - 「カラムは既に存在します」→ 既に存在

### ステップ3: RLSポリシーとトリガーの確認・追加

カラムを追加した後、RLSポリシーとトリガーが正しく設定されているか確認：

1. SQL Editorで `database/schema.sql` を実行
   - `DROP POLICY IF EXISTS` が含まれているため、既存のポリシーを安全に更新
   - `CREATE OR REPLACE FUNCTION` が含まれているため、既存の関数を安全に更新

### ステップ4: 期待される構造

#### profilesテーブルに必要なカラム:
- ✅ `id` (UUID, PRIMARY KEY, REFERENCES auth.users(id))
- ✅ `user_id` (TEXT, UNIQUE, NOT NULL)
- ✅ `account_name` (TEXT, NULL許可) - **重要: NULL許可である必要があります**
- ✅ `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL)
- ✅ `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL)

#### postsテーブルに必要なカラム:
- ✅ `id` (UUID, PRIMARY KEY)
- ✅ `user_id` (UUID, REFERENCES profiles(id), NOT NULL)
- ✅ `image_url` (TEXT, NOT NULL)
- ✅ `comment` (TEXT, NULL許可)
- ✅ `tags` (TEXT[], NULL許可)
- ✅ `stamps` (JSONB, NULL許可)
- ✅ `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL)
- ✅ `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL)

### ステップ5: トリガー関数の確認

以下のSQLを実行して、トリガー関数が存在するか確認：

```sql
-- トリガー関数の確認
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';

-- トリガーの確認
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

トリガー関数が存在しない場合：
- `database/migration_fix_handle_new_user.sql` を実行

### ステップ6: RLSポリシーの確認

以下のSQLを実行して、RLSポリシーが存在するか確認：

```sql
-- profilesテーブルのポリシー確認
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'profiles';

-- postsテーブルのポリシー確認
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'posts';
```

以下のポリシーが存在する必要があります：

**profilesテーブル:**
- 「プロフィールは誰でも閲覧可能」（SELECT）
- 「自分のプロフィールのみ作成可能」（INSERT）
- 「自分のプロフィールのみ更新可能」（UPDATE）

**postsテーブル:**
- 「投稿は誰でも閲覧可能」（SELECT）
- 「自分の投稿のみ作成可能」（INSERT）
- 「自分の投稿のみ更新可能」（UPDATE）
- 「自分の投稿のみ削除可能」（DELETE）

ポリシーが不足している場合：
- `database/schema.sql` を再実行

### ステップ7: 動作確認

1. ブラウザをリロード（Cmd+Shift+R または Ctrl+Shift+R）
2. 「Xでログイン」をクリック
3. エラーが解消されることを確認

## 重要なポイント

- **`account_name`カラムはNULL許可である必要があります**（`NOT NULL`制約がないこと）
- すべてのカラムが存在することを確認してください
- RLSポリシーとトリガー関数も正しく設定されている必要があります

## トラブルシューティング

### エラー: "column already exists"
- 既にカラムが存在する場合、このエラーは無視して構いません
- `fix_missing_columns.sql` は既存のカラムを上書きしません

### エラー: "constraint already exists"
- 制約が既に存在する場合、`database/schema.sql` を再実行する必要はありません
- ただし、RLSポリシーとトリガーは再実行しても安全です

### まだエラーが発生する場合
- SQL Editorで実行したSQLとエラーメッセージを確認
- エラーメッセージの全文を共有してください
