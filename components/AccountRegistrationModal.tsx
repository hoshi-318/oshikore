"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AccountRegistrationModalProps {
  onClose: () => void;
  onComplete: () => void;
}

export default function AccountRegistrationModal({
  onClose,
  onComplete,
}: AccountRegistrationModalProps) {
  const [accountName, setAccountName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // TODO: アカウント名登録処理を実装
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim()) {
      alert("アカウント名を入力してください");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // await registerAccountName(accountName);
      console.log("アカウント名登録:", accountName);
      
      // 開発用: 一時的な認証状態をクッキーに保存（X認証実装前の一時対応）
      const userId = `dev_${Date.now()}`;
      document.cookie = `dev_account_name=${encodeURIComponent(accountName)}; path=/; max-age=86400`; // 24時間
      document.cookie = `dev_user_id=${userId}; path=/; max-age=86400`; // 24時間
      
      // 登録完了コールバックを実行
      onComplete();
      
      // 少し待ってからマイページに強制遷移（クッキーが保存されるのを待つ）
      setTimeout(() => {
        window.location.href = "/my";
      }, 100);
    } catch (error) {
      console.error("アカウント名登録エラー:", error);
      alert("アカウント名の登録に失敗しました");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">アカウント名を登録</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="accountName" className="block text-sm font-medium mb-2">
              アカウント名（任意の名前を入力）
            </label>
            <input
              type="text"
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="例: 推しファン"
              maxLength={50}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "登録中..." : "登録"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
