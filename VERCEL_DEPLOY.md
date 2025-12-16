# Vercelデプロイ手順

## 1. 事前準備

### GitHubリポジトリにプッシュ（推奨）

1. GitHubで新しいリポジトリを作成
2. ローカルでGitを初期化（まだの場合）

```bash
cd /Users/hoshinokaori/Desktop/snap_with
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <あなたのGitHubリポジトリURL>
git push -u origin main
```

## 2. Vercelでのデプロイ

### 方法1: Vercel Dashboard経由（推奨）

1. [Vercel](https://vercel.com/) にアクセスしてアカウントを作成/ログイン
2. 「Add New Project」をクリック
3. GitHubリポジトリを選択（または「Import Git Repository」でリポジトリをインポート）
4. プロジェクト設定を確認：
   - **Framework Preset**: Next.js（自動検出される）
   - **Root Directory**: `./`（そのまま）
   - **Build Command**: `npm run build`（デフォルト）
   - **Output Directory**: `.next`（デフォルト）

### 方法2: Vercel CLI経由

```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# プロジェクトディレクトリでログイン
cd /Users/hoshinokaori/Desktop/snap_with
vercel login

# デプロイ
vercel
```

## 3. 環境変数の設定

Vercel Dashboardで以下の環境変数を設定してください：

### Supabase設定

1. Vercel Dashboard → プロジェクト → **Settings** → **Environment Variables**
2. 以下の環境変数を追加：

| 変数名 | 値 |
|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qjkezsjuvfsoiwocjrql.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2V6c2p1dmZzb2l3b2NqcnFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MDg3MjksImV4cCI6MjA3OTE4NDcyOX0.pwFrjrZEuq0Npq2Xgtxc-USRPuX7q5eKeY2GU_Qn0lE` |

### Cloudinary設定

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `CLOUDINARY_CLOUD_NAME` | `dacervm84` | CloudinaryのCloud Name |
| `CLOUDINARY_API_KEY` | `382822288749366` | CloudinaryのAPI Key |
| `CLOUDINARY_API_SECRET` | `uHRWQ_y1jjXtxo3Bxo0FOh6e9g8` | CloudinaryのAPI Secret |

**注意**: `CLOUDINARY_API_SECRET`は「Environment」を「Production」「Preview」「Development」のすべてに設定してください。

### 環境変数の設定場所

- **Environment**: Production, Preview, Development のすべてにチェックを入れる
- 「Save」をクリック

## 4. SupabaseのリダイレクトURL設定

Vercelデプロイ後、SupabaseのリダイレクトURLに本番URLを追加する必要があります：

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. **Authentication** → **URL Configuration**
4. **Redirect URLs** に以下を追加：
   - `https://your-project.vercel.app/auth/callback`
   - `https://your-project.vercel.app` （必要に応じて）

## 5. X（Twitter）アプリのコールバックURL設定

X Developer Portalでも本番URLを追加する必要があります（必要に応じて）：

1. [Twitter Developer Portal](https://developer.twitter.com/) にアクセス
2. アプリを選択 → **Settings** タブ
3. **Callback URLs** に以下を追加：
   - `https://qjkezsjuvfsoiwocjrql.supabase.co/auth/v1/callback`（これは変更不要）

## 6. デプロイの確認

1. Vercel Dashboardの「Deployments」タブでデプロイ状況を確認
2. デプロイが完了したら、表示されたURLにアクセス
3. 動作確認：
   - ログイン機能
   - 画像アップロード機能
   - 投稿表示機能

## トラブルシューティング

### エラー: "Missing Supabase environment variables"

- Vercel Dashboardの環境変数設定を確認
- 環境変数の名前が正確か確認（大文字小文字を含む）
- デプロイを再実行

### エラー: "Invalid redirect_uri"

- Supabase DashboardのリダイレクトURL設定を確認
- Vercelの本番URLが正しく追加されているか確認

### 画像がアップロードされない

- Cloudinaryの環境変数が正しく設定されているか確認
- `CLOUDINARY_API_SECRET`がすべての環境（Production, Preview, Development）に設定されているか確認

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)

