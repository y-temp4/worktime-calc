# worktime-calc

日本語 | [English](./README.md)

![OGP](./public/ogp_ja.png)

[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.18-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-10.28.0-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

多言語対応（日本語/英語）の労働時間計算Webアプリケーションです。

## 機能

- ⏰ 時間の計算機能
- ➕ 複数の時間ペア入力と自動合計（跨ぎ時間対応）
- 🕒 現在時刻をワンクリックで入力
- 📋 合計時間や個別時刻のコピー（選択モーダル付き）
- ⌨️ キーボードショートカットとヘルプ表示
- 🔁 Undo/Redo とローカル保存
- 🌍 多言語対応（日本語/英語）

## 技術スタック

- **フロントエンド**: React 19 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **ルーティング**: History API の軽量ルーティング
- **パッケージマネージャー**: pnpm

## 始め方

### 前提条件

- pnpm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/y-temp4/worktime-calc.git
cd worktime-calc

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev

# プロダクション用にビルド
pnpm build

# プロダクションビルドをプレビュー
pnpm preview
```

## 開発について

このプロジェクトでは以下の技術を使用しています：

- 型安全性のためのReact + TypeScript
- 高速な開発とビルドのためのVite
- ユーティリティファーストなスタイリングのためのTailwind CSS
- 言語切替のための軽量 History API ルーティング

このアプリケーションのコードの大部分は生成AIによって生成されました。
