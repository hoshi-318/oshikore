"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PostImage } from "@/lib/posts";
import PostEditModal from "./PostEditModal";

interface ImageDetailModalProps {
  post: PostImage | null;
  posts: PostImage[];
  onClose: () => void;
  currentUserId?: string | null;
  onPostUpdate?: (updatedPost: PostImage) => void;
}

export default function ImageDetailModal({
  post,
  posts,
  onClose,
  currentUserId,
  onPostUpdate,
}: ImageDetailModalProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // 現在の投稿のインデックスを検索
  useEffect(() => {
    if (post) {
      const index = posts.findIndex((p) => p.id === post.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [post, posts]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : posts.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < posts.length - 1 ? prev + 1 : 0));
  };

  // キーボードイベント（矢印キーで切り替え）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : posts.length - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < posts.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [posts.length, onClose]);

  if (!post || posts.length === 0) return null;

  const currentPost = posts[currentIndex];
  const isOwnPost = currentUserId && currentPost.userId === currentUserId;

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev < posts.length - 1 ? prev + 1 : 0));
    } else if (isRightSwipe) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : posts.length - 1));
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    setShowEditModal(true);
  };

  const handleSave = (updatedPost: PostImage) => {
    if (onPostUpdate) {
      onPostUpdate(updatedPost);
    }
    // 投稿リストを更新
    const updatedPosts = posts.map((p) =>
      p.id === updatedPost.id ? updatedPost : p
    );
    // 現在のインデックスの投稿を更新
    setCurrentIndex((prev) => {
      const newIndex = updatedPosts.findIndex((p) => p.id === updatedPost.id);
      return newIndex !== -1 ? newIndex : prev;
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー（閉じるボタンとメニュー） */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1"></div>
          <div className="flex items-center gap-2 relative">
            {isOwnPost && (
              <div className="relative flex items-center">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-white hover:text-gray-300 transition-colors z-10 relative flex items-center justify-center"
                  aria-label="メニュー"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-[105]"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg py-2 z-[106] min-w-[120px]">
                      <button
                        onClick={handleEdit}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        編集
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors z-10 relative flex items-center justify-center"
              aria-label="閉じる"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 画像 */}
        <div
          ref={imageContainerRef}
          className="relative w-full h-[60vh] bg-gray-900 rounded-lg overflow-hidden mb-4 flex-shrink-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {posts.length > 1 && (
            <>
              {/* 前へボタン */}
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 z-20 transition-opacity"
                aria-label="前の画像"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              {/* 次へボタン */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 z-20 transition-opacity"
                aria-label="次の画像"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
          <Image
            key={currentPost.id}
            src={currentPost.url}
            alt={currentPost.description || "投稿画像"}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* タグとコメント */}
        <div className="bg-white rounded-lg p-6 space-y-4 flex-shrink-0 overflow-y-auto">
          {/* タグ */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">タグ</h3>
              <div className="flex flex-wrap gap-2">
                {currentPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* コメント */}
          {currentPost.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">コメント</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{currentPost.description}</p>
            </div>
          )}

          {/* タグもコメントもない場合 */}
          {(!currentPost.tags || currentPost.tags.length === 0) && !currentPost.description && (
            <p className="text-gray-500 text-sm">タグやコメントはありません</p>
          )}
        </div>
      </div>

      {/* 編集モーダル */}
      {showEditModal && currentPost && (
        <PostEditModal
          post={currentPost}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

