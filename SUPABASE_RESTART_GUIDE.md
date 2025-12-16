# Supabaseプロジェクト再開後の確認手順

## プロジェクトを再開する

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. 一時停止しているプロジェクトを選択
3. 「Resume」または「Restore」ボタンをクリック
4. プロジェクトが再開されるまで数分待つ

## 再開後の確認事項

### 1. プロジェクトURLとキーの確認

1. Supabase Dashboard → 「Settings」→「API」を開く
2. 以下の情報を確認：
   - **Project URL**: `https://qjkezsjuvfsoiwocjrql.supabase.co`
   - **anon/public key**: 環境変数と同じか確認

### 2. 環境変数の確認

`.env.local`ファイルの内容が正しいか確認：

```env
NEXT_PUBLIC_SUPABASE_URL=https://qjkezsjuvfsoiwocjrql.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. データベースの状態確認

1. Supabase Dashboard → 「SQL Editor」を開く
2. 以下のSQLを実行してテーブルが存在するか確認：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'posts');
```

- `profiles` と `posts` テーブルが表示されればOK
- 表示されない場合は、`database/schema.sql` を実行する必要があります

### 4. 認証設定の確認

1. Supabase Dashboard → 「Authentication」→「Providers」を開く
2. 「Twitter」プロバイダーの設定を確認：
   - **Enabled**: 有効になっているか
   - **API Key**: 正しく設定されているか
   - **API Secret**: 正しく設定されているか
   - **Confirm email**: 無効になっているか（重要）

### 5. 開発サーバーの再起動

環境変数を変更した場合、またはプロジェクトを再開した後：

```bash
# Ctrl+C で停止
npm run dev
```

## 動作確認

1. ブラウザで http://localhost:3000/ にアクセス
2. ページが正常に表示されることを確認
3. 「Xでログイン」ボタンをクリックして動作を確認

## 問題が続く場合

- プロジェクトが完全に再開されるまで数分かかる場合があります
- ブラウザのキャッシュをクリアしてください
- 開発サーバーを再起動してください

