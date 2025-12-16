# 認証エラーのデバッグ手順

## 現在の状況

「認証に失敗しました」というエラーが表示されています。具体的な原因を特定するために、以下の情報を確認してください。

## 確認手順

### 1. ブラウザのURLを確認

現在のURLを確認してください。以下のような形式になっているはずです：

```
http://localhost:3000/?error=auth_failed&error_description=...
```

または

```
http://localhost:3000/?error=database_error&error_description=...
```

### 2. エラーメッセージの詳細を確認

ページに表示されているエラーメッセージの詳細を確認してください。以下のようなエラーが表示されている可能性があります：

- **"認証に失敗しました"** - 一般的な認証エラー
- **"データベースエラーが発生しました"** - データベースの問題
- **"Error getting user email from external provider"** - X認証の設定問題

### 3. ブラウザのコンソールを確認

1. 開発者ツールを開く（`F12` または `Cmd + Option + I`）
2. 「Console」タブを開く
3. エラーメッセージを確認

### 4. よくある原因と解決方法

#### 原因1: Supabaseプロジェクトの設定が復元されていない

プロジェクトを再開した後、以下の設定を確認してください：

1. **Authentication → Providers → Twitter**
   - **Enabled**: 有効になっているか
   - **API Key**: 正しく設定されているか
   - **API Secret**: 正しく設定されているか
   - **Confirm email**: **無効**になっているか（重要）

2. **Authentication → Settings**
   - **Enable email confirmations**: 無効化されているか

#### 原因2: データベーステーブルが存在しない

プロジェクトを再開した後、データベースの状態を確認してください：

1. Supabase Dashboard → 「SQL Editor」を開く
2. 以下のSQLを実行：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'posts');
```

- テーブルが表示されない場合は、`database/schema.sql` を実行する必要があります

#### 原因3: Xアプリの設定

1. [Twitter Developer Portal](https://developer.twitter.com/) にアクセス
2. アプリの「Settings」タブを開く
3. **Callback URLs** を確認：
   ```
   https://qjkezsjuvfsoiwocjrql.supabase.co/auth/v1/callback
   ```

## 次のステップ

上記の情報を確認したら、以下のいずれかを実行してください：

1. **エラーメッセージの詳細**を共有してください
2. **URLパラメータの`error`と`error_description`**を共有してください
3. **ブラウザのコンソールに表示されているエラー**を共有してください

これらの情報があれば、より具体的な解決方法を提案できます。

