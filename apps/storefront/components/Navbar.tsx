'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isHydrated, setIsHydrated] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Prevent hydration mismatch caused by Zustand persist (localStorage)
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-20 flex items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-green)] flex items-center justify-center">
                <span className="text-white font-bold text-2xl tracking-tighter">PS</span>
              </div>
              <div>
                <div className="font-semibold text-2xl tracking-tighter text-[var(--brand-green-dark)]">
                  Prairie Supply Co.
                </div>
                <div className="text-[10px] text-[var(--text-muted)] -mt-1">EST 1909</div>
              </div>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search feed, fencing, workwear, equipment..."
                  className="w-full bg-[var(--surface-muted)] border border-[var(--border)] rounded-full py-3 pl-5 pr-12 text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-green)]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      window.location.href = `/shop?q=${encodeURIComponent(e.currentTarget.value.trim())}`;
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Search feed"]') as HTMLInputElement;
                    if (input?.value.trim()) {
                      window.location.href = `/shop?q=${encodeURIComponent(input.value.trim())}`;
                    }
                  }}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[var(--brand-green)] text-white rounded-full text-sm font-medium hover:bg-[var(--brand-green-dark)] transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-[var(--surface-muted)] rounded-full transition-colors"
              >
                Account
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] text-white rounded-full text-sm font-semibold transition-all active:scale-[0.985]"
              >
                Cart
                <div className="bg-white/20 px-2 py-px rounded text-xs font-mono min-w-[20px] text-center">
                  {isHydrated ? totalItems : 0}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary nav - Top Level Categories */}
        <div className="border-t border-[var(--border)] bg-white hidden lg:block">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-x-7 text-sm font-medium py-3 text-[var(--text-muted)]">
            <Link href="/shop/feed-nutrition" className="hover:text-[var(--brand-green)] transition-colors">Feed &amp; Nutrition</Link>
            <Link href="/shop/fencing-livestock" className="hover:text-[var(--brand-green)] transition-colors">Fencing &amp; Livestock</Link>
            <Link href="/shop/crop-inputs" className="hover:text-[var(--brand-green)] transition-colors">Crop Inputs</Link>
            <Link href="/shop/workwear-boots" className="hover:text-[var(--brand-green)] transition-colors">Workwear &amp; Boots</Link>
            <Link href="/shop/equipment-tools" className="hover:text-[var(--brand-green)] transition-colors">Equipment &amp; Tools</Link>
            <Link href="/shop/animal-health" className="hover:text-[var(--brand-green)] transition-colors">Animal Health</Link>
            
            <Link href="/shop" className="ml-auto text-[var(--brand-green)] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Full Catalogue →
            </Link>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
