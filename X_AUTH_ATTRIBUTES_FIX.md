# X認証のメールアドレスエラー - Attributes設定の確認

## 重要な設定: Attributes セクション

Supabase Dashboardで「Confirm email」のチェックを外してもエラーが発生する場合、**「Attributes」セクション**の設定を確認する必要があります。

## 解決手順

### ステップ1: Twitter プロバイダーの Attributes 設定を確認

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. 左メニューの「**Authentication**」→「**Providers**」をクリック
4. 「**Twitter**」プロバイダーを開く
5. **「Attributes」セクション**を探す（設定画面の下部にある可能性があります）
6. 以下の設定を確認・変更：
   - **「Email」**: 必須（Required）から任意（Optional）に変更
   - または、メールアドレスをマッピングしない設定に変更
7. 「**Save**」をクリック

### ステップ2: Authentication Settings の確認

1. 「**Authentication**」→「**Settings**」をクリック
2. 以下の設定を確認：

#### 「Enable email confirmations」
- **無効化**する（推奨）
- または、OAuthプロバイダーを除外する設定を確認

#### 「Disable sign ups」
- この設定が有効になっている場合、OAuthプロバイダーでのサインアップがブロックされる可能性があります
- X認証を使用する場合は、この設定を**無効化**してください

### ステップ3: プロジェクト設定の確認

1. 「**Settings**」→「**API**」を開く
2. **Project URL** が正しく設定されているか確認
3. **Site URL** が正しく設定されているか確認
   - 開発環境: `http://localhost:3000`
   - 本番環境: あなたのドメイン

## 確認事項チェックリスト

- [ ] Twitter プロバイダーの「Confirm email」が無効になっている
- [ ] Twitter プロバイダーの「Attributes」セクションで、Emailが必須（Required）になっていない
- [ ] Authentication Settings の「Enable email confirmations」が無効になっている
- [ ] Authentication Settings の「Disable sign ups」が無効になっている（またはOAuthプロバイダーが除外されている）
- [ ] Site URL が正しく設定されている
- [ ] XアプリのCallback URLが正しく設定されている
- [ ] SupabaseのRedirect URLsにアプリケーションのコールバックURLが追加されている

## 設定変更後の確認

1. ブラウザのキャッシュをクリア（Cmd+Shift+R または Ctrl+Shift+R）
2. 開発サーバーを再起動: `npm run dev`
3. 再度Xでログインを試す
4. エラーが解消され、アカウント名登録ページが表示されることを確認

## まだエラーが発生する場合

1. Supabase Dashboard → 「**Logs**」→「**Auth Logs**」を開く
2. エラーが発生した時刻のログを確認
3. エラーメッセージの詳細を確認
4. 必要に応じて、[Supabase Support](https://supabase.com/support) に問い合わせ

## 参考

- Supabase公式ドキュメント: [OAuth Providers](https://supabase.com/docs/guides/auth/social-login/auth-twitter)
- コミュニティフォーラム: [Supabase Discord](https://discord.supabase.com/)
