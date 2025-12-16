"use client";

import Image from "next/image";
import { PostImage } from "@/lib/posts";

export interface ImageItem {
  id: string;
  url: string;
  description?: string;
}

interface ImageGridProps {
  images: PostImage[];
  onImageClick?: (post: PostImage) => void;
  columns?: 2 | 3;
}

export default function ImageGrid({ images, onImageClick, columns = 2 }: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        まだ投稿がありません
      </div>
    );
  }

  const gridColsClass = columns === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className={`grid ${gridColsClass} gap-4`}>
      {images.map((image) => (
        <div
          key={image.id}
          className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onImageClick?.(image)}
        >
          <Image
            src={image.url}
            alt={image.description || "投稿画像"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
