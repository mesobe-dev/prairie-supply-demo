'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { SfButton } from '@storefront-ui/react';
import AuthModal from '@/components/AuthModal';

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-semibold mb-3 tracking-tight">Member Access</h1>
        <p className="text-[var(--text-muted)] mb-8">Sign in to view your account, orders, and member pricing.</p>
        
        <SfButton 
          size="lg" 
          className="bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] text-white px-12 rounded-full"
          onClick={() => setShowAuthModal(true)}
        >
          Sign In or Create Account
        </SfButton>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Welcome back, {user?.name.split(' ')[0]}.</h1>
      <p className="text-[var(--text-muted)] mb-10">Account #{user?.accountNumber}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-2xl p-7">
          <h3 className="font-semibold mb-4">Account Details</h3>
          <div className="space-y-3 text-sm">
            <div><span className="text-[var(--text-muted)]">Name:</span> {user?.name}</div>
            <div><span className="text-[var(--text-muted)]">Email:</span> {user?.email}</div>
            <div><span className="text-[var(--text-muted)]">Member since:</span> 2018</div>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-7">
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <div className="space-y-3 text-sm">
            <div>Order History (12 orders)</div>
            <div>Saved Lists</div>
            <div>Preferred Store: Lethbridge #42</div>
            <div className="pt-3 border-t mt-3">
              <button onClick={logout} className="text-red-600 hover:underline text-sm">Sign Out</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-xs text-[var(--text-muted)]">
        This is a demo account experience powered by local state.
      </div>
    </div>
  );
}
