-- Supabase Auth設定でメールアドレスを必須にしない設定
-- このマイグレーションは、X（Twitter）認証でメールアドレスエラーが発生する場合に実行してください

-- 注意: SupabaseのAuth設定は主にDashboardで行いますが、
-- 一部の設定はauth.configテーブルで管理されています

-- auth.usersテーブルのemailカラムをNULL許可にする（既にNULL許可の可能性がありますが、念のため）
-- 注意: この操作はSupabaseの内部テーブルなので、直接変更は推奨されません
-- 代わりに、Supabase Dashboardで設定を確認してください

-- 推奨される解決方法:
-- 1. Supabase Dashboard → Authentication → Settings
-- 2. 「Enable email confirmations」を無効化
-- 3. 「Disable sign ups」が有効になっている場合は、OAuthプロバイダーを除外
-- 4. Authentication → Providers → Twitter → 「Confirm email」を無効化

-- このSQLは参考用です。実際の設定はSupabase Dashboardで行ってください。
