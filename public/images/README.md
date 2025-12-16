# 画像フォルダ

このフォルダには、アプリケーションで使用する画像ファイルを配置してください。

## フォルダ構造

- `logo/` - ロゴ画像用
- `icons/` - アイコン画像用
- `placeholders/` - プレースホルダー画像用
- `stamps/` - スタンプ画像用（チェキに付けるスタンプなど）

## 使用方法

Next.jsでは、`public`フォルダ内のファイルはルートパスから直接アクセスできます。

例：
- `public/images/logo/logo.png` → `/images/logo/logo.png`
- `public/images/icons/icon.png` → `/images/icons/icon.png`

### Next.js Imageコンポーネントを使用する場合

```tsx
import Image from 'next/image';

<Image
  src="/images/logo/logo.png"
  alt="ロゴ"
  width={200}
  height={50}
/>
```

### 通常のimgタグを使用する場合

```tsx
<img src="/images/logo/logo.png" alt="ロゴ" />
```
