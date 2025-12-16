"use client";

import { useState, useEffect } from "react";
import ImageGrid from "./ImageGrid";
import ImageDetailModal from "./ImageDetailModal";
import { PostImage } from "@/lib/posts";
import { createClient } from "@/lib/supabase/client";

interface MyPageImageGridProps {
  posts: PostImage[];
  currentUserId: string;
}

export default function MyPageImageGrid({ posts: initialPosts, currentUserId }: MyPageImageGridProps) {
  const [selectedPost, setSelectedPost] = useState<PostImage | null>(null);
  const [posts, setPosts] = useState<PostImage[]>(initialPosts);

  // 親コンポーネントから渡されたpostsが更新されたときに同期
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

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
      <ImageGrid
        images={posts}
        onImageClick={(post) => setSelectedPost(post)}
      />
      {selectedPost && (
        <ImageDetailModal
          post={selectedPost}
          posts={posts}
          onClose={() => setSelectedPost(null)}
          currentUserId={currentUserId}
          onPostUpdate={handlePostUpdate}
        />
      )}
    </>
  );
}

