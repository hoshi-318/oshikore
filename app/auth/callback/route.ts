// X認証のコールバック処理

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const errorParam = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const oauthToken = requestUrl.searchParams.get("oauth_token");
  const oauthVerifier = requestUrl.searchParams.get("oauth_verifier");
  const next = requestUrl.searchParams.get("next") || "/my";

  // OAuth 1.0aのトークンが含まれている場合（これはSupabaseのコールバックURLに直接アクセスした場合）
  // 通常はSupabaseが処理するため、ここには到達しないはず
  if (oauthToken && oauthVerifier) {
    console.warn("OAuth 1.0aトークンが検出されました。SupabaseのコールバックURL設定を確認してください。");
    return NextResponse.redirect(new URL("/?error=oauth1_detected", requestUrl.origin));
  }

  // エラーパラメータがある場合はエラーページにリダイレクト
  if (errorParam) {
    console.error("認証エラー:", errorParam, errorDescription);
    return NextResponse.redirect(new URL(`/?error=${errorParam}&error_description=${encodeURIComponent(errorDescription || "")}`, requestUrl.origin));
  }

  if (code) {
    const supabase = await createClient();
    
    // 認証コードをセッションに交換
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("認証コード交換エラー:", exchangeError);
      
      // データベースエラーの場合、詳細を確認
      if (exchangeError.message.includes("Database error") || exchangeError.message.includes("saving new user")) {
        console.error("データベースエラーが発生しました。プロフィール作成に失敗している可能性があります。", exchangeError);
        console.error("エラー詳細:", JSON.stringify(exchangeError, null, 2));
        
        // エラーの詳細を取得
        let errorMsg = "プロフィールの作成に失敗しました。";
        
        // テーブルが存在しない場合
        if (exchangeError.message.includes("does not exist") || exchangeError.message.includes("relation")) {
          errorMsg = "データベーステーブルが存在しません。database/schema.sqlを実行してください。";
        }
        // その他のデータベースエラー
        else if (exchangeError.message) {
          errorMsg = `データベースエラー: ${exchangeError.message}`;
        }
        
        return NextResponse.redirect(new URL(`/?error=database_error&error_description=${encodeURIComponent(errorMsg)}`, requestUrl.origin));
      }
      
      return NextResponse.redirect(new URL(`/?error=auth_failed&error_description=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin));
    }

    // ユーザー情報を取得
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("ユーザー情報取得エラー:", userError);
      return NextResponse.redirect(new URL("/?error=user_not_found", requestUrl.origin));
    }

    // プロフィールが存在するか確認（エラーも含めて確認）
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log("プロフィール確認結果:", { profile, profileError, userId: user.id });

    // プロフィールが存在しない場合は作成を試みる（トリガーが動作していない場合のフォールバック）
    if (profileError || !profile) {
      console.log("プロフィールが存在しないため、作成を試みます...");
      
      // 一意のuser_idを生成（UUIDの最初の8文字を使用、トリガーと同じ方法）
      // 簡易版: ランダムな8文字の文字列を生成
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let newUserId = '';
      for (let i = 0; i < 8; i++) {
        newUserId += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      // プロフィールを作成
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          user_id: newUserId,
          account_name: null, // 初期値はNULL
        });

      if (insertError) {
        // 既に存在する場合（競合）やその他のエラー
        console.error("プロフィール作成エラー:", insertError);
        // 再度取得を試みる
        const { data: retryProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        console.log("再取得したプロフィール:", retryProfile);
        
        if (!retryProfile || !retryProfile.account_name) {
          console.log("アカウント名が未登録のため、登録ページにリダイレクトします（再取得後）");
          return NextResponse.redirect(new URL("/auth/register", requestUrl.origin));
        }
      } else {
        // プロフィール作成成功、アカウント名登録ページにリダイレクト
        console.log("プロフィール作成成功、アカウント名登録ページにリダイレクトします");
        return NextResponse.redirect(new URL("/auth/register", requestUrl.origin));
      }
    }

    // プロフィールが存在するが、account_nameがない場合（NULLまたは空文字列）は、アカウント名登録ページにリダイレクト
    if (profile && (!profile.account_name || profile.account_name.trim() === "")) {
      console.log("アカウント名が未登録のため、登録ページにリダイレクトします", { account_name: profile.account_name });
      return NextResponse.redirect(new URL("/auth/register", requestUrl.origin));
    }

    // 認証成功時は指定されたページにリダイレクト（デフォルトはマイページ）
    console.log("プロフィールとアカウント名が存在するため、マイページにリダイレクトします", { account_name: profile?.account_name });
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  // コードがない場合はトップページにリダイレクト
  return NextResponse.redirect(new URL("/?error=no_code", requestUrl.origin));
}
