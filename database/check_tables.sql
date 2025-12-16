-- テーブルの存在確認用SQL
-- Supabase DashboardのSQL Editorで実行して、テーブルが存在するか確認してください

-- profilesテーブルの存在確認
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
) AS profiles_exists;

-- postsテーブルの存在確認
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'posts'
) AS posts_exists;

-- 既存のテーブル一覧を表示
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
