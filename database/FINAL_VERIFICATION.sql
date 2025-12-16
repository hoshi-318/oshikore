-- 最終確認用SQL
-- すべてが正しく設定されているか確認してください

-- 1. テーブルの存在確認
SELECT 
  'テーブル確認' as check_type,
  tablename as name,
  '✅ 存在' as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'posts')
ORDER BY tablename;

-- 2. profilesテーブルのカラム確認
SELECT 
  'profilesカラム確認' as check_type,
  column_name as name,
  data_type,
  is_nullable,
  CASE 
    WHEN column_name = 'account_name' AND is_nullable = 'YES' THEN '✅ NULL許可（正しい）'
    WHEN column_name = 'account_name' AND is_nullable = 'NO' THEN '⚠️ NULL不許可（要修正）'
    ELSE '✅ OK'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. トリガー関数の存在確認
SELECT 
  'トリガー関数確認' as check_type,
  routine_name as name,
  '✅ 存在' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';

-- 4. トリガーの存在確認
SELECT 
  'トリガー確認' as check_type,
  trigger_name as name,
  event_object_table,
  '✅ 存在' as status
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 5. RLSポリシーの確認
SELECT 
  'RLSポリシー確認' as check_type,
  tablename as name,
  policyname,
  '✅ 存在' as status
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'posts')
ORDER BY tablename, policyname;
