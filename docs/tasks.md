# プロジェクトタスク: Blender ポートフォリオ (Supabase版)

## フェーズ 1: 環境構築 (ユーザー & AI)
- [ ] **[User]** [Supabase](https://supabase.com/) で新規プロジェクトを作成する。
- [ ] **[User]** Supabase ダッシュボードで `Table Editor` を開き、`New Table` から `works` テーブルを作成する (カラム定義は architecture.md 参照)。
- [ ] **[User]** `Storage` から `New Bucket` で `portfolio-bucket` を作成し、**Public** に設定する。
- [ ] **[User]** `Project Settings` > `API` から **Project URL** と **Anon Key** を取得し、AIに伝えるか `public/js/supabase.js` に保存する。
- [ ] **[AI]** 詳細なファイル構造の作成 (`public/`, `css/`, `js/`).

## フェーズ 2: 実装 (AI)
### フロントエンド コア
- [ ] `public/index.html` の作成 (Supabase CDNリンクを含む)。
- [ ] `public/css/style.css` の実装 (ダークモード、グリッドレイアウト)。
- [ ] `public/js/supabase.js` の作成 (Supabaseクライアント初期化)。

### ロジック & インタラクション
- [ ] `public/js/app.js` の実装:
    - [ ] Supabase クライアントを使用して `works` テーブルからデータを取得 (`select('*').order('date', { ascending: false })`)。
    - [ ] 取得したデータからDOM要素を生成してギャラリーに表示。
    - [x] 画像の遅延読み込み実装。
    - [x] エラーハンドリング (データの取得失敗時など)。
    - [x] **[New]** 画像クリック時の全画面表示 (Lightbox) 実装。

## フェーズ 3: コンテンツ入力 (ユーザー)
- [x] **[User]** Supabase Storage の `portfolio-bucket/images/` に作品画像をアップロードする。
- [x] **[User]** 画像の `Get Public URL` をコピーする。
- [/] **[User]** Supabase Table Editor で `works` テーブルにレコードを追加する。
    - `title`, `image_url` (コピーしたURL) などを入力。

## フェーズ 4: デプロイと検証 (Render)
- [x] **[AI/User]** ローカルサーバー (Live Server等) で `index.html` を開き動作確認。
- [x] **[User]** GitHub にリポジトリを作成し、コードをプッシュする (Privateリポジトリのため認証が必要)。
    - `git init` (完了)
    - `git add .` (完了)
    - `git commit -m "Initial commit"` (完了)
    - `git remote add origin ...` (完了)
    - `git push -u origin main` (完了)
- [ ] **[User]** Render ダッシュボード (https://dashboard.render.com/) で `New +` > `Blueprint` を選択。
- [ ] **[User]** GitHub リポジトリを接続し、`render.yaml` が自動検出されることを確認してデプロイ。
- [ ] **[User]** 公開されたURLで動作確認。
