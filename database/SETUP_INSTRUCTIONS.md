# データベースセットアップ手順

## エラー: "relation \"profiles\" does not exist"

このエラーは、`profiles`テーブルがデータベースに存在しない場合に発生します。

## 解決手順

### ステップ1: テーブルの存在確認

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. 左メニューの「**SQL Editor**」をクリック
4. `database/check_tables.sql` の内容をコピーして実行
5. 結果を確認：
   - `profiles_exists` が `false` の場合 → テーブルが存在しない
   - `posts_exists` が `false` の場合 → テーブルが存在しない

### ステップ2: データベーススキーマの適用

テーブルが存在しない場合、以下の手順でスキーマを適用してください：

1. Supabase Dashboard → 「**SQL Editor**」を開く
2. `database/schema.sql` の内容を**すべて**コピー
3. SQL Editorに貼り付けて実行
4. エラーが発生しないことを確認

### ステップ3: マイグレーションの実行（既存のデータベースがある場合）

既存のデータベースがある場合、以下のマイグレーションを順番に実行してください：

1. **`database/migration_account_name_nullable.sql`**
   - `account_name`カラムをNULL許可に変更

2. **`database/migration_add_profile_insert_policy.sql`**
   - プロフィール作成のRLSポリシーを追加

3. **`database/migration_fix_handle_new_user.sql`**
   - トリガー関数を改善（`user_id`の重複を防ぐ）

### ステップ4: 動作確認

1. ブラウザをリロード（Cmd+Shift+R または Ctrl+Shift+R）
2. 再度Xでログインを試す
3. エラーが解消され、アカウント名登録ページが表示されることを確認

## 注意事項

- スキーマを実行する前に、既存のデータがある場合はバックアップを取ってください
- `DROP POLICY IF EXISTS` や `DROP TRIGGER IF EXISTS` が含まれているため、既存の設定を上書きします
- エラーが発生した場合は、エラーメッセージを確認して対処してください

## トラブルシューティング

### エラー: "permission denied"

- Supabase Dashboardで実行していることを確認
- プロジェクトのオーナー権限があることを確認

### エラー: "relation already exists"

- テーブルが既に存在する場合は、スキーマの再実行は不要です
- マイグレーションのみを実行してください

### エラー: "policy already exists"

- `DROP POLICY IF EXISTS` が含まれているため、再実行しても問題ありません
- エラーを無視して続行してください
