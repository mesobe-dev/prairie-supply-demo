# Prairie Supply Co. — UI Customization Guide

This guide is for frontend developers working on the Prairie Supply Co. Storefront demo.

The project is built with **Next.js 16 + Tailwind v4 + Storefront UI v4** and is designed to be highly customizable while staying close to real-world Alokai / Storefront UI patterns.

---

## Project Structure (Relevant to UI)

```
apps/storefront/
├── app/
│   ├── layout.tsx              # Global layout + Navbar
│   ├── page.tsx                # Home page (hero + categories)
│   ├── shop/
│   │   ├── page.tsx            # Main shop + filters
│   │   └── [category]/page.tsx # Category landing pages
│   ├── product/[slug]/page.tsx # Product Detail Page (uses SfGallery)
│   ├── cart/page.tsx
│   └── checkout/page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── CartDrawer.tsx
│   └── AuthModal.tsx
├── lib/
│   ├── products.ts             # Mock catalog + types
│   └── store.ts                # Zustand cart + auth
└── app/globals.css             # All theming + Storefront UI setup
```

---

## Theming & Brand Colors

All brand colors are defined as CSS custom properties in `app/globals.css`:

```css
:root {
  --brand-green: #006B3F;        /* Primary (UFA-inspired forest green) */
  --brand-green-dark: #004D2E;
  --brand-orange: #E65C00;       /* Accent (safety orange) */
  --brand-orange-dark: #C44D00;

  --background: #FAFAF8;
  --surface: #FFFFFF;
  --border: #D1D5C9;
  --text-muted: #5C6659;
}
```

### How to Change the Theme

1. Edit the CSS variables in `app/globals.css`
2. Update the top bar color in `app/layout.tsx` (currently hard-coded to `--brand-green`)
3. (Optional) Update the logo in `components/Navbar.tsx`

**Tip:** Storefront UI components are heavily driven by CSS variables. Changing the brand colors here will affect many components automatically.

---

## Using Storefront UI Components

We use `@storefront-ui/react` (v4) extensively.

### Import Pattern

```tsx
import { 
  SfButton, 
  SfGallery, 
  SfDrawer, 
  SfModal, 
  SfRating,
  SfQuantitySelector 
} from '@storefront-ui/react';
```

### Recommended Components for E-commerce

| Component              | Use Case                          | Example Location          |
|------------------------|-----------------------------------|---------------------------|
| `SfButton`             | CTAs, Add to cart, Navigation     | Everywhere                |
| `SfGallery`            | Product images (PDP)              | `product/[slug]/page.tsx` |
| `SfDrawer`             | Cart slide-in                     | `components/CartDrawer.tsx` |
| `SfModal`              | Auth, Quick views                 | `components/AuthModal.tsx` |
| `SfProductCard`        | Product grids (consider using)    | Can be added to PLP       |
| `SfRating`             | Reviews                           | PDP                       |
| `SfQuantitySelector`   | Cart + PDP quantity controls      | Recommended upgrade       |

---

## Customizing the Product Catalog

All mock products live in `lib/products.ts`.

### Adding a New Product

```ts
{
  id: "p44",
  name: "New Product Name",
  slug: "new-product-name",
  price: 49.99,
  category: "Feed & Nutrition",           // Must match a category name
  subcategory: "Cattle Feed",
  image: "https://picsum.photos/id/292/600/600",
  rating: 4.7,
  reviewCount: 38,
  inStock: true,
  description: "...",
  variants: [
    { type: "Size", options: ["10kg", "25kg"] }
  ],
}
```

**Important:** The `category` field must exactly match one of the names in the `categories` array.

### Adding Images for SfGallery

You can add an `images` array to any product:

```ts
images: [
  { src: "https://...", alt: "Main view" },
  { src: "https://...", alt: "Detail view" },
]
```

If not provided, the PDP will auto-generate 4 images from the main image.

---

## State Management

We use **Zustand** for cart and authentication:

- `lib/store.ts` → `useCartStore` and `useAuthStore`
- Both persist to localStorage

### Example: Adding a "Wishlist" Feature

```ts
export const useWishlistStore = create(...) 
```

Then expose it in any component.

---

## Tailwind + Storefront UI Setup

The project uses Tailwind v4 (CSS-first).

Key configuration is in `app/globals.css`:

```css
@import "tailwindcss";
@import "@storefront-ui/react/tailwind-config";
@source "./node_modules/@storefront-ui/react/**/*.{js,ts,jsx,tsx,mjs}";
```

### Adding New Utility Classes

You can safely extend the theme in the `@theme` block or use arbitrary values.

---

## Common Customization Tasks

### Change Navbar Behavior
- File: `components/Navbar.tsx`
- The cart count and drawer trigger live here.

### Improve Category Pages
- File: `app/shop/[category]/page.tsx`
- Currently shows a simple hero + grid. Easy place to add category-specific banners.

### Add More Realistic Checkout
- File: `app/checkout/page.tsx`
- Currently a 3-step flow with fake data.

### Dark Mode
The current design is light-only. Adding dark mode would require updating many CSS variables and testing Storefront UI components in dark context.

---

## Best Practices

1. **Prefer Storefront UI components** over custom buttons/inputs when possible (consistency + accessibility).
2. **Keep product data realistic** — farmers notice when prices or descriptions feel off.
3. **Use the existing CSS variable system** instead of hard-coded Tailwind colors for brand elements.
4. **Test on mobile** — the current drawer and filters work well but can always be improved.

---

## Resources

- [Storefront UI React Docs](https://docs.storefrontui.io/v2/react)
- [Storefront UI Playground](http://play-react.vuestorefront.io/)
- [Tailwind v4 Documentation](https://tailwindcss.com/docs)

---

**This is a demo project.** The goal is to showcase what a modern, Storefront UI-powered agricultural e-commerce experience can look like while remaining easy for developers to customize and extend.

Happy building!
