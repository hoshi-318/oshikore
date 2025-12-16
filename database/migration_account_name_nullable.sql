-- account_nameをNULL許可に変更するマイグレーション
-- 既存のデータベースに適用する場合に実行してください

-- account_nameカラムをNULL許可に変更
ALTER TABLE profiles ALTER COLUMN account_name DROP NOT NULL;

-- handle_new_user関数を更新して、account_nameをNULLで作成するように変更
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_user_id TEXT;
BEGIN
  -- 一意のuser_idを生成（UUIDの最初の8文字を使用）
  new_user_id := substring(replace(gen_random_uuid()::text, '-', ''), 1, 8);
  
  -- プロフィールを作成（account_nameはNULLのまま。後でユーザーが登録する）
  INSERT INTO profiles (id, user_id, account_name)
  VALUES (
    NEW.id,
    new_user_id,
    NULL  -- 初期値はNULL。初回ログイン時にアカウント名登録ページで設定される
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
