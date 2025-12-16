"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("ログアウトエラー:", error);
      alert("ログアウトに失敗しました");
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="bg-gray-200 text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
    >
      {isLoading ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}
