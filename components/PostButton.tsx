"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostButton() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // TODO: 認証状態を取得

  const handleClick = () => {
    if (isAuthenticated) {
      router.push("/my");
    } else {
      router.push("/");
      // TODO: ログインを促すメッセージを表示
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
    >
      投稿する
    </button>
  );
}
