import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import LoginButton from "@/components/LoginButton";
import Logo from "@/components/Logo";
import ErrorMessage from "@/components/ErrorMessage";
import Link from "next/link";

interface LoginPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // ログイン済みの場合はマイページにリダイレクト
  const user = await checkAuth();
  if (user) {
    redirect("/my");
  }

  // エラーパラメータを取得
  const error = typeof searchParams.error === 'string' ? searchParams.error : null;
  const errorDescription = typeof searchParams.error_description === 'string' 
    ? decodeURIComponent(searchParams.error_description) 
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Logo />
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="max-w-md mx-auto mt-12">
          {/* エラーメッセージ */}
          {error && <ErrorMessage error={error} description={errorDescription} />}

          {/* ログインセクション */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <h1 className="text-2xl font-bold mb-2 text-center">ログイン</h1>
            <p className="text-gray-600 text-center mb-8">
              Snapwithにログインして、写真を共有しましょう
            </p>

            {/* ログインボタン */}
            <div className="mb-6">
              <LoginButton />
            </div>

            {/* トップページへのリンク */}
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-black underline"
              >
                トップページに戻る
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

