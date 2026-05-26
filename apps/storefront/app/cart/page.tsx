'use client';

import Link from 'next/link';
import { SfButton } from '@storefront-ui/react';
import { useCartStore } from '@/lib/store';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <p className="text-2xl mb-4">Your cart is empty</p>
        <Link href="/shop"><SfButton size="lg" className="bg-[var(--brand-green)] text-white px-10 rounded-full">Browse Products</SfButton></Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight mb-10">Your Cart</h1>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-5">
          {items.map(item => (
            <div key={item.product.id} className="flex gap-6 bg-white p-5 rounded-2xl border">
              <img src={item.product.image} className="w-28 h-28 rounded-2xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <Link href={`/product/${item.product.slug}`} className="font-semibold hover:text-[var(--brand-green)]">{item.product.name}</Link>
                <div className="text-sm text-[var(--text-muted)]">{item.product.category}</div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center border rounded-full text-sm overflow-hidden">
                    <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="px-3 py-1.5">−</button>
                    <div className="px-4 font-mono">{item.quantity}</div>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-3 py-1.5">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-sm text-red-600">Remove</button>
                </div>
              </div>
              <div className="text-right font-semibold tabular-nums text-lg">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white border rounded-2xl p-7 sticky top-24">
            <div className="flex justify-between text-xl font-semibold mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link href="/checkout">
              <SfButton size="lg" className="w-full bg-[var(--brand-green)] text-white rounded-full">Proceed to Checkout</SfButton>
            </Link>
            <Link href="/shop" className="block text-center text-sm mt-4 text-[var(--text-muted)] hover:underline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
