import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';

/**
 * Wrapper component to protect routes.
 * Use <ClerkAuth> around any component that requires authentication.
 */
export function ClerkAuth({ children }) {
  return (
    <SignedIn>
      {children}
    </SignedIn>
  );
}

/**
 * Wrapper for public pages (e.g., sign‑in / sign‑up).
 */
export function ClerkPublic({ children }) {
  return (
    <SignedOut>
      {children}
    </SignedOut>
  );
}
