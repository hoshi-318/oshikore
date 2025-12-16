// 投稿関連のユーティリティ関数

import { createClient } from "@/lib/supabase/server";

export interface PostImage {
  id: string;
  url: string;
  description?: string;
  userId: string;
  createdAt: string;
  tags?: string[];
  stamps?: Array<{ id: string; x: number; y: number }>;
}

// ImageGrid用の型（PostImageの簡易版）
export type ImageItem = Pick<PostImage, 'id' | 'url' | 'description'>;

/**
 * 指定ユーザーID（UUID）の投稿画像を取得
 * 自分の投稿画像のみを返す
 */
export async function getUserPosts(userId: string): Promise<PostImage[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)  // 指定ユーザーの投稿のみを取得
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
  
  if (!data) {
    return [];
  }
  
  return data.map(post => ({
    id: post.id,
    url: post.image_url,
    description: post.comment || undefined,
    userId: post.user_id,
    createdAt: post.created_at,
    tags: post.tags || [],
    stamps: post.stamps || [],
  }));
}

/**
 * user_id（短いID）でユーザーの投稿画像を取得
 */
export async function getUserPostsByUserId(userId: string): Promise<PostImage[]> {
  const supabase = await createClient();
  
  // まずプロフィールからUUIDを取得
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  if (profileError || !profile) {
    return [];
  }
  
  // UUIDで投稿を取得
  return await getUserPosts(profile.id);
}

/**
 * 最新の投稿画像を取得（全ユーザー）
 */
export async function getLatestPosts(limit: number = 20): Promise<PostImage[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching latest posts:', error);
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    return data.map(post => ({
      id: post.id,
      url: post.image_url,
      description: post.comment || undefined,
      userId: post.user_id,
      createdAt: post.created_at,
      tags: post.tags || [],
      stamps: post.stamps || [],
    }));
  } catch (error) {
    console.error('Error in getLatestPosts:', error);
    // エラーが発生した場合は空配列を返す（ページは表示される）
    return [];
  }
}

/**
 * 投稿を作成
 */
export interface CreatePostData {
  imageUrl: string;
  comment?: string;
  tags?: string[];
  stamps?: Array<{ id: string; x: number; y: number }>;
}

export async function createPost(
  userId: string,
  postData: CreatePostData
): Promise<PostImage | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: userId,
      image_url: postData.imageUrl,
      comment: postData.comment || null,
      tags: postData.tags || [],
      stamps: postData.stamps || [],
    })
    .select()
    .single();

  if (error) {
    console.error("投稿作成エラー:", error);
    return null;
  }

  return {
    id: data.id,
    url: data.image_url,
    description: data.comment || undefined,
    userId: data.user_id,
    createdAt: data.created_at,
    tags: data.tags || [],
    stamps: data.stamps || [],
  };
}
