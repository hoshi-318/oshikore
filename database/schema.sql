-- Snapwith データベーススキーマ

-- プロフィールテーブル
-- Supabase Authのusersテーブルと1対1の関係
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL, -- 一意の個人URL用ID
  account_name TEXT, -- アカウント名（初回ログイン時はNULL、登録後に設定）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 投稿テーブル
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL, -- Cloudinaryの画像URL
  comment TEXT, -- 自由説明コメント
  tags TEXT[], -- 写っている人物のタグ配列
  stamps JSONB, -- スタンプ配置情報 [{"id": "string", "x": number, "y": number}]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- インデックス作成（検索パフォーマンス向上）
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);

-- RLS (Row Level Security) ポリシー設定

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "プロフィールは誰でも閲覧可能" ON profiles;
DROP POLICY IF EXISTS "自分のプロフィールのみ作成可能" ON profiles;
DROP POLICY IF EXISTS "自分のプロフィールのみ更新可能" ON profiles;
DROP POLICY IF EXISTS "投稿は誰でも閲覧可能" ON posts;
DROP POLICY IF EXISTS "自分の投稿のみ作成可能" ON posts;
DROP POLICY IF EXISTS "自分の投稿のみ更新可能" ON posts;
DROP POLICY IF EXISTS "自分の投稿のみ削除可能" ON posts;

-- profilesテーブルのRLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- プロフィールは誰でも閲覧可能
CREATE POLICY "プロフィールは誰でも閲覧可能"
  ON profiles FOR SELECT
  USING (true);

-- 自分のプロフィールのみ作成可能（初回ログイン時）
CREATE POLICY "自分のプロフィールのみ作成可能"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 自分のプロフィールのみ更新可能
CREATE POLICY "自分のプロフィールのみ更新可能"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- postsテーブルのRLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 投稿は誰でも閲覧可能
CREATE POLICY "投稿は誰でも閲覧可能"
  ON posts FOR SELECT
  USING (true);

-- 自分の投稿のみ作成可能
CREATE POLICY "自分の投稿のみ作成可能"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 自分の投稿のみ更新可能
CREATE POLICY "自分の投稿のみ更新可能"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

-- 自分の投稿のみ削除可能
CREATE POLICY "自分の投稿のみ削除可能"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- updated_atを自動更新する関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 既存のトリガーを削除（存在する場合）
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- updated_at自動更新のトリガー
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- プロフィール作成を自動化する関数（ユーザー登録時）
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_user_id TEXT;
  retry_count INTEGER := 0;
  max_retries INTEGER := 10;
BEGIN
  -- 一意のuser_idを生成（重複チェック付き）
  LOOP
    -- UUIDの最初の8文字を使用
    new_user_id := substring(replace(gen_random_uuid()::text, '-', ''), 1, 8);
    
    -- 既存のuser_idと重複していないか確認
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = new_user_id) THEN
      EXIT; -- 重複がない場合はループを抜ける
    END IF;
    
    -- リトライ回数をチェック
    retry_count := retry_count + 1;
    IF retry_count >= max_retries THEN
      -- 最大リトライ回数に達した場合は、タイムスタンプを含める
      new_user_id := substring(replace(gen_random_uuid()::text, '-', ''), 1, 6) || 
                     substring(replace(extract(epoch from now())::text, '.', ''), -2, 2);
      EXIT;
    END IF;
  END LOOP;
  
  -- プロフィールを作成（account_nameはNULLのまま。後でユーザーが登録する）
  BEGIN
    INSERT INTO profiles (id, user_id, account_name)
    VALUES (
      NEW.id,
      new_user_id,
      NULL  -- 初期値はNULL。初回ログイン時にアカウント名登録ページで設定される
    );
  EXCEPTION
    WHEN unique_violation THEN
      -- user_idの重複エラーが発生した場合、再試行
      -- この場合は、より長いuser_idを生成
      new_user_id := substring(replace(gen_random_uuid()::text, '-', ''), 1, 12);
      INSERT INTO profiles (id, user_id, account_name)
      VALUES (
        NEW.id,
        new_user_id,
        NULL
      );
    WHEN OTHERS THEN
      -- その他のエラーは再スロー
      RAISE;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザー作成時にプロフィールを自動生成するトリガー
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
