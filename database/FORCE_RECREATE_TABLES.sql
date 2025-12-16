-- テーブルを強制的に再作成するSQL（注意: 既存のデータは削除されます）
-- このSQLは、テーブルが存在しない場合や、構造に問題がある場合に使用してください

-- 警告: このSQLを実行すると、既存のデータが削除されます
-- 既存のデータを保持したい場合は、このSQLを使用しないでください

-- 1. 既存のトリガーを削除（テーブルが存在する場合）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;

-- 2. 既存のテーブルを削除（存在する場合）
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 3. profilesテーブルを作成
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  account_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. postsテーブルを作成
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  comment TEXT,
  tags TEXT[],
  stamps JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. インデックス作成
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);

-- 6. 完了メッセージ
SELECT '✅ テーブルが強制的に再作成されました' as message;
