# Snapwith

推しとのチェキをアルバム化し、ファンみんなで共有するオンラインアルバム（Webアプリ）

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **データベース**: Supabase
- **画像ストレージ**: Cloudinary
- **ホスティング**: Vercel

## セットアップ

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定
`.env.local` ファイルを作成し、以下の変数を設定：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3. 開発サーバーの起動
```bash
npm run dev
```

## プロジェクト構造

```
snap_with/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # トップページ (/)
│   ├── my/
│   │   └── page.tsx        # マイページ (/my)
│   ├── user/
│   │   └── [userId]/
│   │       └── page.tsx    # ユーザーページ (/user/[userId])
│   └── globals.css
├── components/
│   ├── Logo.tsx
│   ├── ImageGrid.tsx
│   ├── LoginButton.tsx
│   ├── AccountRegistrationModal.tsx
│   ├── PostButton.tsx
│   ├── PostImageForm.tsx
│   └── ProfileSettings.tsx
└── ...
```

## 主要機能

### 1. トップページ (/)
- サービスロゴ
- 最新20件の「みんなの投稿画像」をグリッド表示
- 「Xでログイン」ボタン

### 2. マイページ (/my)
- アカウント名表示・変更
- 個人URLのコピー
- 画像投稿機能（スタンプ、タグ、コメント）
- 自分の投稿画像一覧

### 3. ユーザーページ (/user/[userId])
- ユーザーのアカウント名
- ユーザーの投稿画像一覧
- 「投稿する」ボタン（ログイン状態に応じて動作）

## 開発状況

現在は基本的な画面構成と遷移の骨格が完成しています。
次は詳細な仕様の実装を進めていきます。
