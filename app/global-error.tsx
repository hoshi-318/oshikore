"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              再試行
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
