# Blender Portfolio Project Request

このプロジェクトでは、私のBlender作品を展示するWebサイトを構築します。
以下の要件と指示に従って、計画とドキュメント作成を行ってください。

## 1. 使用するスキル (Skills)
以下のスキルをロードし、そのガイドラインに従ってください。
- **web-design**: ダークモード、グリッドレイアウト、画像の遅延読み込み、レスポンシブ対応のデザインルールを適用すること。
- **firebase-deploy** (または firebase-manager): Firebaseの設定、デプロイ手順、セキュリティルールの策定に使用すること。

## 2. 技術スタック (Server & Database)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla) - フレームワークは使用しない。
- **Hosting**: Firebase Hosting
- **Database**: Firebase Firestore (作品のタイトル、作成日、説明、タグなどを管理)
- **Storage**: Firebase Storage (作品の画像ファイル、.blend/.glbファイルを保存)

## 3. ドキュメント作成タスク (Documentation)
コーディングを始める前に、まず以下の3つのファイルを `docs/` フォルダ内に作成してください。

1.  **`docs/prompt.md`**:
    - このプロンプトの内容をそのまま保存してください。

2.  **`docs/architecture.md`**:
    - アプリケーションの全体構造、ディレクトリ構成（`public/`, `src/`など）。
    - Firestoreのデータモデル（CollectionとFieldの定義）。
    - Storageのフォルダ構成。
    - 使用するFirebase SDKのバージョンや構成案。

3.  **`docs/tasks.md`**:
    - 実装までの具体的なステップ（TODOリスト）。
    - 環境構築、API接続、UI実装、デプロイまでの手順。
    - 各タスクにはチェックボックスを付けること。

## 4. 実行フロー
まずは上記のドキュメント作成のみを行い、私が内容を確認・承認した後に、実装フェーズへ移ってください。

--------------------------------------------------------------------------------
このプロンプトのポイント解説
1. Skillsの明示的な指定
    ◦ Antigravityは会話の内容から自動でSkillを読み込みますが、プロンプト内でweb-designなどのSkill名やDescriptionに含まれるキーワードを明示することで、確実にそのルール（黒背景やグリッド表示など）を適用させることができます。
2. 指定通りのファイル出力
    ◦ Antigravityは通常、独自のimplementation_plan.mdなどを生成しますが、今回はご希望通りdocs/フォルダ配下にarchitecture.mdとtasks.mdを作るよう強制しています。これにより、AIの思考プロセスを指定の場所に記録として残せます。
3. 「ドキュメント作成のみ」で一度止める
    ◦ いきなりコードを書き始めると修正が大変です。まずは設計図（architecture）と工程表（tasks）を作らせて、人間が「OK」を出してから実装させる**「Planning Mode」的な動き**を強制しています

tasksにはおれがやることも書いてね
