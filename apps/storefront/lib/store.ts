import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './products';

export type CartItem = {
  product: Product;
  quantity: number;
  selectedVariant?: Record<string, string>;
};

type User = {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
};

type CartStore = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string) => Promise<boolean>;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product, quantity = 1, variant) => {
        set((state) => {
          const existing = state.items.findIndex(
            (item) => item.product.id === product.id
          );
          
          if (existing !== -1) {
            const newItems = [...state.items];
            newItems[existing] = {
              ...newItems[existing],
              quantity: newItems[existing].quantity + quantity,
            };
            return { items: newItems };
          }
          
          return {
            items: [...state.items, { product, quantity, selectedVariant: variant }],
          };
        });
      },
      
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'prairie-cart',
    }
  )
);

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        // Demo login - accepts any credentials
        await new Promise((resolve) => setTimeout(resolve, 400));
        
        const demoUser: User = {
          id: 'user_demo',
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email,
          accountNumber: 'UFA-' + Math.floor(100000 + Math.random() * 900000),
        };
        
        set({ user: demoUser, isAuthenticated: true });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      register: async (name, email) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const newUser: User = {
          id: 'user_' + Date.now(),
          name,
          email,
          accountNumber: 'UFA-' + Math.floor(100000 + Math.random() * 900000),
        };
        
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
    }),
    {
      name: 'prairie-auth',
    }
  )
);
