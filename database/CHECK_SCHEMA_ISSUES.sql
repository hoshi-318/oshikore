-- スキーマ関連の問題を診断するSQL
-- このSQLを実行して、問題の原因を特定してください

-- 1. 現在のデータベース名を確認
SELECT current_database() as current_database;

-- 2. 現在のスキーマ検索パスを確認
SHOW search_path;

-- 3. publicスキーマ内のテーブルを確認
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname IN ('public', 'auth')
ORDER BY schemaname, tablename;

-- 4. profilesテーブルがどのスキーマに存在するか確認
SELECT 
  schemaname,
  tablename
FROM pg_tables
WHERE tablename = 'profiles';

-- 5. トリガー関数の現在の定義を確認
SELECT 
  routine_name,
  routine_schema,
  routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
AND routine_schema = 'public';

-- 6. auth.usersテーブルに設定されているトリガーを確認
SELECT 
  trigger_name,
  event_object_schema,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users'
AND trigger_name = 'on_auth_user_created';

-- 7. public.profilesテーブルへのアクセス権限を確認
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
AND table_name = 'profiles';

-- 8. 現在のユーザーを確認
SELECT current_user as current_user, session_user as session_user;
