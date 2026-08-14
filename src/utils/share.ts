/**
 * Share helpers — Web Share API with a clipboard fallback, so the "share this
 * release" affordance works in native apps (WeChat/WhatsApp/Discord/…) and in
 * browsers without `navigator.share` (e.g. desktop Firefox).
 */

export type ShareResult = 'shared' | 'copied' | 'unsupported';

export async function shareText(text: string, url: string): Promise<ShareResult> {
  if (typeof navigator === 'undefined') return 'unsupported';

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: document.title, text, url });
      return 'shared';
    } catch (err) {
      // AbortError = user dismissed the sheet; treat as handled, not failure.
      if ((err as Error)?.name === 'AbortError') return 'shared';
      // Otherwise fall through to clipboard.
    }
  }

  if (typeof navigator.clipboard?.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      return 'copied';
    } catch {
      return 'unsupported';
    }
  }

  return 'unsupported';
}
