// クライアント側の認証関連ユーティリティ

import { createClient } from "@/lib/supabase/client";

/**
 * Xでログイン
 */
export async function signInWithX(redirectTo?: string) {
  try {
    const supabase = createClient();
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const callbackUrl = `${baseUrl}/auth/callback`;
    
    console.log("Xログイン開始 - Callback URL:", callbackUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "twitter",
      options: {
        redirectTo: redirectTo || callbackUrl,
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error("Xログインエラー:", error);
      console.error("エラー詳細:", JSON.stringify(error, null, 2));
      throw error;
    }

    console.log("Xログイン成功 - リダイレクト中...");
    return data;
  } catch (error) {
    console.error("signInWithX で例外が発生:", error);
    throw error;
  }
}

/**
 * ログアウト
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("ログアウトエラー:", error);
    throw error;
  }
}

/**
 * 現在のセッションを取得
 */
export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("セッション取得エラー:", error);
    return null;
  }

  return data.session;
}
