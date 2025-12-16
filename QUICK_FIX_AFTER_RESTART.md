# プロジェクト再開後のクイック修正ガイド

## 認証に失敗する場合の対処法

プロジェクトを再開した後、「認証に失敗しました」と表示される場合は、以下の手順で確認してください。

## ステップ1: データベースの状態を確認

1. Supabase Dashboard → **SQL Editor** を開く
2. `database/QUICK_CHECK_AFTER_RESTART.sql` の内容を実行
3. 結果を確認：
   - `profiles` と `posts` テーブルが「✅ 存在」と表示されればOK
   - 「❌ 不存在」と表示される場合は、ステップ2へ

## ステップ2: データベーススキーマを再適用

テーブルが存在しない場合：

1. Supabase Dashboard → **SQL Editor** を開く
2. `database/schema.sql` の内容をすべてコピー
3. SQL Editorに貼り付けて実行
4. エラーが発生しないことを確認

## ステップ3: Supabase認証設定の確認

1. **Authentication → Providers → Twitter**
   - **Enabled**: 有効になっているか
   - **Confirm email**: **無効**になっているか（重要！）
   - **API Key** と **API Secret** が正しく設定されているか

2. **Authentication → Settings**
   - **Enable email confirmations**: 無効化されているか

3. **Authentication → URL Configuration**
   - **Redirect URLs** に `http://localhost:3000/auth/callback` が含まれているか

## ステップ4: 開発サーバーの再起動

設定を変更した後：

```bash
# Ctrl+C で停止
npm run dev
```

## ステップ5: 動作確認

1. ブラウザで http://localhost:3000/ にアクセス
2. 「Xでログイン」ボタンをクリック
3. 正常にログインできるか確認

## よくある問題

### 問題1: データベーステーブルが存在しない
- **症状**: 「データベースエラーが発生しました」と表示される
- **解決方法**: `database/schema.sql` を実行

### 問題2: メール確認エラー
- **症状**: 「Error getting user email from external provider」と表示される
- **解決方法**: Supabase Dashboardで「Confirm email」を無効化

### 問題3: 認証コードが取得できない
- **症状**: 「認証コードが取得できませんでした」と表示される
- **解決方法**: XアプリのCallback URL設定を確認

