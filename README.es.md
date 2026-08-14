<p align="center">
  <img src="public/favicon-museum.svg" width="64" height="64" alt="Asistente de entradas del Nintendo Museum logo" />
</p>

<h1 align="center">Asistente de Entradas del Nintendo Museum</h1>

<p align="center">
  <b>Sepa exactamente cuándo comprar sus entradas del Nintendo Museum — en su zona horaria.</b>
  <br/>
  Una herramienta hecha por fans que convierte los horarios oficiales de venta (JST) a su hora local, con cuenta atrás, exportación a calendario y planificador de visitas.
</p>
<p align="center">
  👉 <b><a href="https://n.675277.xyz/">Prueba la versión online ahora →</a></b>
</p>

<p align="center">
  <a href="https://n.675277.xyz/"><img src="https://img.shields.io/badge/Experiencia%20online-n.675277.xyz-%23E60012?style=flat-square" alt="Experiencia online" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/temas-P%C3%ADxel%20%26%20Museo-%2376738A?style=flat-square" alt="Temas" />
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <b>Español</b>
</p>

---

## ✨ Funciones

- 🗓️ **Próxima venta** — Fecha y hora exactas con cuenta atrás en vivo, más exportación a **Google Calendar** / **.ics** con un clic
- 📊 **Estado actual** — Qué meses están aceptando **inscripciones al sorteo** y cuáles están **a la venta** ahora
- 🧮 **Calculadora de entradas** — Elija su mes de visita → línea temporal completa: sorteo → resultados → venta directa, añadir al calendario o compartir
- 📅 **Calendario de ventas** — Los próximos 6 meses de sorteos y ventas de un vistazo
- 🌍 **Conversión de zona horaria** — Todas las horas se muestran en su zona horaria automáticamente
- 🎨 **Dos temas** — Un tema retro **Píxel** y un tema **Museo** que reproduce el diseño del sitio oficial
- 🌐 **15 idiomas** — Interfaz totalmente localizada, con fuentes por idioma
- 🔗 **Enlaces para compartir** — Enlaces profundos `?visit=2026-11` que rellenan la calculadora
- 📱 **Móvil primero** — Diseño adaptable, selector de mes personalizado y PWA instalable

## 🗺️ Cómo funcionan las ventas

Las entradas del Nintendo Museum se venden por **dos canales** (ambos requieren cuenta de Nintendo):

- **Sorteo (Drawing)**
  - Las inscripciones abren el **día 1, 3 meses antes** de su mes de visita, a las **10:00 JST**
  - Resultados anunciados el **día 1, 2 meses antes**, a las **16:00 JST**
- **Venta directa (On Sale)**
  - Abre el **segundo miércoles, 2 meses antes** de su mes de visita
  - Hora de venta: **16:00 JST** para visitas desde **junio de 2026**; **14:00 JST** antes

> [!WARNING]
> Estas horas se basan en patrones históricos y anuncios oficiales y **pueden cambiar en cualquier momento** — confirme siempre en el sitio oficial.

## 🚀 Primeros pasos

> Requiere [Node.js](https://nodejs.org) 18+ y [pnpm](https://pnpm.io).

```bash
# Instalar dependencias
pnpm install

# Iniciar el servidor de desarrollo
pnpm dev

# Comprobación de tipos
pnpm check

# Lint
pnpm lint

# Build de producción (también genera dist/404.html para el enrutado SPA de GitHub Pages)
pnpm build

# Previsualizar el build de producción
pnpm preview
```

## 🧱 Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | React 18 · TypeScript · Vite 6 |
| Estilos | Tailwind CSS 3 (temas con variables CSS) |
| Estado | Zustand |
| i18n | i18next · react-i18next (paquetes de idioma con carga diferida) |
| Routing | react-router-dom 7 |
| Utilidades | date-fns · lucide-react · canvas-confetti |

## 📁 Estructura del proyecto

```
src/
├── components/     # Componentes UI (tarjetas, selectores, modal, …)
├── pages/          # Inicio y Acerca de
├── hooks/          # stores de zona horaria / tema
├── utils/          # lógica de entradas y sorteos, calendario/ics, compartir
├── locales/        # 15 paquetes de idioma
└── fonts/          # fuentes de píxeles subdivididas (woff2)
public/             # favicons, manifest, service worker
```

## 🤝 Contribuir

¿Encontró un error o tiene una idea? Abra un [issue](https://github.com/signxer/nintendo-museum-ticket/issues) o envíe un pull request. Si detecta una corrección en las fechas de venta, incluya la fuente (anuncio oficial) — las horas de venta son la parte que más merece mantenerse precisa.

## ⚖️ Aviso legal

> [!IMPORTANT]
> Esta es una **herramienta hecha por fans**, no el sitio web oficial del Nintendo Museum, y no está afiliada, respaldada ni aprobada por Nintendo.
>
> - Las horas de venta se **infieren de patrones históricos y anuncios oficiales** — solo como referencia.
> - Esta herramienta **no garantiza** que pueda comprar entradas y **no es responsable** de pérdidas por cambios de horario o compras fallidas.
> - **Nintendo** y todas las marcas y nombres relacionados son propiedad de sus respectivos dueños.
> - Esta herramienta **no recopila ni sube** información personal; todas las preferencias se guardan localmente en su navegador.
> - **Compre solo en el sitio oficial** y nunca comparta los datos de su cuenta de Nintendo con canales no oficiales.

## 📄 Licencia

[MIT](LICENSE) © 2026 Livrestrela
