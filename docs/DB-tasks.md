# Supabase データベース操作タスク (DB-tasks)

このドキュメントでは、Supabase のプロジェクトで実行する必要のある SQL コマンドと操作手順をまとめます。
Supabase のダッシュボードにある **SQL Editor** で以下のコマンドを実行してください。

## 1. テーブル作成 (Create Table)

作品情報を保存する `works` テーブルを作成します。

```sql
create table public.works (
  id uuid not null default uuid_generate_v4 (),
  title text not null,
  description text null,
  date date null,
  tags text[] null,
  image_url text not null,
  model_url text null,
  created_at timestamp with time zone not null default now(),
  is_visible boolean not null default true,
  constraint works_pkey primary key (id)
);
```

**解説:**
- `id`: 各作品データに自動で割り振られる固有のIDです。
- `tags`: タグを配列（リスト）で保存します。例: `['Blender', 'Character']`
- `image_url`: 画像のアドレスを保存します。

## 2. セキュリティ設定 (Row Level Security)

大切なデータを守るため、セキュリティルールを設定します。
「誰でも見れるけど、書き込みは管理者だけ」という設定にします。

```sql
-- RLS (Row Level Security) を有効化
alter table public.works enable row level security;

-- 読み取り許可 (誰でもOK)
create policy "Enable read access for all users"
on public.works
for select
to anon
using (true);

-- 書き込み許可 (ログイン済みユーザーのみOK)
create policy "Enable insert for authenticated users only"
on public.works
for insert
to authenticated
with check (true);

-- 更新許可 (ログイン済みユーザーのみOK)
create policy "Enable update for authenticated users only"
on public.works
for update
to authenticated
using (true);

-- 削除許可 (ログイン済みユーザーのみOK)
create policy "Enable delete for authenticated users only"
on public.works
for delete
to authenticated
using (true);
```

## 3. ストレージバケット作成 (Storage)

画像を保存する場所（バケット）を作成します。
これは SQL ではなく、Supabase 左メニューの **Storage** から操作します。

1.  **Storage** を開く。
2.  **New Bucket** をクリック。
3.  Bucket Name に `portfolio-bucket` と入力。
4.  **Public bucket** のスイッチを **ON** にする（重要！）。
5.  **Create bucket** をクリック。

これで、画像ファイルのURLが誰でもアクセスできるようになります。

## 4. サンプルデータの追加 (Optional)

テスト用にデータを1件入れてみたい場合は、以下の SQL を実行してください。
（画像URLはダミーです）

```sql
insert into public.works (title, description, date, tags, image_url)
values (
  'My First Blender Work',
  'This is a sample description of my first work.',
  '2023-10-01',
  ARRAY['Blender', 'Practice'],
  'https://via.placeholder.com/600x400'
);
```

## 5. [NEW] 画像複数枚対応 (Multiple Images)

作品に複数の画像を登録できるように、データベース構造を変更します。
以下のSQLをSupabaseのSQL Editorで実行してください。

```sql
-- 1. 新しいカラム (image_urls) を追加
alter table public.works add column image_urls text[] null;

-- 2. 既存のデータを移行 (image_url -> image_urls の1つ目)
update public.works set image_urls = array[image_url] where image_url is not null;

-- 3. (任意) 古いカラムを削除
-- code変更が完了し、動作確認が取れるまでは削除しないことを推奨します。
-- alter table public.works drop column image_url;
```

これ以降、データの追加は以下のように行います:

```sql
insert into public.works (title, image_urls)
values ('New Work', ARRAY['https://example.com/img1.png', 'https://example.com/img2.png']);
```
