"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AccountRegistrationFormProps {
  userId: string;
}

export default function AccountRegistrationForm({ userId }: AccountRegistrationFormProps) {
  const [accountName, setAccountName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim()) {
      setError("アカウント名を入力してください");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // プロフィールを更新（user_idは既に作成されているため、account_nameのみ更新）
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ account_name: accountName.trim() })
        .eq("id", userId);

      if (updateError) {
        console.error("プロフィール更新エラー:", updateError);
        setError("アカウント名の登録に失敗しました");
        setIsSubmitting(false);
        return;
      }

      // 成功時はマイページに遷移
      router.push("/my");
      router.refresh();
    } catch (err) {
      console.error("アカウント名登録エラー:", err);
      setError("アカウント名の登録に失敗しました");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">アカウント名を登録</h2>
      <p className="text-gray-600 mb-6">
        Snapwithを使用するために、アカウント名を登録してください。
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="accountName" className="block text-sm font-medium mb-2">
            アカウント名（任意の名前を入力）
          </label>
          <input
            type="text"
            id="accountName"
            value={accountName}
            onChange={(e) => {
              setAccountName(e.target.value);
              setError(null);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="例: 推しファン"
            maxLength={50}
            disabled={isSubmitting}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "登録中..." : "登録"}
        </button>
      </form>
    </div>
  );
}
