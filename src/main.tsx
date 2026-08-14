import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import i18n, { ensureLocaleBundle } from './i18n'

async function bootstrap() {
  // Load the detected locale's bundle before first paint so users don't see
  // an English flash while the chunk downloads.
  await ensureLocaleBundle(i18n.language);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap()

// PWA: install the service worker (production only — dev assets must not be
// cached). Registered on window load to avoid competing with first paint.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service workers are progressive enhancement — fail silently.
    })
  })
}
