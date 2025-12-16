# Xログインができない場合のトラブルシューティング

## 確認すべきこと

### 1. ブラウザのコンソールを確認

1. ブラウザで http://localhost:3000/ にアクセス
2. 開発者ツールを開く（`F12` または `Cmd + Option + I`）
3. 「Console」タブを開く
4. 「Xでログイン」ボタンをクリック
5. コンソールに表示されるエラーメッセージを確認

### 2. 環境変数の確認

`.env.local`ファイルに以下の環境変数が正しく設定されているか確認：

```env
NEXT_PUBLIC_SUPABASE_URL=https://qjkezsjuvfsoiwocjrql.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Supabase Dashboardでの設定確認

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. 「Authentication」→「Providers」→「Twitter」を開く
4. 以下の設定を確認：
   - **Enabled**: 有効になっているか
   - **API Key**: 正しく入力されているか
   - **API Secret**: 正しく入力されているか
   - **Confirm email**: **無効**になっているか（重要）

### 4. Xアプリの設定確認

1. [Twitter Developer Portal](https://developer.twitter.com/) にアクセス
2. アプリの「Settings」タブを開く
3. **Callback URLs** に以下が設定されているか確認：
   ```
   https://qjkezsjuvfsoiwocjrql.supabase.co/auth/v1/callback
   ```

### 5. よくある問題と解決方法

#### 問題1: ボタンをクリックしても何も起こらない
- **原因**: JavaScriptエラーが発生している可能性
- **解決方法**: ブラウザのコンソールを確認し、エラーメッセージを確認

#### 問題2: "Invalid API Key" エラー
- **原因**: Supabaseの環境変数が正しく設定されていない
- **解決方法**: `.env.local`ファイルを確認し、開発サーバーを再起動

#### 問題3: リダイレクト後にエラーが表示される
- **原因**: コールバック処理でエラーが発生
- **解決方法**: エラーメッセージの内容を確認し、`X_AUTH_EMAIL_FIX.md` を参照

#### 問題4: Xの認証画面が表示されない
- **原因**: Xアプリの設定が正しくない
- **解決方法**: Twitter Developer PortalでCallback URLを確認

## デバッグ手順

1. ブラウザのコンソールを開く
2. 「Xでログイン」ボタンをクリック
3. コンソールに表示されるログを確認：
   - "Xログイン開始 - Callback URL: ..." が表示されるか
   - エラーメッセージが表示されるか
4. エラーメッセージの内容をメモする
5. エラーメッセージに基づいて上記の確認項目をチェック

## 開発サーバーの再起動

環境変数を変更した場合は、必ず開発サーバーを再起動してください：

```bash
# Ctrl+C で停止
npm run dev
```

