# データベースクイックセットアップ

## ⚠️ エラー: "relation \"profiles\" does not exist"

このエラーは、データベースにテーブルが作成されていないために発生します。

## 🚀 解決方法（3ステップ）

### ステップ1: Supabase Dashboardを開く

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択（例: `qjkezsjuvfsoiwocjrql`）

### ステップ2: SQL Editorでスキーマを実行

1. 左メニューの「**SQL Editor**」をクリック
2. 「**New query**」をクリック
3. 以下のファイルを開いて、**すべての内容をコピー**：
   - `database/schema.sql`
4. SQL Editorに貼り付ける
5. 「**Run**」ボタンをクリック（または Cmd+Enter / Ctrl+Enter）
6. エラーが表示されないことを確認

### ステップ3: 動作確認

1. ブラウザで **http://localhost:3000/** にアクセス
2. ブラウザをリロード（Cmd+Shift+R または Ctrl+Shift+R）
3. 「Xでログイン」をクリック
4. エラーが解消され、アカウント名登録ページが表示されることを確認

## ✅ 確認方法

スキーマが正しく適用されたか確認するには：

1. Supabase Dashboard → 「**Table Editor**」をクリック
2. 左側のテーブル一覧に以下が表示されることを確認：
   - ✅ `profiles`
   - ✅ `posts`

## 🔧 トラブルシューティング

### エラー: "permission denied"
- Supabase Dashboardで実行していることを確認
- プロジェクトのオーナー権限があることを確認

### エラー: "relation already exists"
- テーブルが既に存在する場合は問題ありません
- そのまま続行してください

### エラー: "policy already exists"
- `DROP POLICY IF EXISTS` が含まれているため、再実行しても問題ありません
- エラーを無視して続行してください

## 📝 注意事項

- スキーマを実行すると、以下のテーブルと設定が作成されます：
  - `profiles` テーブル（ユーザープロフィール）
  - `posts` テーブル（投稿データ）
  - RLSポリシー（セキュリティ設定）
  - トリガー関数（自動処理）

- 既存のデータがある場合は、バックアップを取ってから実行してください
