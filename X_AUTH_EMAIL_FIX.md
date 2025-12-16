# X認証のメールアドレスエラー解決方法

## エラー: "Error getting user email from external provider"

このエラーは、SupabaseがX（Twitter）からメールアドレスを取得しようとしているが、Xはメールアドレスを提供しないために発生します。

## 解決手順（重要）

### ステップ1: Supabase DashboardでTwitterプロバイダー設定を確認

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. 左メニューの「**Authentication**」→「**Providers**」をクリック
4. 「**Twitter**」プロバイダーを探してクリック
5. 以下の設定を確認・変更：
   - **「Confirm email」のチェックボックスを外す**（重要！）
   - これにより、X認証でメールアドレスの確認をスキップします
6. 「**Save**」をクリック

### ステップ2: 認証設定の確認

1. 同じ「**Authentication**」メニューから「**Settings**」をクリック
2. 「**Enable email confirmations**」の設定を確認
   - 可能であれば、この設定を無効化するか
   - または「**OAuth providers**」でメール確認を除外する設定を確認

### ステップ3: 動作確認

1. ブラウザで **http://localhost:3000/** にアクセス
2. 「Xでログイン」ボタンをクリック
3. Xの認証画面が表示されることを確認
4. Xでログイン後、エラーが発生せずにアカウント名登録ページが表示されることを確認

## 注意事項

- X（Twitter）はメールアドレスを提供しないため、メール確認を必須にすることはできません
- プロフィールの`account_name`でユーザーを識別します
- メールアドレスはNULLのままでも問題ありません

## トラブルシューティング

### まだエラーが発生する場合

1. Supabase Dashboardで設定を保存した後、ブラウザのキャッシュをクリア
2. 開発サーバーを再起動: `npm run dev`
3. 再度Xでログインを試す

### 設定が反映されない場合

1. Supabase Dashboardで設定を再度確認
2. 「Confirm email」のチェックが確実に外れているか確認
3. 他の認証プロバイダー（Google、GitHubなど）の設定も確認し、同様に「Confirm email」を外す

## 参考

- 詳細なトラブルシューティング: `X_AUTH_TROUBLESHOOTING.md`
- セットアップ手順: `X_AUTH_SETUP.md`
