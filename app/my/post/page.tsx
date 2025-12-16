import PostImageForm from "@/components/PostImageForm";
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import Link from "next/link";

export default async function PostPage() {
  // 認証チェック
  // 未ログインの場合はトップページにリダイレクト
  const user = await checkAuth();
  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/my" className="text-gray-600 hover:text-black transition-colors">
            ← 戻る
          </Link>
          <h1 className="text-xl font-bold">画像を投稿</h1>
          <div className="w-12"></div> {/* 中央寄せのためのスペーサー */}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <PostImageForm />
      </main>
    </div>
  );
}
