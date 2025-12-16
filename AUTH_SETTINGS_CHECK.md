# 認証設定の確認手順（テーブルは存在する場合）

## データベーステーブルは存在します

テーブルは問題ないため、認証設定を確認してください。

## 確認手順

### ステップ1: Supabase認証設定の確認

#### 1-1. Twitterプロバイダーの設定

1. Supabase Dashboard → **Authentication** → **Providers** を開く
2. **Twitter** プロバイダーをクリック
3. 以下の設定を確認：

   - [ ] **Enabled**: 有効になっているか（スイッチがONになっているか）
   - [ ] **API Key**: XアプリのAPI Keyが正しく入力されているか
   - [ ] **API Secret**: XアプリのAPI Secretが正しく入力されているか
   - [ ] **Confirm email**: **無効**になっているか（チェックボックスが**外れている**か）

4. 設定を変更した場合は、**「Save」**をクリック

#### 1-2. 認証設定の確認

1. **Authentication** → **Settings** を開く
2. 以下の設定を確認：

   - [ ] **Enable email confirmations**: 無効化されているか
   - または、OAuthプロバイダーがメール確認から除外されているか

#### 1-3. Redirect URLsの確認

1. **Authentication** → **URL Configuration** を開く
2. **Redirect URLs** セクションを確認：

   - [ ] `http://localhost:3000/auth/callback` が追加されているか
   - 追加されていない場合は、追加して保存

### ステップ2: Xアプリの設定確認

1. [Twitter Developer Portal](https://developer.twitter.com/) にアクセス
2. アプリの **Settings** タブを開く
3. **Callback URLs** を確認：

   ```
   https://qjkezsjuvfsoiwocjrql.supabase.co/auth/v1/callback
   ```

   - このURLが正しく設定されているか確認
   - 設定されていない場合は追加

### ステップ3: エラーメッセージの詳細を確認

現在表示されているエラーメッセージの詳細を確認してください：

1. ブラウザのURLを確認
   - 例: `http://localhost:3000/?error=auth_failed&error_description=...`
   - `error_description` の内容を確認

2. ブラウザのコンソールを確認
   - 開発者ツール（F12）→ Consoleタブ
   - エラーメッセージを確認

## よくある問題

### 問題1: Twitterプロバイダーが無効になっている

**症状**: ログインボタンをクリックしても何も起こらない、またはエラーが発生する

**解決方法**: Supabase DashboardでTwitterプロバイダーを有効化

### 問題2: Confirm emailが有効になっている

**症状**: 「Error getting user email from external provider」エラー

**解決方法**: Supabase Dashboardで「Confirm email」を無効化

### 問題3: Redirect URLが設定されていない

**症状**: リダイレクト後にエラーが発生する

**解決方法**: Supabase DashboardのURL Configurationに `http://localhost:3000/auth/callback` を追加

## 次のステップ

1. 上記の設定をすべて確認してください
2. 設定を変更した場合は、必ず「Save」をクリック
3. ブラウザをリロードして再度ログインを試してください

それでも問題が続く場合は、**エラーメッセージの詳細**を共有してください。

