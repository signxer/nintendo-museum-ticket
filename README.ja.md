<p align="center">
  <img src="public/favicon-museum.svg" width="64" height="64" alt="任天堂ミュージアム チケットツール logo" />
</p>

<h1 align="center">任天堂ミュージアム チケットツール</h1>

<p align="center">
  <b>任天堂ミュージアムのチケットをいつ買えばいいか、正確に—あなたのタイムゾーンで。</b>
  <br/>
  ファン制作の補助ツール：公式の JST 販売時間を現地時間に自動変換し、カウントダウン、カレンダー書き出し、来場プランを提供します。
</p>

<p align="center">
  <a href="https://n.675277.xyz/"><img src="https://img.shields.io/badge/オンライン体験-n.675277.xyz-%23E60012?style=flat-square" alt="オンライン体験" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/テーマ-ピクセル%20%26%20ミュージアム-%2376738A?style=flat-square" alt="テーマ" />
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <b>日本語</b> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.es.md">Español</a>
</p>

---

## ✨ 機能

| | |
|---|---|
| 🗓️ **次回の販売** | 正確な販売日時とリアルタイムのカウントダウン。**Googleカレンダー** / **.ics** にワンクリック書き出し |
| 📊 **現在の状況** | **抽選受付中**の月と**先着販売中**の月をひと目で確認 |
| 🧮 **チケット計算機** | 来場月を選ぶと、抽選応募 → 結果発表 → 先着販売の完全タイムラインを表示。カレンダー追加・共有も可能 |
| 📅 **販売スケジュール** | 今後6ヶ月の抽選・販売予定を一覧表示 |
| 🌍 **タイムゾーン自動変換** | すべての時刻をあなたのタイムゾーンで自動表示。計算不要 |
| 🎨 **2つのテーマ** | レトロな**ピクセル**テーマと、公式サイトのデザインを再現した**ミュージアム**テーマ |
| 🌐 **15言語** | 言語ごとに最適なフォントを含む完全ローカライズ |
| 🔗 **共有リンク** | `?visit=2026-11` で計算機を自動入力 |
| 📱 **モバイルファースト** | レスポンシブ、カスタム月選択、インストール可能なPWA |

## 🗺️ チケット販売の仕組み

任天堂ミュージアムのチケットは**2つの方法**で販売されます（いずれも任天堂アカウントが必要です）：

- **抽選**
  - 来場月の**3ヶ月前**の **1日 10:00 JST** に応募受付開始
  - 来場月の**2ヶ月前**の **1日 16:00 JST** に結果発表
- **先着**
  - 来場月の**2ヶ月前**の**第2水曜日**に販売開始
  - 販売時刻：**2026年6月**来場分以降は **16:00 JST**、それ以前は **14:00 JST**

> [!WARNING]
> 上記の時刻は過去の傾向と公式発表に基づく推定であり、**予告なく変更される場合があります**。必ず公式サイトでご確認ください。

## 🚀 開発方法

> [Node.js](https://nodejs.org) 18+ と [pnpm](https://pnpm.io) が必要です。

```bash
# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev

# 型チェック
pnpm check

# リント
pnpm lint

# 本番ビルド（GitHub Pages の SPA ルーティング用に dist/404.html も生成）
pnpm build

# 本番ビルドをプレビュー
pnpm preview
```

## 🧱 技術スタック

| 層 | 技術 |
|---|---|
| フレームワーク | React 18 · TypeScript · Vite 6 |
| スタイル | Tailwind CSS 3（CSS 変数テーマ） |
| 状態管理 | Zustand |
| i18n | i18next · react-i18next（言語パックは遅延読み込み） |
| ルーティング | react-router-dom 7 |
| ユーティリティ | date-fns · lucide-react · canvas-confetti |

## 📁 プロジェクト構成

```
src/
├── components/     # UI コンポーネント（カード、ピッカー、モーダル等）
├── pages/          # ホームとAbout
├── hooks/          # タイムゾーン / テーマ store
├── utils/          # チケット・抽選ロジック、カレンダー/ics、共有
├── locales/        # 15言語パック
└── fonts/          # サブセット化ピクセルフォント（woff2）
public/             # favicon、manifest、service worker
```

## 🤝 コントリビューション

バグを見つけた、アイデアがある方は [issue](https://github.com/signxer/nintendo-museum-ticket/issues) または Pull Request をお願いします。販売時刻の誤りを見つけた場合は、出典（公式発表）を添えてください。販売時刻は正確さを保つ価値が最も高い部分です。

## ⚖️ 免責事項

> [!IMPORTANT]
> 本ツールは**ファンが作成したもの**であり、任天堂ミュージアムの公式サイトではありません。任天堂とは一切関係がなく、承認も受けていません。
>
> - 販売時刻は過去の傾向と公式発表に基づく**推定であり、参考情報です**。
> - 本ツールはチケット購入を**保証するものではありません**。日程変更や購入失敗による損失について**一切の責任を負いません**。
> - **任天堂**および関連する商標・名称は、それぞれの権利者に帰属します。
> - 本ツールは個人情報を**収集・送信しません**。設定はすべてブラウザのローカルにのみ保存されます。
> - **購入は公式サイトでのみ**行い、任天堂アカウント情報を非公式の窓口に提供しないでください。

## 📄 ライセンス

[MIT](LICENSE) © 2026 Livrestrela
