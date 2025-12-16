-- セットアップの完全確認用SQL
-- このSQLを実行して、すべての設定が正しいか確認してください

-- 1. テーブルの存在確認
SELECT 
  'テーブル存在確認' as check_type,
  table_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = t.table_name
  ) THEN '✅ 存在' ELSE '❌ 不存在' END as status
FROM (SELECT 'profiles' as table_name UNION SELECT 'posts') t;

-- 2. profilesテーブルのカラム確認
SELECT 
  'profilesテーブルのカラム' as check_type,
  column_name,
  data_type,
  is_nullable,
  CASE 
    WHEN column_name IN ('id', 'user_id', 'account_name', 'created_at', 'updated_at') THEN '✅ 必要'
    ELSE '⚠️ 不要の可能性'
  END as required
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY 
  CASE column_name
    WHEN 'id' THEN 1
    WHEN 'user_id' THEN 2
    WHEN 'account_name' THEN 3
    WHEN 'created_at' THEN 4
    WHEN 'updated_at' THEN 5
    ELSE 6
  END;

-- 3. postsテーブルのカラム確認
SELECT 
  'postsテーブルのカラム' as check_type,
  column_name,
  data_type,
  is_nullable,
  CASE 
    WHEN column_name IN ('id', 'user_id', 'image_url', 'comment', 'tags', 'stamps', 'created_at', 'updated_at') THEN '✅ 必要'
    ELSE '⚠️ 不要の可能性'
  END as required
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'posts'
ORDER BY 
  CASE column_name
    WHEN 'id' THEN 1
    WHEN 'user_id' THEN 2
    WHEN 'image_url' THEN 3
    WHEN 'comment' THEN 4
    WHEN 'tags' THEN 5
    WHEN 'stamps' THEN 6
    WHEN 'created_at' THEN 7
    WHEN 'updated_at' THEN 8
    ELSE 9
  END;

-- 4. トリガー関数の存在確認
SELECT 
  'トリガー関数' as check_type,
  routine_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_schema = 'public' AND routine_name = r.routine_name
  ) THEN '✅ 存在' ELSE '❌ 不存在' END as status
FROM (SELECT 'handle_new_user' as routine_name UNION SELECT 'update_updated_at_column') r;

-- 5. トリガーの存在確認
SELECT 
  'トリガー' as check_type,
  trigger_name,
  event_object_table,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = t.trigger_name
  ) THEN '✅ 存在' ELSE '❌ 不存在' END as status
FROM (
  SELECT 'on_auth_user_created' as trigger_name, 'auth.users' as event_object_table
  UNION SELECT 'update_profiles_updated_at', 'profiles'
  UNION SELECT 'update_posts_updated_at', 'posts'
) t;

-- 6. RLSポリシーの確認
SELECT 
  'RLSポリシー' as check_type,
  tablename,
  policyname,
  CASE 
    WHEN policyname LIKE '%閲覧%' OR policyname LIKE '%SELECT%' THEN 'SELECT'
    WHEN policyname LIKE '%作成%' OR policyname LIKE '%INSERT%' THEN 'INSERT'
    WHEN policyname LIKE '%更新%' OR policyname LIKE '%UPDATE%' THEN 'UPDATE'
    WHEN policyname LIKE '%削除%' OR policyname LIKE '%DELETE%' THEN 'DELETE'
    ELSE 'OTHER'
  END as policy_type
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'posts')
ORDER BY tablename, policyname;
