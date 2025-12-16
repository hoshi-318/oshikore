# ⚠️ 緊急: データベーススキーマを適用してください

## エラー: `relation "profiles" does not exist`

このエラーは、**`profiles`テーブルがデータベースに存在しない**ために発生しています。

## 🚨 今すぐ実行してください

### ステップ1: Supabase Dashboardを開く

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択（例: `qjkezsjuvfsoiwocjrql`）

### ステップ2: SQL Editorでスキーマを実行

1. 左メニューの「**SQL Editor**」をクリック
2. 「**New query**」ボタンをクリック（または既存のクエリをクリア）
3. **`database/schema.sql` ファイルを開く**
4. **ファイルの内容をすべてコピー**（Cmd+A → Cmd+C または Ctrl+A → Ctrl+C）
5. SQL Editorに貼り付け（Cmd+V または Ctrl+V）
6. **「Run」ボタンをクリック**（または Cmd+Enter / Ctrl+Enter）
7. **エラーが表示されないことを確認**

### ステップ3: 実行結果の確認

実行後、以下のメッセージが表示されるはずです：
- `Success. No rows returned` または類似の成功メッセージ

エラーが表示された場合：
- エラーメッセージをコピーして保存
- エラー内容を共有してください

### ステップ4: テーブルの存在確認

1. 左メニューの「**Table Editor**」をクリック
2. 左側のテーブル一覧に以下が表示されることを確認：
   - ✅ `profiles`
   - ✅ `posts`

テーブルが表示されない場合：
- SQL Editorでエラーが発生していないか再確認
- `database/schema.sql` を再実行

### ステップ5: 動作確認

1. ブラウザで **http://localhost:3000/** にアクセス
2. ブラウザをリロード（Cmd+Shift+R または Ctrl+Shift+R）
3. 「Xでログイン」をクリック
4. **エラーが解消されることを確認**

## ✅ 成功の確認

スキーマが正しく適用された場合：
- Table Editorに `profiles` と `posts` テーブルが表示される
- X認証が正常に動作する
- アカウント名登録ページが表示される

## ❌ まだエラーが発生する場合

1. SQL Editorで実行したSQLとエラーメッセージを確認
2. エラーメッセージの全文をコピー
3. 問題を共有してください

## 📝 注意事項

- **`database/schema.sql` の内容をすべて実行してください**（一部だけでは不十分です）
- エラーが発生した場合は、エラーメッセージを確認してください
- 実行後、必ずTable Editorでテーブルが作成されているか確認してください
