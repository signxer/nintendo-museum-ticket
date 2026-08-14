<p align="center">
  <img src="public/favicon-museum.svg" width="64" height="64" alt="닌텐도 뮤지엄 티켓 도구 logo" />
</p>

<h1 align="center">닌텐도 뮤지엄 티켓 도구</h1>

<p align="center">
  <b>닌텐도 뮤지엄 티켓을 언제 사야 할지 정확히 — 당신의 시간대로.</b>
  <br/>
  팬이 만든 보조 도구: 공식 JST 판매 시간을 현지 시간으로 자동 변환하고, 카운트다운, 캘린더 내보내기, 방문 계획을 제공합니다.
</p>

<p align="center">
  <a href="https://n.675277.xyz/"><img src="https://img.shields.io/badge/온라인%20체험-n.675277.xyz-%23E60012?style=flat-square" alt="온라인 체험" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/테마-픽셀%20%26%20뮤지엄-%2376738A?style=flat-square" alt="테마" />
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <b>한국어</b> ·
  <a href="README.es.md">Español</a>
</p>

---

## ✨ 기능

| | |
|---|---|
| 🗓️ **다음 판매** | 정확한 판매 날짜·시간과 실시간 카운트다운. **Google 캘린더** / **.ics** 한 번 클릭 내보내기 |
| 📊 **현재 상태** | **추첨 접수 중**인 달과 **선착순 판매 중**인 달을 한눈에 확인 |
| 🧮 **티켓 계산기** | 방문 월 선택 → 추첨 접수 → 결과 발표 → 선착순 판매의 전체 타임라인. 캘린더 추가·공유 가능 |
| 📅 **판매 일정** | 향후 6개월의 추첨·판매 일정 한눈에 보기 |
| 🌍 **시간대 자동 변환** | 모든 시간을 선택한 시간대로 자동 표시. 계산 불필요 |
| 🎨 **두 가지 테마** | 레트로 **픽셀** 테마와 공식 사이트 디자인을 반영한 **뮤지엄** 테마 |
| 🌐 **15개 언어** | 언어별 최적 폰트를 포함한 완전한 로컬라이제이션 |
| 🔗 **공유 링크** | `?visit=2026-11` 딥 링크로 계산기 자동 입력 |
| 📱 **모바일 우선** | 반응형 레이아웃, 커스텀 월 선택기, 설치 가능한 PWA |

## 🗺️ 티켓 판매 방식

닌텐도 뮤지엄 티켓은 **두 가지 방식**으로 판매됩니다(모두 닌텐도 계정 필요):

- **추첨**
  - 방문 월 **3개월 전**의 **1일 10:00 JST** 접수 시작
  - 방문 월 **2개월 전**의 **1일 16:00 JST** 결과 발표
- **선착순**
  - 방문 월 **2개월 전**의 **두 번째 수요일** 판매 시작
  - 판매 시간: **2026년 6월** 방문분부터는 **16:00 JST**, 이전에는 **14:00 JST**

> [!WARNING]
> 위 시간은 과거 패턴과 공식 발표에 기반한 추정치이며 **언제든 변경될 수 있습니다**. 반드시 공식 사이트를 확인하세요.

## 🚀 개발 방법

> [Node.js](https://nodejs.org) 18+ 및 [pnpm](https://pnpm.io) 필요.

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 타입 체크
pnpm check

# 린트
pnpm lint

# 프로덕션 빌드 (GitHub Pages SPA 라우팅용 dist/404.html 생성 포함)
pnpm build

# 프로덕션 빌드 미리보기
pnpm preview
```

## 🧱 기술 스택

| 계층 | 기술 |
|---|---|
| 프레임워크 | React 18 · TypeScript · Vite 6 |
| 스타일 | Tailwind CSS 3 (CSS 변수 테마) |
| 상태 관리 | Zustand |
| i18n | i18next · react-i18next (언어 팩 지연 로딩) |
| 라우팅 | react-router-dom 7 |
| 유틸리티 | date-fns · lucide-react · canvas-confetti |

## 📁 프로젝트 구조

```
src/
├── components/     # UI 컴포넌트 (카드, 피커, 모달 등)
├── pages/          # 홈과 About
├── hooks/          # 시간대 / 테마 store
├── utils/          # 티켓·추첨 로직, 캘린더/ics, 공유
├── locales/        # 15개 언어 팩
└── fonts/          # 서브셋 픽셀 폰트 (woff2)
public/             # favicon, manifest, service worker
```

## 🤝 기여하기

버그를 발견했거나 아이디어가 있다면 [issue](https://github.com/signxer/nintendo-museum-ticket/issues) 또는 Pull Request를 보내주세요. 판매 시간 오류를 발견하면 출처(공식 발표)를 함께 알려주세요. 판매 시간은 가장 정확성을 유지할 가치가 있는 부분입니다.

## ⚖️ 면책 고지

> [!IMPORTANT]
> 이 도구는 **팬이 만든 것**이며 닌텐도 뮤지엄 공식 웹사이트가 아닙니다. 닌텐도와 아무런 관련이 없으며 승인받지 않았습니다.
>
> - 판매 시간은 과거 패턴과 공식 발표에 기반한 **추정치이며 참고용입니다**.
> - 이 도구는 티켓 구매를 **보장하지 않으며**, 일정 변경이나 구매 실패로 인한 손실에 대해 **책임지지 않습니다**.
> - **닌텐도** 및 관련 상표, 명칭은 각 소유자의 자산입니다.
> - 이 도구는 개인정보를 **수집하거나 업로드하지 않습니다**. 모든 설정은 브라우저 로컬에만 저장됩니다.
> - **구매는 공식 사이트에서만** 하세요. 비공식 채널에 닌텐도 계정 정보를 제공하지 마세요.

## 📄 라이선스

[MIT](LICENSE) © 2026 Livrestrela
