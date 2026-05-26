'use client';

import { useState } from 'react';
import { SfButton, SfModal } from '@storefront-ui/react';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;

      if (mode === 'login') {
        success = await login(email, password);
      } else {
        success = await register(name, email);
      }

      if (success) {
        toast.success(mode === 'login' ? 'Welcome back!' : 'Account created successfully');
        onClose();
        onSuccess?.();
        // Reset form
        setEmail(''); setPassword(''); setName('');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SfModal open={isOpen} onClose={onClose} className="max-w-md w-full">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="font-semibold text-2xl tracking-tight mb-1">Prairie Supply Co.</div>
          <p className="text-sm text-[var(--text-muted)]">Member access</p>
        </div>

        <div className="flex border-b mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 pb-3 font-medium text-sm tracking-wide ${mode === 'login' ? 'border-b-2 border-[var(--brand-green)] text-[var(--brand-green)]' : 'text-[var(--text-muted)]'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 pb-3 font-medium text-sm tracking-wide ${mode === 'register' ? 'border-b-2 border-[var(--brand-green)] text-[var(--brand-green)]' : 'text-[var(--text-muted)]'}`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold tracking-widest block mb-1.5">FULL NAME</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm"
                placeholder="John Smith"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold tracking-widest block mb-1.5">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm"
              placeholder="you@farm.ca"
            />
          </div>

          <div>
            <label className="text-xs font-semibold tracking-widest block mb-1.5">PASSWORD</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm"
              placeholder="••••••••"
            />
          </div>

          <SfButton 
            type="submit" 
            size="lg" 
            className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] text-white mt-2 rounded-full h-12"
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In to My Account' : 'Create Member Account'}
          </SfButton>
        </form>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          Demo mode — any email + password works
        </p>
      </div>
    </SfModal>
  );
}
