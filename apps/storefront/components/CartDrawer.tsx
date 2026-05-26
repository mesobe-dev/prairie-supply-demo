'use client';

import { SfButton } from '@storefront-ui/react';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import { useEffect } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  const total = getTotalPrice();
  const itemCount = getTotalItems();

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - clicks outside close the popover */}
      <div 
        className="fixed inset-0 z-[60] bg-black/20" 
        onClick={onClose}
      />

      {/* Floating Cart Panel - aligned under the cart button */}
      <div 
        className="fixed top-[76px] right-6 z-[70] w-[380px] bg-white rounded-2xl shadow-2xl border border-[var(--border)] flex flex-col max-h-[calc(100vh-100px)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <div className="font-semibold text-lg tracking-tight">Your Cart</div>
            <div className="text-xs text-[var(--text-muted)]">{itemCount} items</div>
          </div>
          <button 
            onClick={onClose} 
            className="text-2xl leading-none text-[var(--text-muted)] hover:text-black w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="text-5xl mb-3">🛒</div>
              <p className="font-medium mb-1">Your cart is empty</p>
              <p className="text-sm text-[var(--text-muted)] mb-5">Looks like you haven&apos;t added anything yet.</p>
              <SfButton onClick={onClose} variant="secondary" size="sm">Continue Shopping</SfButton>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-[var(--surface-muted)] rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-sm">
                    <div className="font-medium leading-tight line-clamp-2 pr-1">{item.product.name}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">{item.product.category}</div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-full text-xs overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-[var(--surface-muted)]"
                        >
                          −
                        </button>
                        <div className="px-2 font-mono tabular-nums">{item.quantity}</div>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-[var(--surface-muted)]"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-semibold tabular-nums">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[10px] text-red-600 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-5 bg-white">
            <div className="flex justify-between text-base font-semibold mb-1">
              <span>Subtotal</span>
              <span className="tabular-nums">${total.toFixed(2)}</span>
            </div>
            <div className="text-xs text-[var(--text-muted)] mb-4">Shipping calculated at checkout</div>

            <div className="space-y-2.5">
              <Link href="/cart" onClick={onClose}>
                <SfButton size="md" variant="secondary" className="w-full rounded-full">
                  View Full Cart
                </SfButton>
              </Link>
              <Link href="/checkout" onClick={onClose}>
                <SfButton size="md" className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] text-white rounded-full">
                  Proceed to Checkout
                </SfButton>
              </Link>
            </div>

            <p className="text-center text-[10px] text-[var(--text-muted)] mt-3">
              or 4 interest-free payments of ${(total / 4).toFixed(2)} with Shop Pay
            </p>
          </div>
        )}
      </div>
    </>
  );
}
