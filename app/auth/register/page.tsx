import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountRegistrationForm from "@/components/AccountRegistrationForm";

export default async function RegisterPage() {
  const supabase = await createClient();
  
  // ログイン状態を確認
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // 未ログインの場合はトップページにリダイレクト
    redirect("/");
  }

  // 既にプロフィールが存在する場合はマイページにリダイレクト
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile && profile.account_name) {
    redirect("/my");
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AccountRegistrationForm userId={user.id} />
      </div>
    </div>
  );
}
