// 画像アップロード用APIルート

import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { createClient } from "@/lib/supabase/server";
import { checkAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    // フォームデータを取得
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const tags = formData.get("tags") as string;
    const stamps = formData.get("stamps") as string;
    const comment = formData.get("comment") as string;

    if (!file) {
      return NextResponse.json(
        { error: "画像ファイルが必要です" },
        { status: 400 }
      );
    }

    // ファイルをバッファに変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cloudinaryにアップロード
    const imageUrl = await uploadImage(buffer, file.name, "snapwith");

    // 投稿データを準備
    const postData = {
      imageUrl,
      tags: tags ? JSON.parse(tags) : [],
      stamps: stamps ? JSON.parse(stamps) : [],
      comment: comment || null,
      userId: user.id,
    };

    // レスポンスとして返す（実際の投稿保存はクライアント側で行う）
    return NextResponse.json({
      success: true,
      imageUrl,
      postData,
    });
  } catch (error) {
    console.error("画像アップロードエラー:", error);
    return NextResponse.json(
      { error: "画像のアップロードに失敗しました" },
      { status: 500 }
    );
  }
}

