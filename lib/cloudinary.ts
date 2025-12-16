// Cloudinary設定とユーティリティ関数

import { v2 as cloudinary } from 'cloudinary';

// Cloudinary設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Cloudinaryに画像をアップロード
 * @param fileBuffer 画像ファイルのバッファ
 * @param fileName ファイル名
 * @param folder アップロード先のフォルダ（オプション）
 * @returns アップロードされた画像のURL
 */
export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  folder?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      resource_type: 'image',
      folder: folder || 'snapwith',
    };

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result || !result.secure_url) {
          reject(new Error('アップロードに失敗しました'));
          return;
        }
        resolve(result.secure_url);
      })
      .end(fileBuffer);
  });
}

/**
 * Cloudinaryから画像を削除
 * @param imageUrl 削除する画像のURL
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // URLからpublic_idを抽出
    const publicId = extractPublicIdFromUrl(imageUrl);
    if (!publicId) {
      throw new Error('無効な画像URLです');
    }

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('画像削除エラー:', error);
    throw error;
  }
}

/**
 * CloudinaryのURLからpublic_idを抽出
 */
function extractPublicIdFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/v\d+\/(.+)\.\w+$/);
    return match ? match[1].replace(/^snapwith\//, '') : null;
  } catch {
    return null;
  }
}

export { cloudinary };

