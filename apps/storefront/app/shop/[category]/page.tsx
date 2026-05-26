'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SfButton } from '@storefront-ui/react';
import { products, categories, getProductsByCategory } from '@/lib/products';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const categorySlug = params.category;

  const category = categories.find(c => c.slug === categorySlug);
  const categoryProducts = category 
    ? getProductsByCategory(category.name) 
    : [];

  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');

  const addToCart = useCartStore((s) => s.addToCart);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl mb-4">Category not found</h1>
        <Link href="/shop" className="text-[var(--brand-green)] underline">Browse all products</Link>
      </div>
    );
  }

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Category Hero */}
      <div className="bg-[var(--brand-green-dark)] text-white rounded-3xl px-10 py-12 mb-10">
        <div className="max-w-2xl">
          <div className="uppercase tracking-[3px] text-sm text-white/70 mb-3">Prairie Supply Co.</div>
          <h1 className="text-5xl font-semibold tracking-tighter mb-4">{category.name}</h1>
          <p className="text-xl text-white/80">
            Quality products for Western Canadian farms and ranches.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="text-lg font-medium">
          {sortedProducts.length} products in {category.name}
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-[var(--text-muted)]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-[var(--border)] rounded-lg px-3 py-2 bg-white"
          >
            <option value="default">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {sortedProducts.map((product) => {
          const discount = product.compareAtPrice
            ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
            : 0;

          return (
            <div key={product.id} className="group bg-white border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col">
              <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-[var(--surface-muted)] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-[var(--brand-orange)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {product.badge}
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute top-3 right-3 bg-white text-[var(--brand-orange)] text-xs font-bold px-2.5 py-0.5 rounded shadow">
                    SAVE {discount}%
                  </div>
                )}
              </Link>

              <div className="p-5 flex flex-col flex-1">
                <Link href={`/product/${product.slug}`} className="font-semibold leading-tight mb-2 hover:text-[var(--brand-green)]">
                  {product.name}
                </Link>

                <div className="flex items-baseline gap-2 mt-auto mb-4">
                  <span className="text-2xl font-semibold tabular-nums">${product.price.toFixed(2)}</span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-[var(--text-muted)] line-through">${product.compareAtPrice}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link href={`/product/${product.slug}`} className="flex-1">
                    <SfButton variant="secondary" size="sm" className="w-full rounded-full">Details</SfButton>
                  </Link>
                  <SfButton
                    size="sm"
                    className="flex-1 bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] text-white rounded-full"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </SfButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link href="/shop">
          <SfButton variant="secondary" className="rounded-full px-10">
            Browse All Categories
          </SfButton>
        </Link>
      </div>
    </div>
  );
}
