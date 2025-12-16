-- テーブルの存在を確認し、必要に応じて作成するSQL

-- 1. テーブルの存在確認（詳細）
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'posts');

-- 2. profilesテーブルが存在しない場合、作成する
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  account_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. postsテーブルが存在しない場合、作成する
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  comment TEXT,
  tags TEXT[],
  stamps JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. テーブルへの直接アクセステスト
SELECT COUNT(*) as profiles_count FROM profiles;
SELECT COUNT(*) as posts_count FROM posts;

-- 5. 完了メッセージ
SELECT '✅ テーブルの存在確認と作成が完了しました' as message;
