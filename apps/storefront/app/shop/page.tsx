import { Suspense } from 'react';
import ShopContent from './ShopContent';

// This is now a Server Component.
// We wrap the client content in Suspense so Next.js can statically
// prerender the shell while streaming the interactive shop UI.
// This fixes the "prerender error" caused by useSearchParams().

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center py-20">
          <p className="text-xl">Loading shop...</p>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
