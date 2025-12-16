// 認証関連のユーティリティ関数

import { createClient } from "@/lib/supabase/server";

export interface User {
  id: string;
  accountName: string;
  userId: string;
}

/**
 * 現在ログインしているユーザーを取得
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  
  // Supabaseのセッションを確認
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return null;
  }
  
  // プロフィール情報を取得
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (profileError || !profile) {
    return null;
  }
  
  // account_nameがNULLの場合は未登録としてnullを返す
  if (!profile.account_name) {
    return null;
  }
  
  return {
    id: user.id,
    accountName: profile.account_name,
    userId: profile.user_id,
  };
}

/**
 * 認証チェック
 * 未ログインの場合はnullを返す
 */
export async function checkAuth(): Promise<User | null> {
  return await getCurrentUser();
}

/**
 * 指定されたuser_idでユーザー情報を取得
 */
export async function getUserByUserId(userId: string): Promise<User | null> {
  const supabase = await createClient();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error || !profile) {
    return null;
  }
  
  return {
    id: profile.id,
    accountName: profile.account_name,
    userId: profile.user_id,
  };
}
