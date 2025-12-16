# Vercelデプロイ後のSupabase設定手順

## 1. Supabase Dashboardにアクセス

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. ログイン（まだの場合はアカウントを作成）
3. プロジェクト `qjkezsjuvfsoiwocjrql` を選択

## 2. リダイレクトURLの設定

Vercelデプロイ後、本番環境のURLをSupabaseのリダイレクトURLに追加する必要があります。

### 手順

1. Supabase Dashboard → 左メニューの「**Authentication**」をクリック
2. 「**URL Configuration**」タブをクリック
3. 「**Redirect URLs**」セクションを確認
4. 以下のURLを追加（**Add URL**ボタンをクリック）：
   ```
   https://your-project.vercel.app/auth/callback
   ```
   （`your-project`の部分をVercelから発行された実際のプロジェクト名に置き換えてください）

5. 「**Save**」をクリック

### 現在設定されているURL

- `http://localhost:3000/auth/callback`（ローカル開発用）

### 追加するURL（例）

- `https://oshikore.vercel.app/auth/callback`（本番環境用）
- または、Vercelから発行された実際のURL

## 3. 確認事項

### Authentication → Providers → Twitter

以下の設定が正しいことを確認してください：

- [ ] **Enabled**: 有効になっているか
- [ ] **API Key**: XアプリのAPI Keyが正しく設定されているか
- [ ] **API Secret**: XアプリのAPI Secretが正しく設定されているか
- [ ] **Confirm email**: **無効**になっているか（チェックボックスが**外れている**か）

## 4. データベースの確認

本番環境でもデータベースが正しく設定されているか確認：

1. Supabase Dashboard → 左メニューの「**SQL Editor**」をクリック
2. `database/schema.sql` の内容をコピーして実行
3. エラーが発生しないことを確認

## 5. 動作確認

1. Vercelから発行されたURLにアクセス
2. 「Xでログイン」をクリック
3. 認証フローが正常に完了することを確認
4. マイページに遷移することを確認

## トラブルシューティング

### エラー: "Invalid redirect_uri"

- Supabase Dashboardの「URL Configuration」で、VercelのURLが正しく追加されているか確認
- URLに余分なスラッシュ（`/`）がないか確認
- プロトコル（`https://`）が正しく含まれているか確認

### エラー: "認証に失敗しました"

- Supabase Dashboardの「Authentication」→「Providers」→「Twitter」で設定を確認
- 「Confirm email」が無効になっているか確認

