# アーキテクチャ設計: Blender ポートフォリオ (Supabase版)

## 1. プロジェクト構造
静的Webサイト構成は維持しつつ、バックエンドにSupabaseを採用します。

```
/
├── public/              # ホスティングルート (公開されるファイル)
│   ├── index.html       # メインエントリーポイント
│   ├── css/
│   │   └── style.css    # スタイル (ダークモード、グリッド)
│   ├── js/
│   │   ├── app.js       # メインロジック (Supabase連携)
│   │   ├── supabase.js  # Supabase クライアント初期化
│   │   └── utils.js     # ヘルパー関数
│   └── assets/          # 静的アセット
├── src/                 # (オプション) SQL定義や型定義
└── docs/                # ドキュメント
    ├── prompt.md
    ├── architecture.md
    └── tasks.md
```

## 2. 技術スタック設定
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+).
- **Backend (BaaS)**: **Supabase** (Database, Storage).
- **Hosting**: Firebase Hosting (または Vercel/GitHub Pages). ※ユーザーが `firebase-tools` を導入済みのためFirebase Hostingを基本としますが、静的サイトなのでどこでも公開可能です。
- **SDK**: `@supabase/supabase-js` (CDN経由で使用).

## 3. データベースモデル (Supabase PostgreSQL)
`works` テーブルを作成し、作品情報を管理します。

### Table: `works`
| カラム名      | 型          | 制約             | 説明                                      |
| :---          | :---        | :---             | :---                                      |
| `id`          | UUID        | Primary Key      | 一意のID (自動生成)                       |
| `title`       | Text        | Not Null         | 作品のタイトル                            |
| `description` | Text        | Nullable         | 作品の説明                                |
| `date`        | Date        | Nullable         | 作品の制作日 (ソート用)                   |
| `tags`        | Text Array  | Nullable         | タグのリスト (例: `['Character', 'Sci-Fi']`) |
| `image_urls`  | Text Array  | Not Null         | Storage内の画像の公開URLリスト (1つ目はサムネイル) |
| `model_url`   | Text        | Nullable         | 3DモデルファイルへのURL                   |
| `created_at`  | Timestamptz | Default: now()   | レコード作成日時                          |
| `is_visible`  | Boolean     | Default: true    | 表示・非表示フラグ                        |

## 4. ストレージ構造 (Supabase Storage)
`portfolio-bucket` というパブリックバケットを作成します。

```
portfolio-bucket/
├── images/             # レンダリング画像
│   ├── {filename}.png
└── models/             # 3Dモデルファイル (任意)
    ├── {filename}.glb
```

## 5. セキュリティ (RLS: Row Level Security)
Supabaseの強力なセキュリティ機能であるRLSを設定します。

- **SELECT (読み取り)**: `ENABLE` for **anon** (誰でも閲覧可能).
- **INSERT/UPDATE/DELETE**: `ENABLE` for **authenticated** users only (管理人のみ).
    - 管理画面を作らない場合は、Supabaseのダッシュボードからデータを直接入力・アップロードする運用とします（最も簡単）。
