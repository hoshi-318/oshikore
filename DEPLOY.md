# Vercelへのデプロイ手順

## ステップ1: GitHubリポジトリの作成

1. [GitHub](https://github.com) にログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: `snap_with`）
4. **Public** または **Private** を選択
5. 「Create repository」をクリック
6. リポジトリのURLをコピー（例: `https://github.com/your-username/snap_with.git`）

## ステップ2: ローカルでGitを初期化してプッシュ

ターミナルで以下のコマンドを実行してください：

```bash
cd /Users/hoshinokaori/Desktop/snap_with

# Gitを初期化
git init

# すべてのファイルを追加
git add .

# 初回コミット
git commit -m "Initial commit"

# メインブランチに設定
git branch -M main

# GitHubリポジトリをリモートに追加（<YOUR_REPO_URL>を実際のURLに置き換えてください）
git remote add origin <YOUR_REPO_URL>

# プッシュ
git push -u origin main
```

## ステップ3: Vercelでデプロイ

### 方法1: Vercel Dashboard経由（推奨）

1. [Vercel](https://vercel.com/) にアクセス
2. 「Sign Up」または「Log In」をクリック
3. 「Continue with GitHub」を選択してGitHubアカウントでログイン
4. 「Add New Project」をクリック
5. 「Import Git Repository」から、作成したリポジトリを選択
6. プロジェクト設定を確認：
   - **Framework Preset**: Next.js（自動検出）
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
7. 「Deploy」をクリック

### 方法2: Vercel CLI経由

```bash
# Vercel CLIをインストール
npm i -g vercel

# プロジェクトディレクトリでログイン
cd /Users/hoshinokaori/Desktop/snap_with
vercel login

# デプロイ
vercel
```

## ステップ4: 環境変数の設定

Vercel Dashboardで以下の環境変数を設定してください：

1. Vercel Dashboard → プロジェクト → **Settings** → **Environment Variables**
2. 以下の環境変数を追加（**Production**, **Preview**, **Development**すべてにチェック）：

### Supabase設定

- `NEXT_PUBLIC_SUPABASE_URL`: `https://qjkezsjuvfsoiwocjrql.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2V6c2p1dmZzb2l3b2NqcnFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MDg3MjksImV4cCI6MjA3OTE4NDcyOX0.pwFrjrZEuq0Npq2Xgtxc-USRPuX7q5eKeY2GU_Qn0lE`

### Cloudinary設定

- `CLOUDINARY_CLOUD_NAME`: `dacervm84`
- `CLOUDINARY_API_KEY`: `382822288749366`
- `CLOUDINARY_API_SECRET`: `uHRWQ_y1jjXtxo3Bxo0FOh6e9g8`

3. 環境変数を追加後、**「Redeploy」**をクリックして再デプロイ

## ステップ5: SupabaseのリダイレクトURL設定

デプロイ後、SupabaseのリダイレクトURLに本番URLを追加：

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. **Authentication** → **URL Configuration**
4. **Redirect URLs** に以下を追加：
   - `https://your-project.vercel.app/auth/callback`
   - （Vercelから発行されたURLを使用）

## ステップ6: 動作確認

1. Vercelから発行されたURLにアクセス
2. ログイン機能をテスト
3. 画像アップロード機能をテスト
4. 投稿表示機能をテスト

## トラブルシューティング

- **環境変数エラー**: Vercel Dashboardで環境変数が正しく設定されているか確認
- **リダイレクトエラー**: Supabase DashboardでリダイレクトURLが正しく設定されているか確認
- **ビルドエラー**: ターミナルのビルドログを確認

