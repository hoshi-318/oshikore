-- テーブルの構造を確認するSQL
-- Supabase DashboardのSQL Editorで実行して、テーブルのカラムを確認してください

-- profilesテーブルの構造確認
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- postsテーブルの構造確認
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'posts'
ORDER BY ordinal_position;

-- 期待されるカラム一覧（比較用）

-- profilesテーブルに必要なカラム:
-- - id (UUID, PRIMARY KEY, REFERENCES auth.users(id))
-- - user_id (TEXT, UNIQUE, NOT NULL)
-- - account_name (TEXT, NULL許可)
-- - created_at (TIMESTAMP WITH TIME ZONE, NOT NULL)
-- - updated_at (TIMESTAMP WITH TIME ZONE, NOT NULL)

-- postsテーブルに必要なカラム:
-- - id (UUID, PRIMARY KEY)
-- - user_id (UUID, REFERENCES profiles(id), NOT NULL)
-- - image_url (TEXT, NOT NULL)
-- - comment (TEXT, NULL許可)
-- - tags (TEXT[], NULL許可)
-- - stamps (JSONB, NULL許可)
-- - created_at (TIMESTAMP WITH TIME ZONE, NOT NULL)
-- - updated_at (TIMESTAMP WITH TIME ZONE, NOT NULL)
