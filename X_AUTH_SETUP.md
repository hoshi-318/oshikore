# X認証のセットアップ手順

## 1. X（Twitter）API アプリの作成

1. [Twitter Developer Portal](https://developer.twitter.com/) にアクセス
2. アカウントでログイン（Xアカウントが必要）
3. 「Create Project」をクリックしてプロジェクトを作成
4. プロジェクト内で「Create App」をクリックしてアプリを作成

## 2. X アプリの設定

1. 作成したアプリの「Keys and tokens」タブを開く
2. **API Key** と **API Secret** をコピー（後でSupabaseで使用）
3. 「Settings」タブを開く
4. **Callback URLs** に以下を追加：
   ```
   https://[あなたのSupabaseプロジェクトID].supabase.co/auth/v1/callback
   ```
   - 例: `https://qjkezsjuvfsoiwocjrql.supabase.co/auth/v1/callback`

5. **Website URL** に以下を設定：
   ```
   https://[あなたのSupabaseプロジェクトID].supabase.co
   ```

## 3. SupabaseでのX認証プロバイダー設定

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. 左メニューの「Authentication」→「Providers」をクリック
4. 「Twitter」プロバイダーを探して有効化
5. 以下の情報を入力：
   - **API Key**: XアプリのAPI Key
   - **API Secret**: XアプリのAPI Secret
   - **Redirect URL**: 自動設定される（変更不要）

6. 「Save」をクリック

## 4. 確認事項

- SupabaseのプロジェクトURLが正しく設定されているか
- XアプリのCallback URLが正しく設定されているか
- Xアプリの「Read and write」権限が有効になっているか（必要に応じて）

## 5. データベースマイグレーション（重要）

既存のデータベースにスキーマを適用している場合、以下のマイグレーションを実行してください：

1. Supabase Dashboard → SQL Editorを開く
2. `database/migration_account_name_nullable.sql` の内容をコピーして実行
   - これにより、`account_name`カラムがNULL許可になり、初回ログイン時にアカウント名登録ページが表示されます

## 6. 動作確認

1. 開発サーバーを起動: `npm run dev`
2. トップページの「Xでログイン」ボタンをクリック
3. Xの認証画面が表示されることを確認
4. Xでログイン後、アカウント名登録ページ（`/auth/register`）が表示されることを確認
5. アカウント名を登録後、マイページ（`/my`）に遷移することを確認

## 注意事項

- Xアプリの作成には審査が必要な場合があります
- 開発環境でのテストには、ローカル開発用のCallback URLも設定が必要な場合があります
- 本番環境では、環境変数が正しく設定されているか確認してください
