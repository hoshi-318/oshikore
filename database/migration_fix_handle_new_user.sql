-- handle_new_user関数を改善して、user_idの重複を防ぐ
-- このマイグレーションを実行してください

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
