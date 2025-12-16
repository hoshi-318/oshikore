# 認証失敗の確認チェックリスト

## プロジェクト再開後の確認事項

プロジェクトを再開した後、以下の設定が正しく復元されているか確認してください。

### 1. Supabase Dashboardでの確認

#### Authentication → Providers → Twitter

- [ ] **Enabled**: 有効になっているか
- [ ] **API Key**: XアプリのAPI Keyが正しく設定されているか
- [ ] **API Secret**: XアプリのAPI Secretが正しく設定されているか
- [ ] **Confirm email**: **無効**になっているか（重要！）

#### Authentication → Settings

- [ ] **Enable email confirmations**: 無効化されているか、またはOAuthプロバイダーが除外されているか

#### Authentication → URL Configuration

- [ ] **Redirect URLs** に以下が含まれているか：
  - `http://localhost:3000/auth/callback`

### 2. データベースの確認

プロジェクトを再開した後、データベーステーブルが存在するか確認：

1. Supabase Dashboard → **SQL Editor** を開く
2. 以下のSQLを実行：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'posts');
```

**結果が表示されない場合**:
- `database/schema.sql` を実行する必要があります

### 3. Xアプリの設定確認

1. [Twitter Developer Portal](https://developer.twitter.com/) にアクセス
2. アプリの **Settings** タブを開く
3. **Callback URLs** を確認：
   ```
   https://qjkezsjuvfsoiwocjrql.supabase.co/auth/v1/callback
   ```

### 4. 環境変数の確認

`.env.local` ファイルの内容を確認：

```env
NEXT_PUBLIC_SUPABASE_URL=https://qjkezsjuvfsoiwocjrql.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## エラーメッセージの確認

### ブラウザのURLを確認

現在のURLを確認してください。以下のような形式になっているはずです：

```
http://localhost:3000/?error=auth_failed&error_description=...
```

### よくあるエラーメッセージ

1. **"認証に失敗しました"**
   - 原因: 一般的な認証エラー
   - 対応: URLパラメータの`error_description`を確認

2. **"データベースエラーが発生しました"**
   - 原因: データベーステーブルが存在しない、またはプロフィール作成に失敗
   - 対応: データベースの状態を確認し、`database/schema.sql`を実行

3. **"Error getting user email from external provider"**
   - 原因: X認証の設定でメール確認が有効になっている
   - 対応: Supabase Dashboardで「Confirm email」を無効化

## 次のステップ

1. 上記のチェックリストを確認
2. ブラウザのURLに含まれているエラーパラメータを確認
3. エラーメッセージの詳細を共有してください

これらの情報があれば、より具体的な解決方法を提案できます。

