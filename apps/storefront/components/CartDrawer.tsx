'use client';

import { SfButton, SfDrawer } from '@storefront-ui/react';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  const total = getTotalPrice();
  const itemCount = getTotalItems();

  return (
    <SfDrawer
      open={isOpen}
      onClose={onClose}
      placement="right"
      className="w-full max-w-md"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <div className="font-semibold text-xl tracking-tight">Your Cart</div>
            <div className="text-sm text-[var(--text-muted)]">{itemCount} items</div>
          </div>
          <button onClick={onClose} className="text-2xl leading-none text-[var(--text-muted)] hover:text-black">×</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-[var(--text-muted)] mb-6">Looks like you haven&apos;t added anything yet.</p>
              <SfButton onClick={onClose} variant="secondary">Continue Shopping</SfButton>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 border-b pb-6 last:border-b-0">
                  <div className="w-20 h-20 bg-[var(--surface-muted)] rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm leading-tight pr-2">{item.product.name}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">{item.product.category}</div>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border rounded-full overflow-hidden text-sm">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1 hover:bg-[var(--surface-muted)] active:bg-gray-100"
                        >
                          −
                        </button>
                        <div className="px-3 font-mono tabular-nums">{item.quantity}</div>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 hover:bg-[var(--surface-muted)] active:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right font-semibold tabular-nums whitespace-nowrap">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 bg-white mt-auto">
            <div className="flex justify-between text-lg font-semibold mb-1">
              <span>Subtotal</span>
              <span className="tabular-nums">${total.toFixed(2)}</span>
            </div>
            <div className="text-xs text-[var(--text-muted)] mb-5">Shipping calculated at checkout</div>

            <div className="space-y-3">
              <Link href="/cart" onClick={onClose}>
                <SfButton size="lg" variant="secondary" className="w-full rounded-full">
                  View Full Cart
                </SfButton>
              </Link>
              <Link href="/checkout" onClick={onClose}>
                <SfButton size="lg" className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] text-white rounded-full">
                  Proceed to Checkout
                </SfButton>
              </Link>
            </div>

            <p className="text-center text-[10px] text-[var(--text-muted)] mt-4">
              or 4 interest-free payments of ${(total / 4).toFixed(2)} with Shop Pay
            </p>
          </div>
        )}
      </div>
    </SfDrawer>
  );
}
