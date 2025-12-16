"use client";

import { useState, useMemo, useEffect } from "react";
import ImageGrid from "./ImageGrid";
import ImageDetailModal from "./ImageDetailModal";
import SearchBar from "./SearchBar";
import { PostImage } from "@/lib/posts";
import { createClient } from "@/lib/supabase/client";

interface HomePageContentProps {
  posts: PostImage[];
}

export default function HomePageContent({ posts: initialPosts }: HomePageContentProps) {
  const [selectedPost, setSelectedPost] = useState<PostImage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostImage[]>(initialPosts);
  const supabase = createClient();

  // 現在のユーザーIDを取得
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  // 親コンポーネントから渡されたpostsが更新されたときに同期
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  // 検索フィルタリング
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase().trim();
    return posts.filter((post) => {
      // タグで検索
      const tagMatch = post.tags?.some((tag) =>
        tag.toLowerCase().includes(query)
      );

      // コメントで検索
      const commentMatch = post.description?.toLowerCase().includes(query);

      return tagMatch || commentMatch;
    });
  }, [posts, searchQuery]);

  const handlePostUpdate = (updatedPost: PostImage) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
    if (selectedPost && selectedPost.id === updatedPost.id) {
      setSelectedPost(updatedPost);
    }
  };

  return (
    <>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <ImageGrid
        images={filteredPosts}
        onImageClick={(post) => setSelectedPost(post)}
        columns={3}
      />
      {selectedPost && (
        <ImageDetailModal
          post={selectedPost}
          posts={filteredPosts}
          onClose={() => setSelectedPost(null)}
          currentUserId={currentUserId}
          onPostUpdate={handlePostUpdate}
        />
      )}
    </>
  );
}

