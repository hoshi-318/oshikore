"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithX } from "@/lib/auth/client";
import { getSession } from "@/lib/auth/client";

export default function LoginButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ログイン状態を確認
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const session = await getSession();
    setIsAuthenticated(!!session);
    setIsLoading(false);
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      console.log("ログインボタンがクリックされました");
      const result = await signInWithX();
      console.log("signInWithX の結果:", result);
      // X認証はリダイレクトされるため、ここでは何もしない
      // リダイレクトされない場合、エラーハンドリングでキャッチされる
    } catch (error) {
      console.error("ログインエラー:", error);
      const errorMessage = error instanceof Error ? error.message : "ログインに失敗しました";
      alert(`ログインに失敗しました: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
      >
        読み込み中...
      </button>
    );
  }

  if (isAuthenticated) {
    return null; // ログイン済みの場合は非表示
  }

  return (
    <button
      onClick={handleLogin}
      className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
    >
      Xでログイン
    </button>
  );
}
