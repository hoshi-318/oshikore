-- 不足しているカラムを追加するSQL
-- このSQLは、既存のテーブルに不足しているカラムを追加します

-- profilesテーブルのカラム追加（存在しない場合のみ）

-- account_nameカラムを追加（存在しない場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'account_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN account_name TEXT;
    RAISE NOTICE 'account_nameカラムを追加しました';
  ELSE
    RAISE NOTICE 'account_nameカラムは既に存在します';
  END IF;
END $$;

-- user_idカラムを追加（存在しない場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN user_id TEXT UNIQUE;
    RAISE NOTICE 'user_idカラムを追加しました';
  ELSE
    RAISE NOTICE 'user_idカラムは既に存在します';
  END IF;
END $$;

-- created_atカラムを追加（存在しない場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    RAISE NOTICE 'created_atカラムを追加しました';
  ELSE
    RAISE NOTICE 'created_atカラムは既に存在します';
  END IF;
END $$;

-- updated_atカラムを追加（存在しない場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    RAISE NOTICE 'updated_atカラムを追加しました';
  ELSE
    RAISE NOTICE 'updated_atカラムは既に存在します';
  END IF;
END $$;

-- postsテーブルのカラム追加（存在しない場合のみ）

-- image_urlカラムを追加（存在しない場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'posts' 
    AND column_name = 'image_url'
  ) THEN
    ALTER TABLE posts ADD COLUMN image_url TEXT NOT NULL;
    RAISE NOTICE 'image_urlカラムを追加しました';
  ELSE
    RAISE NOTICE 'image_urlカラムは既に存在します';
  END IF;
END $$;

-- commentカラムを追加（存在しない場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'posts' 
    AND column_name = 'comment'
  ) THEN
    ALTER TABLE posts ADD COLUMN comment TEXT;
    RAISE NOTICE 'commentカラムを追加しました';
  ELSE
    RAISE NOTICE 'commentカラムは既に存在します';
  END IF;
END $$;

-- tagsカラムを追加（存在しない場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'posts' 
    AND column_name = 'tags'
  ) THEN
    ALTER TABLE posts ADD COLUMN tags TEXT[];
    RAISE NOTICE 'tagsカラムを追加しました';
  ELSE
    RAISE NOTICE 'tagsカラムは既に存在します';
  END IF;
END $$;

-- stampsカラムを追加（存在しない場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'posts' 
    AND column_name = 'stamps'
  ) THEN
    ALTER TABLE posts ADD COLUMN stamps JSONB;
    RAISE NOTICE 'stampsカラムを追加しました';
  ELSE
    RAISE NOTICE 'stampsカラムは既に存在します';
  END IF;
END $$;

-- created_atカラムを追加（存在しない場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'posts' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE posts ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    RAISE NOTICE 'posts.created_atカラムを追加しました';
  ELSE
    RAISE NOTICE 'posts.created_atカラムは既に存在します';
  END IF;
END $$;

-- updated_atカラムを追加（存在しない場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'posts' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE posts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    RAISE NOTICE 'posts.updated_atカラムを追加しました';
  ELSE
    RAISE NOTICE 'posts.updated_atカラムは既に存在します';
  END IF;
END $$;
