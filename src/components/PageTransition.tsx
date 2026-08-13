import React from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Direction-aware page transition (Apple: spatial consistency).
 *
 * Forward navigation (PUSH) slides content in from the right; going back (POP)
 * slides it in from the left — so returning retraces the path you arrived on.
 * Keying the wrapper by `location.key` restarts the entrance on every real
 * navigation while leaving clock ticks / re-renders untouched.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigationType = useNavigationType();

  const className = navigationType === 'POP' ? 'page-enter-back' : 'page-enter';

  return (
    <div key={location.key} className={className}>
      {children}
    </div>
  );
}
