"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PostImageForm() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [stamps, setStamps] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // TODO: 画像アップロード処理を実装
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // TODO: スタンプ配置処理を実装
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewUrl) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newStamp = {
      id: Date.now().toString(),
      x,
      y,
    };
    setStamps([...stamps, newStamp]);
  };

  const handleRemoveStamp = (id: string) => {
    setStamps(stamps.filter((s) => s.id !== id));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // 投稿処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      setError("画像を選択してください");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. 現在のユーザー情報を取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("ログインが必要です");
        setIsSubmitting(false);
        return;
      }

      // 2. 画像をCloudinaryにアップロード
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("tags", JSON.stringify(tags));
      formData.append("stamps", JSON.stringify(stamps));
      formData.append("comment", comment);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "画像のアップロードに失敗しました");
      }

      const { imageUrl } = await uploadResponse.json();

      // 3. 投稿データをSupabaseに保存
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          comment: comment || null,
          tags: tags.length > 0 ? tags : [],
          stamps: stamps.length > 0 ? stamps : [],
        })
        .select()
        .single();

      if (postError) {
        throw new Error("投稿の保存に失敗しました");
      }

      // 4. マイページにリダイレクト
      router.push("/my");
      router.refresh();
    } catch (err) {
      console.error("投稿エラー:", err);
      setError(err instanceof Error ? err.message : "投稿に失敗しました");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 画像選択・プレビュー */}
      <div>
        <label className="block text-sm font-medium mb-2">画像を選択</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        {previewUrl && (
          <div className="mt-4 relative aspect-square max-w-md mx-auto">
            <div
              className="w-full h-full relative bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
              onClick={handleImageClick}
            >
              <img
                src={previewUrl}
                alt="プレビュー"
                className="w-full h-full object-contain"
              />
              {stamps.map((stamp) => (
                <div
                  key={stamp.id}
                  className="absolute bg-white rounded-full w-8 h-8 border-2 border-black flex items-center justify-center cursor-pointer"
                  style={{
                    left: `${stamp.x}%`,
                    top: `${stamp.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveStamp(stamp.id);
                  }}
                >
                  <span className="text-xs font-bold">×</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              画像をクリックしてスタンプを配置
            </p>
          </div>
        )}
      </div>

      {/* タグ入力 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          写っている人物のタグ（複数入力可）
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="タグを入力"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            追加
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-gray-500 hover:text-black"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* コメント入力 */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          自由説明コメント
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="コメントを入力（任意）"
        />
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 投稿ボタン */}
      <button
        type="submit"
        disabled={!selectedImage || isSubmitting}
        className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "投稿中..." : "投稿する"}
      </button>
    </form>
  );
}
