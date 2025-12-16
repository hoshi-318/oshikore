-- プロフィール作成のRLSポリシーを追加するマイグレーション
-- 既存のデータベースに適用する場合に実行してください

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "自分のプロフィールのみ作成可能" ON profiles;

-- 自分のプロフィールのみ作成可能（初回ログイン時）
CREATE POLICY "自分のプロフィールのみ作成可能"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
