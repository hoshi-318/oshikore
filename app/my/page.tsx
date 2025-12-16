import PostImageForm from "@/components/PostImageForm";
import ProfileSettings from "@/components/ProfileSettings";
import MyPageActions from "@/components/MyPageActions";
import MyPageContent from "@/components/MyPageContent";
import MyPageImageGrid from "@/components/MyPageImageGrid";
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import { getUserPosts } from "@/lib/posts";
import Link from "next/link";
import Image from "next/image";
import BottomTabBar from "@/components/BottomTabBar";

export default async function MyPage() {
  // 認証チェック
  // 未ログインの場合はトップページにリダイレクト
  const user = await checkAuth();
  if (!user) {
    redirect("/");
  }

  // 自分の投稿画像のみを取得（userIdでフィルタリング）
  const myPosts = await getUserPosts(user.id);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link href="/login" className="inline-block hover:opacity-80 transition-opacity">
            <Image
              src="/images/logo/logo.png"
              alt="Snapwith"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* ボタン */}
        <MyPageContent user={user} />

        {/* 自分の投稿画像一覧 */}
        <section>
          <h2 className="text-xl font-bold mb-4">{user.accountName}</h2>
          <MyPageImageGrid posts={myPosts} currentUserId={user.id} />
        </section>
      </main>

      {/* タブバー */}
      <BottomTabBar />
    </div>
  );
}
