import ImageGrid from "@/components/ImageGrid";
import PostButton from "@/components/PostButton";
import { getUserPostsByUserId } from "@/lib/posts";
import { getUserByUserId } from "@/lib/auth";

interface UserPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { userId } = await params;
  
  // ユーザー情報を取得
  const user = await getUserByUserId(userId);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">ユーザーが見つかりません</h2>
          <p className="text-gray-600">指定されたユーザーは存在しません。</p>
        </div>
      </div>
    );
  }
  
  // 指定ユーザーの投稿画像を取得
  const userPosts = await getUserPostsByUserId(userId);

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <h1 className="text-xl font-bold">{user.accountName}</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 投稿ボタン */}
        <div className="mb-6 text-center">
          <PostButton />
        </div>

        {/* ユーザーの投稿画像一覧 */}
        <section>
          <h2 className="text-xl font-bold mb-4">投稿一覧</h2>
          <ImageGrid images={userPosts} />
        </section>
      </main>
    </div>
  );
}
