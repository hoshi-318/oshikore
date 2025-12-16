-- トリガー関数を修正して、スキーマ修飾子を明示的に指定
-- このSQLを実行すると、トリガー関数が確実にprofilesテーブルを見つけられるようになります

-- 1. まず、トリガー関数を削除して再作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 2. スキーマ修飾子を明示的に指定したトリガー関数を作成
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
    
    -- 既存のuser_idと重複していないか確認（スキーマ修飾子を明示的に指定）
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = new_user_id) THEN
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
  
  -- プロフィールを作成（account_nameはNULLのまま。スキーマ修飾子を明示的に指定）
  BEGIN
    INSERT INTO public.profiles (id, user_id, account_name)
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
      INSERT INTO public.profiles (id, user_id, account_name)
      VALUES (
        NEW.id,
        new_user_id,
        NULL
      );
    WHEN OTHERS THEN
      -- その他のエラーは再スロー（エラーメッセージを詳細に）
      RAISE EXCEPTION 'handle_new_userエラー: % (profilesテーブル参照)', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. トリガーを再作成
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION handle_new_user();

-- 4. 完了メッセージ
SELECT '✅ トリガー関数がスキーマ修飾子付きで再作成されました' as message;
