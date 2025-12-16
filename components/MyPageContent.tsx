"use client";

import { useState } from "react";
import ProfileSettings from "./ProfileSettings";
import MyPageActions from "./MyPageActions";

interface User {
  id: string;
  accountName: string;
  userId: string;
}

interface MyPageContentProps {
  user: User;
}

export default function MyPageContent({ user }: MyPageContentProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);

  // 個人URLをコピーする処理
  const handleCopyUrl = () => {
    const url = `${window.location.origin}/user/${user.userId}`;
    navigator.clipboard.writeText(url);
    alert("個人URLをコピーしました");
  };

  return (
    <>
      {/* 右上固定のアイコンボタン */}
      <MyPageActions
        onProfileClick={() => setShowProfileModal(true)}
        onCopyUrlClick={handleCopyUrl}
      />

      {/* プロフィール設定モーダル */}
      {showProfileModal && (
        <ProfileSettings
          user={user}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
}
