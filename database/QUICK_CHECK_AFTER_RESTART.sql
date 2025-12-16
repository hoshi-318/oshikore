-- プロジェクト再開後のデータベース状態確認SQL

-- 1. テーブルの存在確認
SELECT 
    'テーブル確認' as check_type,
    table_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = t.table_name
        ) THEN '✅ 存在' 
        ELSE '❌ 不存在 - database/schema.sqlを実行してください' 
    END as status
FROM (VALUES ('profiles'), ('posts')) t(table_name);

-- 2. テーブルが存在する場合、カラムの確認
SELECT 
    'カラム確認 - profiles' as check_type,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

SELECT 
    'カラム確認 - posts' as check_type,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'posts'
ORDER BY ordinal_position;

-- 3. トリガーの確認
SELECT 
    'トリガー確認' as check_type,
    trigger_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name = t.trigger_name
        ) THEN '✅ 存在' 
        ELSE '❌ 不存在' 
    END as status
FROM (VALUES ('on_auth_user_created')) t(trigger_name);

