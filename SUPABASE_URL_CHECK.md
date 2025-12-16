# Supabase URL 確認手順

## 問題

`DNS_PROBE_FINISHED_NXDOMAIN` エラーが発生しています。これは、SupabaseプロジェクトのURLが正しくないか、プロジェクトが存在しないことを示しています。

## 確認手順

### ステップ1: Supabase Dashboardでプロジェクトを確認

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクト一覧を確認
3. プロジェクトが存在するか確認
   - プロジェクトが削除されている場合は、新しいプロジェクトを作成する必要があります

### ステップ2: 正しいSupabase URLを取得

プロジェクトが存在する場合：

1. Supabase Dashboard → プロジェクトを選択
2. 「Settings」→「API」を開く
3. **「Project URL」** をコピー
   - 例: `https://abcdefghijklmnop.supabase.co`

### ステップ3: 環境変数を更新

`.env.local`ファイルを開き、正しいURLに更新：

```env
NEXT_PUBLIC_SUPABASE_URL=https://[正しいプロジェクトID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[正しいAnon Key]
```

### ステップ4: 開発サーバーを再起動

環境変数を変更した後、必ず開発サーバーを再起動：

```bash
# Ctrl+C で停止
npm run dev
```

## プロジェクトが存在しない場合

新しいSupabaseプロジェクトを作成する必要があります：

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. 「New Project」をクリック
3. プロジェクト名、データベースパスワードなどを設定
4. プロジェクト作成後、Settings → APIからURLとキーを取得
5. `.env.local`を更新

## 重要な注意事項

- Supabaseの無料プランでは、一定期間非アクティブなプロジェクトは一時停止される可能性があります
- プロジェクトが一時停止している場合は、Dashboardから再開できます

