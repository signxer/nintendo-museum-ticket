<p align="center">
  <img src="public/favicon-museum.svg" width="64" height="64" alt="Nintendo Museum Ticket Assistant logo" />
</p>

<h1 align="center">Nintendo Museum Ticket Assistant</h1>

<p align="center">
  <b>Know exactly when to buy your Nintendo Museum tickets — in your timezone.</b>
  <br/>
  A fan-made helper that converts the official JST sale times into your local time, with countdowns, calendar export, and a visit planner.
</p>
<p align="center">
  👉 <b><a href="https://n.675277.xyz/">Try the live demo now →</a></b>
</p>

<p align="center">
  <a href="https://n.675277.xyz/"><img src="https://img.shields.io/badge/Live%20Demo-n.675277.xyz-%23E60012?style=flat-square" alt="Live demo" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/style-Pixel%20%26%20Museum-%2376738A?style=flat-square" alt="Themes" />
</p>

<p align="center">
  <b>English</b> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.es.md">Español</a>
</p>

---

## ✨ Features

- 🗓️ **Next release card** — The exact on-sale date & time with a live countdown, plus one-click **Google Calendar** / **.ics** export
- 📊 **Current status** — Which months are accepting **lottery entries** and which are **on sale** right now
- 🧮 **Visit calculator** — Pick your visit month → see the full timeline: lottery entry → results → first-come sale, then add to calendar or share
- 📅 **Release schedule** — The next 6 months of lottery and sale dates at a glance
- 🌍 **Timezone conversion** — All times shown in your timezone automatically — no math needed
- 🎨 **Two themes** — A retro **Pixel** theme and a clean **Museum** theme that mirrors the official site's design language
- 🌐 **15 languages** — UI fully localized, per-language fonts included
- 🔗 **Share links** — `?visit=2026-11` deep links that pre-fill the calculator
- 📱 **Mobile-first** — Responsive layout, custom month picker, installable PWA

## 🗺️ How ticket sales work

Nintendo Museum tickets are sold through **two channels** (both need a Nintendo Account):

- **Lottery (Drawing)**
  - Entries open on the **1st of the month, 3 months before** your visit month, at **10:00 JST**
  - Results announced on the **1st, 2 months before**, at **16:00 JST**
- **First-come (On Sale)**
  - Opens on the **2nd Wednesday, 2 months before** your visit month
  - Sale time: **16:00 JST** for visits from **June 2026** onward; **14:00 JST** before that

> [!WARNING]
> These times are based on historical patterns and official announcements and **may change at any time** — always confirm on the official website before relying on them.

## 🚀 Getting started

> Requires [Node.js](https://nodejs.org) 18+ and [pnpm](https://pnpm.io).

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Type-check
pnpm check

# Lint
pnpm lint

# Production build (also generates dist/404.html for GitHub Pages SPA routing)
pnpm build

# Preview the production build
pnpm preview
```

## 🧱 Tech stack

| Layer | Tech |
|---|---|
| Framework | React 18 · TypeScript · Vite 6 |
| Styling | Tailwind CSS 3 (CSS-variable theming) |
| State | Zustand |
| i18n | i18next · react-i18next (lazy-loaded locale chunks) |
| Routing | react-router-dom 7 |
| Utilities | date-fns · lucide-react · canvas-confetti |

## 📁 Project structure

```
src/
├── components/     # UI components (cards, pickers, modal, …)
├── pages/          # Home & About
├── hooks/          # timezone / theme stores
├── utils/          # ticket & lottery logic, calendar/ics, sharing
├── locales/        # 15 language packs
└── fonts/          # subset pixel fonts (woff2)
public/             # favicons, manifest, service worker
```

## 🤝 Contributing

Found a bug or have an idea? Open an [issue](https://github.com/signxer/nintendo-museum-ticket/issues) or submit a pull request. If you spot a release-date correction, please include the source (official announcement) — the sale times are the part most worth keeping accurate.

## ⚖️ Disclaimer

> [!IMPORTANT]
> This is a **fan-made tool**, not the official Nintendo Museum website, and is not affiliated with, endorsed by, or approved by Nintendo.
>
> - Sale times are **inferred from historical patterns and official announcements** — for reference only.
> - This tool **does not guarantee** that you will be able to purchase tickets, and is **not responsible** for any losses caused by schedule changes or failed purchases.
> - **Nintendo** and all related trademarks and names are the property of their respective owners.
> - This tool does **not collect or upload** any personal information; all preferences are stored locally in your browser.
> - **Buy only on the official website** and never share your Nintendo Account details with unofficial channels.

## 📄 License

[MIT](LICENSE) © 2026 Livrestrela
