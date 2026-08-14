<p align="center">
  <img src="public/favicon-museum.svg" width="64" height="64" alt="任天堂博物館購票助手 logo" />
</p>

<h1 align="center">任天堂博物館購票助手</h1>

<p align="center">
  <b>精準知道何時購買任天堂博物館門票——自動換算到你的時區。</b>
  <br/>
  粉絲製作的輔助工具：把官方 JST 發售時間換算為當地時間，提供倒數計時、行事曆匯出與行程規劃。
</p>
<p align="center">
  👉 <b><a href="https://n.675277.xyz/">立即體驗線上版 →</a></b>
</p>

<p align="center">
  <a href="https://n.675277.xyz/"><img src="https://img.shields.io/badge/線上體驗-n.675277.xyz-%23E60012?style=flat-square" alt="線上體驗" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/雙主題-像素%20%26%20博物館-%2376738A?style=flat-square" alt="雙主題" />
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <b>繁體中文</b> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.es.md">Español</a>
</p>

---

## ✨ 功能

- 🗓️ **下次放票時間** — 精確的開售日期與時間 + 即時倒數計時，一鍵匯出 **Google 日曆** / **.ics**
- 📊 **目前狀態** — 哪些月份正在**抽選登記**、哪些正在**先到先得發售**
- 🧮 **購票時間計算器** — 選擇參觀月份 → 完整時間線：抽選報名 → 結果公布 → 先到先得開售，可加日曆或分享
- 📅 **未來發售時間表** — 未來 6 個月的抽選與開售安排一覽
- 🌍 **時區自動換算** — 所有時間自動依你的時區顯示，無需心算
- 🎨 **雙主題** — 復古**像素**主題與復刻官網設計語言的**博物館**主題
- 🌐 **15 種語言** — 介面完整本地化，含依語言匹配的字型
- 🔗 **分享連結** — `?visit=2026-11` 深鏈自動預填計算器
- 📱 **行動裝置優先** — 響應式版面、自訂月份選擇器、可安裝的 PWA

## 🗺️ 購票規則

任天堂博物館門票透過**兩種管道**發售（均需任天堂帳戶）：

- **抽選**
  - 參觀月**前 3 個月**的 **1 日 10:00 JST** 開放報名
  - 參觀月**前 2 個月**的 **1 日 16:00 JST** 公布結果
- **先到先得**
  - 參觀月**前 2 個月**的**第二個週三**開售
  - 開售時間：**2026 年 6 月起**的參觀月為 **16:00 JST**；此前為 **14:00 JST**

> [!WARNING]
> 以上時間基於歷史規律與官方公告推斷，**可能隨時調整**——請以官網為準。

## 🚀 本地開發

> 需要 [Node.js](https://nodejs.org) 18+ 與 [pnpm](https://pnpm.io)。

```bash
# 安裝相依套件
pnpm install

# 啟動開發伺服器
pnpm dev

# 型別檢查
pnpm check

# 程式碼檢查
pnpm lint

# 生產建置（同時產生 dist/404.html，用於 GitHub Pages 的 SPA 路由）
pnpm build

# 預覽生產建置
pnpm preview
```

## 🧱 技術棧

| 層 | 技術 |
|---|---|
| 框架 | React 18 · TypeScript · Vite 6 |
| 樣式 | Tailwind CSS 3（CSS 變數主題） |
| 狀態 | Zustand |
| 國際化 | i18next · react-i18next（語言包按需載入） |
| 路由 | react-router-dom 7 |
| 工具 | date-fns · lucide-react · canvas-confetti |

## 📁 專案結構

```
src/
├── components/     # UI 元件（卡片、選擇器、彈窗等）
├── pages/          # 首頁與關於頁
├── hooks/          # 時區 / 主題 store
├── utils/          # 購票與抽選邏輯、日曆/ics、分享
├── locales/        # 15 種語言包
└── fonts/          # 子集化像素字型（woff2）
public/             # favicon、manifest、service worker
```

## 🤝 參與貢獻

發現 bug 或有想法？歡迎提交 [issue](https://github.com/signxer/nintendo-museum-ticket/issues) 或 Pull Request。如果你發現開售時間有誤，請附上來源（官方公告）——開售時間是最值得保持準確的部分。

## ⚖️ 免責聲明

> [!IMPORTANT]
> 本工具為**粉絲製作**，並非任天堂博物館官方網站，與任天堂無任何關聯、背書或核准。
>
> - 開售時間基於歷史規律與官方公告**推斷，僅供參考**。
> - 本工具**不保證**你能成功購票，對因時程變動或購票失敗造成的損失**不承擔責任**。
> - **任天堂**及相關商標、名稱均歸其各自所有者所有。
> - 本工具**不收集、不上傳**任何個人資訊，所有偏好僅存於瀏覽器本機。
> - **請僅在官網購票**，切勿向非官方管道提供任天堂帳戶資訊。

## 📄 授權

[MIT](LICENSE) © 2026 Livrestrela
