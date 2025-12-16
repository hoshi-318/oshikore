"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";

interface User {
  id: string;
  accountName: string;
  userId: string;
}

interface ProfileSettingsProps {
  user: User;
  onClose: () => void;
}

export default function ProfileSettings({ user, onClose }: ProfileSettingsProps) {
  const [accountName, setAccountName] = useState(user.accountName);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // アカウント名変更処理
  const handleSaveAccountName = async () => {
    if (!accountName.trim()) {
      setError("アカウント名を入力してください");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // プロフィールを更新
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ account_name: accountName.trim() })
        .eq("id", user.id);

      if (updateError) {
        console.error("アカウント名変更エラー:", updateError);
        setError("アカウント名の変更に失敗しました");
        setIsSubmitting(false);
        return;
      }

      setIsEditing(false);
      router.refresh(); // ページを更新して最新の情報を取得
    } catch (err) {
      console.error("アカウント名変更エラー:", err);
      setError("アカウント名の変更に失敗しました");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">プロフィール設定</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors"
            aria-label="閉じる"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* アカウント名 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">アカウント名</label>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => {
                    setAccountName(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  maxLength={50}
                  disabled={isSubmitting}
                />
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveAccountName}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "保存中..." : "保存"}
                  </button>
                  <button
                    onClick={() => {
                      setAccountName(user.accountName);
                      setIsEditing(false);
                      setError(null);
                    }}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-lg">{user.accountName}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-gray-600 hover:text-black underline"
                >
                  変更
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ログアウトボタン */}
        <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
          <button
            onClick={async () => {
              try {
                setIsLoggingOut(true);
                await signOut();
                router.push("/");
                router.refresh();
              } catch (error) {
                console.error("ログアウトエラー:", error);
                alert("ログアウトに失敗しました");
                setIsLoggingOut(false);
              }
            }}
            disabled={isLoggingOut}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "ログアウト中..." : "ログアウト"}
          </button>
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            className="w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
