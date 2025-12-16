# X認証のトラブルシューティング

## エラー: "Error getting user email from external provider"

このエラーは、SupabaseがX（Twitter）からメールアドレスを取得しようとしているが、Xはメールアドレスを提供しないために発生します。

### 解決方法

#### 1. Supabase Dashboardでの設定確認

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. 左メニューの「Authentication」→「Providers」をクリック
4. 「Twitter」プロバイダーの設定を確認
5. **「Confirm email」のチェックを外す**（重要）
   - X（Twitter）はメールアドレスを提供しないため、メール確認を必須にしない
6. 「Save」をクリック

#### 2. 認証設定の確認

1. 「Authentication」→「Settings」をクリック
2. 「Enable email confirmations」の設定を確認
   - X認証を使用する場合は、メール確認を無効化するか、OAuthプロバイダーを除外する設定を確認

#### 3. データベース設定の確認

X認証で作成されるユーザーは、メールアドレスがNULLになる可能性があります。これは正常な動作です。

## エラー: "oauth_token" パラメータがURLに含まれる

このエラーは、X認証のコールバックURLが正しく設定されていない場合に発生します。

### 解決方法

#### 1. XアプリのCallback URL設定を確認

1. [Twitter Developer Portal](https://developer.twitter.com/) にアクセス
2. アプリの「Settings」タブを開く
3. **Callback URLs** に以下が正しく設定されているか確認：
   ```
   https://[あなたのSupabaseプロジェクトID].supabase.co/auth/v1/callback
   ```
   - 例: `https://qjkezsjuvfsoiwocjrql.supabase.co/auth/v1/callback`
   - **重要**: ローカル開発用のURL（`http://localhost:3000/auth/callback`）は追加しないでください
   - SupabaseがOAuth処理を行い、その後アプリケーションのコールバックURLにリダイレクトします

#### 2. SupabaseのコールバックURL設定を確認

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. 左メニューの「Authentication」→「URL Configuration」をクリック
4. **Redirect URLs** に以下が含まれているか確認：
   ```
   http://localhost:3000/auth/callback
   ```
   - 開発環境用のURLを追加
   - 本番環境用のURLも追加（例: `https://yourdomain.com/auth/callback`）

#### 3. 認証フローの確認

正しい認証フロー：
1. ユーザーが「Xでログイン」をクリック
2. SupabaseのOAuthエンドポイントにリダイレクト: `https://[project].supabase.co/auth/v1/authorize?provider=twitter&...`
3. Xの認証画面にリダイレクト
4. Xでログイン後、SupabaseのコールバックURLにリダイレクト: `https://[project].supabase.co/auth/v1/callback?code=...`
5. SupabaseがOAuth処理を行い、アプリケーションのコールバックURLにリダイレクト: `http://localhost:3000/auth/callback?code=...`
6. アプリケーションが`code`をセッションに交換

### 確認事項

- Supabase DashboardでTwitterプロバイダーが正しく有効化されているか
- 「Confirm email」のチェックが外されているか
- XアプリのCallback URLがSupabaseのコールバックURL（`https://[project].supabase.co/auth/v1/callback`）に設定されているか
- SupabaseのRedirect URLsにアプリケーションのコールバックURL（`http://localhost:3000/auth/callback`）が追加されているか
- XアプリのAPI KeyとAPI Secretが正しく入力されているか

### 追加の設定（必要に応じて）

Supabase Dashboardの「Authentication」→「Settings」で：
- 「Enable email confirmations」を無効化
- または「OAuth providers」でメール確認を除外

これにより、X認証が正常に動作するようになります。