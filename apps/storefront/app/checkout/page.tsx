'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SfButton } from '@storefront-ui/react';
import { useCartStore, useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import { toast } from 'sonner';

type Step = 'review' | 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [step, setStep] = useState<Step>('review');
  const [showAuth, setShowAuth] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Form state
  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    postal: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  const total = getTotalPrice();

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <p className="mb-6">Your cart is empty.</p>
        <Link href="/shop"><SfButton>Start Shopping</SfButton></Link>
      </div>
    );
  }

  const handleContinue = () => {
    if (step === 'review') {
      if (!isAuthenticated) {
        setShowAuth(true);
        return;
      }
      setStep('shipping');
    } else if (step === 'shipping') {
      if (!shipping.fullName || !shipping.address) {
        toast.error('Please fill in required shipping fields');
        return;
      }
      setStep('payment');
    } else if (step === 'payment') {
      // Complete order
      const newOrder = 'PS' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(newOrder);
      setStep('confirmation');
      clearCart();
    }
  };

  if (step === 'confirmation') {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 text-4xl">✓</div>
        <h1 className="text-4xl font-semibold tracking-tight mb-3">Order Confirmed</h1>
        <p className="text-[var(--text-muted)] mb-2">Thank you for your order.</p>
        <p className="font-mono text-xl tracking-[2px] mb-8 text-[var(--brand-green)]">{orderNumber}</p>

        <div className="bg-white border rounded-2xl p-8 text-left text-sm mb-8">
          <div className="font-semibold mb-3">What happens next?</div>
          <ul className="space-y-2 text-[var(--text-muted)]">
            <li>• You’ll receive a confirmation email shortly</li>
            <li>• Your order will be prepared at your local Prairie Supply store</li>
            <li>• We’ll notify you when it’s ready for pickup or delivery</li>
          </ul>
        </div>

        <Link href="/shop">
          <SfButton size="lg" className="bg-[var(--brand-green)] text-white px-12 rounded-full">Continue Shopping</SfButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Checkout</h1>

      {/* Progress */}
      <div className="flex mb-10 text-sm">
        {(['review', 'shipping', 'payment'] as const).map((s, i) => (
          <div key={s} className={`flex-1 pb-2 border-b-2 ${step === s ? 'border-[var(--brand-green)] font-medium text-[var(--brand-green)]' : 'border-[var(--border)] text-[var(--text-muted)]'}`}>
            {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-7">
          {step === 'review' && (
            <div>
              <h2 className="font-semibold mb-4">Review Your Order</h2>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-4 bg-white p-4 rounded-2xl border">
                    <img src={item.product.image} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-[var(--text-muted)]">Qty {item.quantity}</div>
                    </div>
                    <div className="font-semibold tabular-nums">${(item.product.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'shipping' && (
            <div className="bg-white border rounded-2xl p-8 space-y-6">
              <h2 className="font-semibold text-xl tracking-tight">Shipping Information</h2>
              <div className="grid grid-cols-1 gap-5">
                <input className="border rounded-xl px-4 py-3" placeholder="Full Name" value={shipping.fullName} onChange={e => setShipping({...shipping, fullName: e.target.value})} />
                <input className="border rounded-xl px-4 py-3" placeholder="Street Address" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} />
                <div className="grid grid-cols-2 gap-5">
                  <input className="border rounded-xl px-4 py-3" placeholder="City" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} />
                  <input className="border rounded-xl px-4 py-3" placeholder="Postal Code" value={shipping.postal} onChange={e => setShipping({...shipping, postal: e.target.value})} />
                </div>
                <input className="border rounded-xl px-4 py-3" placeholder="Phone Number" value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} />
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white border rounded-2xl p-8">
              <h2 className="font-semibold text-xl tracking-tight mb-6">Payment Method</h2>
              <div className="space-y-3">
                {['card', 'farm_credit', 'cash_on_delivery'].map(method => (
                  <label key={method} className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer has-[:checked]:border-[var(--brand-green)]">
                    <input type="radio" name="payment" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                    <span className="font-medium capitalize">{method.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-6">This is a demo checkout. No real payment will be processed.</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white border rounded-2xl p-7 sticky top-24">
            <h3 className="font-semibold mb-5">Order Summary</h3>

            <div className="space-y-2 text-sm mb-6">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between">
                  <span>{item.quantity}× {item.product.name}</span>
                  <span className="tabular-nums">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="tabular-nums">${total.toFixed(2)}</span>
            </div>

            <SfButton 
              size="lg" 
              className="w-full mt-8 bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] text-white rounded-full"
              onClick={handleContinue}
            >
              {step === 'review' && 'Continue to Shipping'}
              {step === 'shipping' && 'Continue to Payment'}
              {step === 'payment' && 'Place Order'}
            </SfButton>

            <p className="text-center text-xs text-[var(--text-muted)] mt-4">Secure checkout • Member pricing applied</p>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onSuccess={() => setStep('shipping')}
      />
    </div>
  );
}
