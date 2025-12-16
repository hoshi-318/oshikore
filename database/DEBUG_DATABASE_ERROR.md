# データベースエラーのデバッグ方法

## エラー: "Database error saving new user"

このエラーが発生する場合、以下の手順でデバッグしてください。

## ステップ1: Supabase Dashboardでログを確認

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. 左メニューの「**Logs**」をクリック
4. 「**Database Logs**」を選択
5. エラーが発生した時刻のログを確認
6. エラーメッセージの詳細を確認

## ステップ2: テーブルの存在確認

1. Supabase Dashboard → 「**Table Editor**」をクリック
2. 左側のテーブル一覧に以下が表示されることを確認：
   - ✅ `profiles`
   - ✅ `posts`

テーブルが存在しない場合：
- `database/schema.sql` を実行してください

## ステップ3: トリガー関数の確認

1. Supabase Dashboard → 「**SQL Editor**」を開く
2. 以下のSQLを実行して、トリガー関数が存在するか確認：

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';
```

3. トリガーが存在するか確認：

```sql
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

## ステップ4: トリガー関数の再作成

トリガー関数が存在しない場合、またはエラーが発生している場合：

1. `database/migration_fix_handle_new_user.sql` の内容を実行
2. エラーが発生しないことを確認

## ステップ5: RLSポリシーの確認

1. Supabase Dashboard → 「**Authentication**」→「**Policies**」をクリック
2. `profiles` テーブルのポリシーを確認：
   - 「プロフィールは誰でも閲覧可能」（SELECT）
   - 「自分のプロフィールのみ作成可能」（INSERT）
   - 「自分のプロフィールのみ更新可能」（UPDATE）

ポリシーが存在しない場合：
- `database/schema.sql` を再実行してください

## ステップ6: 手動でプロフィール作成をテスト

1. Supabase Dashboard → 「**SQL Editor**」を開く
2. 以下のSQLを実行（`YOUR_USER_ID`を実際のユーザーIDに置き換え）：

```sql
-- テスト用のuser_idを生成
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
  test_profile_user_id TEXT;
BEGIN
  -- 一意のuser_idを生成
  test_profile_user_id := substring(replace(gen_random_uuid()::text, '-', ''), 1, 8);
  
  -- プロフィールを作成
  INSERT INTO profiles (id, user_id, account_name)
  VALUES (test_user_id, test_profile_user_id, NULL);
  
  RAISE NOTICE 'プロフィール作成成功: user_id = %', test_profile_user_id;
END $$;
```

エラーが発生する場合、エラーメッセージを確認してください。

## よくある原因と解決方法

### 原因1: トリガー関数のエラー

**解決方法:**
- `database/migration_fix_handle_new_user.sql` を実行してトリガー関数を再作成

### 原因2: RLSポリシーが正しく設定されていない

**解決方法:**
- `database/schema.sql` を再実行してRLSポリシーを再作成

### 原因3: user_idの重複

**解決方法:**
- `database/migration_fix_handle_new_user.sql` を実行（重複チェック機能が含まれています）

### 原因4: 権限の問題

**解決方法:**
- トリガー関数が`SECURITY DEFINER`で実行されていることを確認
- `database/schema.sql` を再実行

## 詳細なエラーログの取得

アプリケーション側でも詳細なエラーログを出力するようにしました。ブラウザの開発者ツール（F12）→ Console でエラーメッセージの詳細を確認してください。

## サポート

上記の手順で解決しない場合：
1. Supabase Dashboard → 「**Logs**」→「**Database Logs**」からエラーログを取得
2. エラーメッセージの全文をコピー
3. プロジェクトの状態を共有（テーブル、ポリシー、トリガーの状態）
