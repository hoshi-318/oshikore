"use client";

import { useRouter } from "next/navigation";

export default function FloatingPostButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/my/post");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center z-40"
      aria-label="画像を投稿"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4V20M20 12H4"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
