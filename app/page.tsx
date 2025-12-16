import ImageGrid from "@/components/ImageGrid";
import Logo from "@/components/Logo";
import { getLatestPosts } from "@/lib/posts";
import ErrorMessage from "@/components/ErrorMessage";
import BottomTabBar from "@/components/BottomTabBar";
import FloatingPostButton from "@/components/FloatingPostButton";
import HomePageContent from "@/components/HomePageContent";

interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // 最新20件の投稿画像を取得（エラーハンドリング付き）
  let latestPosts = [];
  try {
    latestPosts = await getLatestPosts(20);
  } catch (error) {
    console.error('投稿取得エラー:', error);
    // エラーが発生しても空配列で続行
  }

  // エラーパラメータを取得
  const error = typeof searchParams.error === 'string' ? searchParams.error : null;
  const errorDescription = typeof searchParams.error_description === 'string' 
    ? decodeURIComponent(searchParams.error_description) 
    : null;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Logo />
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* エラーメッセージ */}
        {error && <ErrorMessage error={error} description={errorDescription} />}

        {/* みんなの投稿画像グリッド */}
        <section>
          <h2 className="text-xl font-bold mb-4">みんなの投稿</h2>
          <HomePageContent posts={latestPosts} />
        </section>
      </main>

      {/* フローティング投稿ボタン */}
      <FloatingPostButton />

      {/* タブバー */}
      <BottomTabBar />
    </div>
  );
}
