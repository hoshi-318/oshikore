"use client";

interface ErrorMessageProps {
  error: string;
  description?: string | null;
}

export default function ErrorMessage({ error, description }: ErrorMessageProps) {
  // エラーメッセージのマッピング
  const errorMessages: { [key: string]: string } = {
    server_error: "認証エラーが発生しました",
    auth_failed: "認証に失敗しました",
    user_not_found: "ユーザー情報の取得に失敗しました",
    oauth1_detected: "OAuth設定に問題があります。SupabaseのコールバックURL設定を確認してください",
    no_code: "認証コードが取得できませんでした",
    database_error: "データベースエラーが発生しました",
  };

  const errorMessage = errorMessages[error] || "エラーが発生しました";
  const displayDescription = description || "";

  // メールアドレス取得エラーの場合の特別なメッセージ
  const isEmailError = displayDescription.includes("email") || displayDescription.includes("Email");
  
  // データベースエラーの詳細を確認（displayDescriptionの後に定義）
  const isTableMissing = displayDescription.includes("does not exist") || 
                         displayDescription.includes("relation") ||
                         displayDescription.includes("profiles");

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start">
        <svg
          className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-1">{errorMessage}</h3>
          {isEmailError && (
            <div className="text-sm text-red-700 mt-2">
              <p className="font-medium mb-2">X（Twitter）認証の設定が必要です：</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Supabase Dashboard → Authentication → Providers → Twitter</li>
                <li><strong>「Confirm email」のチェックを外してください</strong>（重要）</li>
                <li><strong>「Attributes」セクション</strong>で、Emailを必須（Required）から任意（Optional）に変更</li>
                <li>Authentication → Settings → 「Enable email confirmations」を無効化</li>
                <li>「Save」をクリック</li>
                <li>ブラウザをリロードして再度ログインを試してください</li>
              </ol>
              <p className="mt-2 text-xs bg-red-100 p-2 rounded">
                <strong>重要:</strong> X（Twitter）はメールアドレスを提供しないため、メール確認を必須にすることはできません。
                詳細は <code className="bg-white px-1 rounded">X_AUTH_ATTRIBUTES_FIX.md</code> を参照してください
              </p>
            </div>
          )}
          {isTableMissing && (
            <div className="text-sm text-red-700 mt-2">
              <p className="font-medium mb-2">データベーステーブルが存在しません：</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Supabase Dashboard → SQL Editorを開く</li>
                <li><strong>database/schema.sql</strong> の内容をすべてコピーして実行</li>
                <li>エラーが発生しないことを確認</li>
                <li>ブラウザをリロードして再度ログインを試してください</li>
              </ol>
              <p className="mt-2 text-xs bg-red-100 p-2 rounded">
                詳細は <code className="bg-white px-1 rounded">database/SETUP_INSTRUCTIONS.md</code> を参照してください
              </p>
            </div>
          )}
          {displayDescription && !isEmailError && !isTableMissing && (
            <p className="text-xs text-red-600 mt-1">{displayDescription}</p>
          )}
        </div>
      </div>
    </div>
  );
}
