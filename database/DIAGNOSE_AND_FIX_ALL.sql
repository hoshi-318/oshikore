-- 包括的な診断と修正SQL
-- このSQLを実行して、すべての問題を一度に解決してください

-- ============================================
-- 1. 診断: テーブルの存在確認
-- ============================================
SELECT '診断開始' as step, NOW() as timestamp;

SELECT 
  'テーブル存在確認' as check_type,
  table_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = t.table_name
  ) THEN '✅ 存在' ELSE '❌ 不存在 - 作成します' END as status
FROM (SELECT 'profiles' as table_name UNION SELECT 'posts') t;

-- ============================================
-- 2. テーブルを確実に作成（存在しない場合）
-- ============================================

-- profilesテーブルを作成（存在しない場合のみ）
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  account_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- postsテーブルを作成（存在しない場合のみ）
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  comment TEXT,
  tags TEXT[],
  stamps JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);

-- ============================================
-- 3. RLSポリシーの設定
-- ============================================

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "プロフィールは誰でも閲覧可能" ON public.profiles;
DROP POLICY IF EXISTS "自分のプロフィールのみ作成可能" ON public.profiles;
DROP POLICY IF EXISTS "自分のプロフィールのみ更新可能" ON public.profiles;
DROP POLICY IF EXISTS "投稿は誰でも閲覧可能" ON public.posts;
DROP POLICY IF EXISTS "自分の投稿のみ作成可能" ON public.posts;
DROP POLICY IF EXISTS "自分の投稿のみ更新可能" ON public.posts;
DROP POLICY IF EXISTS "自分の投稿のみ削除可能" ON public.posts;

-- RLSを有効化
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- profilesテーブルのポリシー
CREATE POLICY "プロフィールは誰でも閲覧可能"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "自分のプロフィールのみ作成可能"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "自分のプロフィールのみ更新可能"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- postsテーブルのポリシー
CREATE POLICY "投稿は誰でも閲覧可能"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "自分の投稿のみ作成可能"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "自分の投稿のみ更新可能"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "自分の投稿のみ削除可能"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. トリガー関数の作成（スキーマ修飾子付き）
-- ============================================

-- updated_at自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- プロフィール作成関数（明示的にpublicスキーマを指定）
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_user_id TEXT;
  retry_count INTEGER := 0;
  max_retries INTEGER := 10;
BEGIN
  -- 一意のuser_idを生成（重複チェック付き）
  LOOP
    new_user_id := substring(replace(gen_random_uuid()::text, '-', ''), 1, 8);
    
    -- 明示的にpublicスキーマを指定
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = new_user_id) THEN
      EXIT;
    END IF;
    
    retry_count := retry_count + 1;
    IF retry_count >= max_retries THEN
      new_user_id := substring(replace(gen_random_uuid()::text, '-', ''), 1, 6) || 
                     substring(replace(extract(epoch from now())::text, '.', ''), -2, 2);
      EXIT;
    END IF;
  END LOOP;
  
  -- 明示的にpublicスキーマを指定してプロフィールを作成
  BEGIN
    INSERT INTO public.profiles (id, user_id, account_name)
    VALUES (NEW.id, new_user_id, NULL);
  EXCEPTION
    WHEN unique_violation THEN
      new_user_id := substring(replace(gen_random_uuid()::text, '-', ''), 1, 12);
      INSERT INTO public.profiles (id, user_id, account_name)
      VALUES (NEW.id, new_user_id, NULL);
    WHEN OTHERS THEN
      RAISE EXCEPTION 'handle_new_userエラー: %', SQLERRM USING ERRCODE = SQLSTATE;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. トリガーの設定
-- ============================================

-- 既存のトリガーを削除
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- トリガーを作成
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON public.posts
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 6. 確認: すべてが正しく設定されたかチェック
-- ============================================
SELECT '✅ 完了' as step, NOW() as timestamp;

-- テーブルの存在確認
SELECT 
  'テーブル確認' as check_type,
  tablename,
  '✅ 存在' as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'posts');

-- トリガー関数の存在確認
SELECT 
  'トリガー関数確認' as check_type,
  routine_name as name,
  '✅ 存在' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';

-- トリガーの存在確認
SELECT 
  'トリガー確認' as check_type,
  trigger_name as name,
  '✅ 存在' as status
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
