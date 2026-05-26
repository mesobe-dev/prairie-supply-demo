'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SfButton } from '@storefront-ui/react';
import { products, categories } from '@/lib/products';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState(300);

  const addToCart = useCartStore((s) => s.addToCart);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory) {
      const catName = categories.find(c => c.slug === selectedCategory)?.name;
      if (catName) {
        result = result.filter(p => p.category === catName);
      }
    }

    // In stock
    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Price
    result = result.filter(p => p.price <= priceMax);

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, inStockOnly, priceMax]);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`, {
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart',
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-sm uppercase tracking-widest text-[var(--text-muted)]">Catalogue</div>
          <h1 className="text-4xl font-semibold tracking-tight">Shop Farm Supplies</h1>
        </div>
        <div className="text-sm text-[var(--text-muted)]">
          {filteredProducts.length} products
        </div>
      </div>

      <div className="flex gap-10">
        {/* Filters Sidebar */}
        <div className="w-64 hidden lg:block flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            {/* Search in sidebar */}
            <div>
              <div className="text-xs font-semibold tracking-widest mb-2 text-[var(--text-muted)]">SEARCH</div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm focus:border-[var(--brand-green)]"
              />
            </div>

            {/* Categories */}
            <div>
              <div className="text-xs font-semibold tracking-widest mb-3 text-[var(--text-muted)]">CATEGORIES</div>
              <div className="space-y-1 text-sm">
                <Link
                  href="/shop"
                  className={`block w-full text-left px-3 py-1.5 rounded-lg ${!selectedCategory ? 'bg-[var(--surface-muted)] font-medium' : 'hover:bg-[var(--surface-muted)]'}`}
                >
                  All Products
                </Link>
                {categories.map(cat => (
                  <Link
                    key={cat.slug}
                    href={`/shop/${cat.slug}`}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg ${selectedCategory === cat.slug ? 'bg-[var(--surface-muted)] font-medium' : 'hover:bg-[var(--surface-muted)]'}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="text-xs font-semibold tracking-widest mb-2 text-[var(--text-muted)]">MAX PRICE</div>
              <input
                type="range"
                min={10}
                max={300}
                step={5}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[var(--brand-green)]"
              />
              <div className="text-sm mt-1 font-medium tabular-nums">Up to ${priceMax}</div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="instock"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[var(--brand-green)]"
              />
              <label htmlFor="instock" className="text-sm cursor-pointer">In stock only</label>
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSortBy('default');
                setInStockOnly(false);
                setPriceMax(300);
              }}
              className="text-sm text-[var(--brand-green)] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white border border-[var(--border)] rounded-2xl px-5 py-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-[var(--text-muted)]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border-0 bg-transparent font-medium focus:ring-0"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Mobile search */}
            <div className="lg:hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="border border-[var(--border)] rounded-full px-4 py-2 text-sm w-full"
              />
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => {
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
                      <div className="text-xs text-[var(--text-muted)] mb-1">{product.category}</div>
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
                          <SfButton variant="secondary" size="sm" className="w-full rounded-full">View Details</SfButton>
                        </Link>
                        <SfButton
                          size="sm"
                          className="flex-1 bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] rounded-full text-white"
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
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border">
              <p className="text-xl mb-2">No products found</p>
              <p className="text-[var(--text-muted)]">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
