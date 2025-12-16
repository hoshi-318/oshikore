# Cloudinary連携のセットアップ手順

## 1. Cloudinaryアカウントの作成

1. [Cloudinary](https://cloudinary.com/) にアクセス
2. アカウントを作成（無料プランでOK）
3. ダッシュボードにログイン

## 2. Cloudinaryの認証情報を取得

1. Cloudinaryダッシュボード → 「**Settings**」（歯車アイコン）をクリック
2. 「**API Keys**」セクションを確認
3. 以下の情報をコピー：
   - **Cloud Name**
   - **API Key**
   - **API Secret**（「Reveal」をクリックして表示）

## 3. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成（既に存在する場合は追加）：

```env
# Supabase設定（既存）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary設定（追加）
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 環境変数の説明

- `CLOUDINARY_CLOUD_NAME`: Cloudinaryダッシュボードの「Cloud Name」
- `CLOUDINARY_API_KEY`: Cloudinaryダッシュボードの「API Key」
- `CLOUDINARY_API_SECRET`: Cloudinaryダッシュボードの「API Secret」

## 4. 開発サーバーの再起動

環境変数を追加した後、開発サーバーを再起動してください：

```bash
# 開発サーバーを停止（Ctrl+C）
# その後、再起動
npm run dev
```

## 5. 動作確認

1. ブラウザで **http://localhost:3000/my** にアクセス
2. ログイン後、「投稿」ボタン（右下の+ボタン）をクリック
3. 画像を選択
4. スタンプ、タグ、コメントを入力（任意）
5. 「投稿する」をクリック
6. マイページに投稿が表示されることを確認

## 注意事項

- 環境変数は`.env.local`ファイルに保存してください
- `.env.local`ファイルはGitにコミットしないでください（`.gitignore`に含まれています）
- 本番環境（Vercelなど）では、環境変数を別途設定する必要があります

## トラブルシューティング

### エラー: "Missing Cloudinary environment variables"

- `.env.local`ファイルが正しく作成されているか確認
- 環境変数名が正しいか確認
- 開発サーバーを再起動しているか確認

### エラー: "Invalid API Key"

- Cloudinaryダッシュボードの「API Keys」セクションで正しい値を確認
- 環境変数の値が正しく設定されているか確認（余分なスペースなどがないか）

### 画像がアップロードされない

- Cloudinaryの無料プランの使用制限を確認
- ブラウザの開発者ツール（F12）→ Networkタブでエラーを確認
- サーバー側のログを確認

## 参考

- [Cloudinary公式ドキュメント](https://cloudinary.com/documentation)
- [Next.js環境変数](https://nextjs.org/docs/basic-features/environment-variables)
