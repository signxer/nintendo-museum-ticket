<p align="center">
  <img src="public/favicon-museum.svg" width="64" height="64" alt="任天堂博物馆购票助手 logo" />
</p>

<h1 align="center">任天堂博物馆购票助手</h1>

<p align="center">
  <b>精准知道何时购买任天堂博物馆门票——自动换算到你的时区。</b>
  <br/>
  粉丝制作的辅助工具：把官方 JST 发售时间换算为本地时间，提供倒计时、日历导出与行程规划。
</p>
<p align="center">
  👉 <b><a href="https://n.675277.xyz/">立即体验在线版 →</a></b>
</p>

<p align="center">
  <a href="https://n.675277.xyz/"><img src="https://img.shields.io/badge/在线体验-n.675277.xyz-%23E60012?style=flat-square" alt="在线体验" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/双主题-像素%20%26%20博物馆-%2376738A?style=flat-square" alt="双主题" />
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <b>简体中文</b> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.es.md">Español</a>
</p>

---

## ✨ 功能

- 🗓️ **下次放票时间** — 精确的开售日期与时间 + 实时倒计时，一键导出 **Google 日历** / **.ics**
- 📊 **当前状态** — 哪些月份正在**抽选登记**、哪些正在**先到先得发售**
- 🧮 **购票时间计算器** — 选择参观月份 → 完整时间线：抽选报名 → 结果公布 → 先到先得开售，可加日历或分享
- 📅 **未来发售时间表** — 未来 6 个月的抽选与开售安排一览
- 🌍 **时区自动换算** — 所有时间自动按你的时区显示，无需心算
- 🎨 **双主题** — 复古**像素**主题与复刻官网设计语言的**博物馆**主题
- 🌐 **15 种语言** — 界面完整本地化，含按语言匹配的字体
- 🔗 **分享链接** — `?visit=2026-11` 深链自动预填计算器
- 📱 **移动端优先** — 响应式布局、自定义月份选择器、可安装的 PWA

## 🗺️ 购票规则

任天堂博物馆门票通过**两种渠道**发售（均需任天堂账户）：

- **抽选**
  - 参观月**前 3 个月**的 **1 日 10:00 JST** 开放报名
  - 参观月**前 2 个月**的 **1 日 16:00 JST** 公布结果
- **先到先得**
  - 参观月**前 2 个月**的**第二个周三**开售
  - 开售时间：**2026 年 6 月起**的参观月为 **16:00 JST**；此前为 **14:00 JST**

> [!WARNING]
> 以上时间基于历史规律与官方公告推断，**可能随时调整**——请以官网为准。

## 🚀 本地开发

> 需要 [Node.js](https://nodejs.org) 18+ 与 [pnpm](https://pnpm.io)。

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm check

# 代码检查
pnpm lint

# 生产构建（同时生成 dist/404.html，用于 GitHub Pages 的 SPA 路由）
pnpm build

# 预览生产构建
pnpm preview
```

## 🧱 技术栈

| 层 | 技术 |
|---|---|
| 框架 | React 18 · TypeScript · Vite 6 |
| 样式 | Tailwind CSS 3（CSS 变量主题） |
| 状态 | Zustand |
| 国际化 | i18next · react-i18next（语言包按需加载） |
| 路由 | react-router-dom 7 |
| 工具 | date-fns · lucide-react · canvas-confetti |

## 📁 项目结构

```
src/
├── components/     # UI 组件（卡片、选择器、弹窗等）
├── pages/          # 主页与关于页
├── hooks/          # 时区 / 主题 store
├── utils/          # 购票与抽选逻辑、日历/ics、分享
├── locales/        # 15 种语言包
└── fonts/          # 子集化像素字体（woff2）
public/             # favicon、manifest、service worker
```

## 🤝 参与贡献

发现 bug 或有想法？欢迎提交 [issue](https://github.com/signxer/nintendo-museum-ticket/issues) 或 Pull Request。如果你发现开售时间有误，请附上来源（官方公告）——开售时间是最值得保持准确的部分。

## ⚖️ 免责声明

> [!IMPORTANT]
> 本工具为**粉丝制作**，并非任天堂博物馆官方网站，与任天堂无任何关联、背书或批准。
>
> - 开售时间基于历史规律与官方公告**推断，仅供参考**。
> - 本工具**不保证**你能成功购票，对因日程变动或购票失败造成的损失**不承担责任**。
> - **任天堂**及相关商标、名称均归其各自所有者所有。
> - 本工具**不收集、不上传**任何个人信息，所有偏好仅存于浏览器本地。
> - **请仅在官网购票**，切勿向非官方渠道提供任天堂账户信息。

## 📄 许可证

[MIT](LICENSE) © 2026 Livrestrela
