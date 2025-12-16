# データベーススキーマの適用方法

## 1. SupabaseダッシュボードでSQL Editorを開く

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. 左メニューの「SQL Editor」をクリック

## 2. スキーマを適用

`database/schema.sql` の内容をコピーして、SQL Editorに貼り付けて実行してください。

## 3. テーブル構造

### profiles テーブル
- `id` (UUID): Supabase AuthのusersテーブルのID（主キー）
- `user_id` (TEXT): 一意の個人URL用ID（例: `abc12345`）
- `account_name` (TEXT): アカウント名
- `created_at`, `updated_at`: タイムスタンプ

### posts テーブル
- `id` (UUID): 投稿ID（主キー）
- `user_id` (UUID): profilesテーブルのID（外部キー）
- `image_url` (TEXT): Cloudinaryの画像URL
- `comment` (TEXT): 自由説明コメント
- `tags` (TEXT[]): 写っている人物のタグ配列
- `stamps` (JSONB): スタンプ配置情報
- `created_at`, `updated_at`: タイムスタンプ

## 4. RLS (Row Level Security) ポリシー

- プロフィール: 誰でも閲覧可能、自分のみ更新可能
- 投稿: 誰でも閲覧可能、自分の投稿のみ作成・更新・削除可能

## 5. 自動化機能

- ユーザー作成時にプロフィールを自動生成
- `updated_at`の自動更新
