# Nintendo Museum Ticket Tool / 任天堂博物馆购票助手

![Nintendo Style](https://img.shields.io/badge/Style-Pixel%20Art-red)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)

## 🔗 Live Demo / 在线体验

**[👉 Click here to visit the tool / 点击这里直接访问工具](https://signxer.github.io/nintendo-museum-ticket/)**

---

## 📖 Introduction / 简介

### English
A fan-made utility designed to help visitors plan their trip to the **Nintendo Museum** in Kyoto, Japan. This tool calculates exactly when tickets will be released for your planned visit date, converting the official JST release time to your local timezone. It also provides helpful tips for grabbing last-minute tickets if you missed the initial release.

### 中文
这是一个为计划前往日本京都**任天堂博物馆**的游客制作的辅助工具。它可以根据您的计划参观日期，精确计算门票发售的具体时间，并将官方的日本标准时间（JST）自动转换为您所在的本地时间。如果您错过了首发抢票，工具还会提供捡漏提示。

---

## ✨ Features / 功能特点

- **📅 Release Date Calculator / 发售日计算**:
  - Automatically calculates the ticket release date based on your planned visit month.
  - 自动根据计划参观月份计算门票发售日期（每月第二个周三）。

- **🌍 Auto Timezone Conversion / 自动时区转换**:
  - Converts the release time (16:00 JST for June 2026 visits onward, 14:00 JST before that) to your local device time, so you know exactly when to wake up or be ready.
  - 将发售时间（2026年6月起的参观月为日本时间 16:00，此前为 14:00）自动转换为您本地时间，再也不用担心算错时差。

- **📅 Calendar Integration / 日历集成**:
  - One-click add to **Google Calendar** or download **.ics** file for system calendars (Apple/Outlook).
  - 一键添加到 **Google 日历** 或下载 **.ics** 文件添加到系统日历（苹果/Outlook）。

- **💡 Missed Release Tips / 捡漏提示**:
  - If the release date has passed, it provides advice on how to catch canceled tickets on the official site.
  - 如果发售日期已过，提供关于如何蹲守官网捡漏退票的实用建议。

- **🌐 Multi-language Support / 多语言支持**:
  - Supports 15 languages including English, Chinese (Simplified/Traditional), Japanese, Korean, Spanish, French, German, Italian, etc.
  - 支持15种语言，包括英语、简体中文、繁体中文、日语、韩语、西班牙语、法语、德语、意大利语等。

- **🎨 Pixel Art Style / 像素风格**:
  - A nostalgic UI design inspired by classic Nintendo aesthetics.
  - 充满怀旧感的任天堂经典像素风格界面设计。

---

## 🛠️ Tech Stack / 技术栈

- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Internationalization**: i18next + react-i18next
- **Date Handling**: date-fns
- **State Management**: Zustand

---

## 🚀 Local Development / 本地开发

To run this project locally:
要在本地运行此项目：

1. **Clone the repository / 克隆仓库**
   ```bash
   git clone https://github.com/signxer/nintendo-museum-ticket.git
   cd nintendo-museum-ticket
   ```

2. **Install dependencies / 安装依赖**
   ```bash
   npm install
   ```

3. **Start development server / 启动开发服务器**
   ```bash
   npm run dev
   ```

4. **Build for production / 打包生产环境**
   ```bash
   npm run build
   ```

---

## ⚠️ Disclaimer / 免责声明

**English**:
This is a fan-made tool and is **not affiliated with, endorsed, sponsored, or specifically approved by Nintendo**. All trademarks and registered trademarks are the property of their respective owners. The ticket release times are based on historical patterns and official rules, but are subject to change by the official Nintendo Museum.

**中文**:
本工具为粉丝制作，**与任天堂公司无关，未获得其授权、赞助或特别批准**。所有商标及注册商标均归其各自所有者所有。门票发售时间基于历史规律和官方规则推算，如有变动请以任天堂博物馆官网为准。
