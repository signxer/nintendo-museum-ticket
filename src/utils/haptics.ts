/**
 * Minimal, guarded haptic feedback (Apple: multimodal feedback, utility-first).
 *
 * Vibration only fires where it earns its place — meaningful commit moments
 * (calculate, add to calendar, download) — never on hover or per-keystroke.
 * It is skipped entirely when the device lacks `navigator.vibrate` or when
 * the user has requested reduced motion.
 */
export function vibrate(pattern: number | number[] = 10): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  try {
    navigator.vibrate(pattern);
  } catch {
    // Some environments throw on vibrate (e.g. strict permissions) — never break the interaction.
  }
}
