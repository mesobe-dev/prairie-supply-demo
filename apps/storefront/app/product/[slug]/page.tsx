'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SfButton, SfRating } from '@storefront-ui/react';
import { ArrowLeft } from 'lucide-react';
import { getProductBySlug, products } from '@/lib/products';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

// Helper to generate multiple images for the product gallery
function getGalleryImages(product: any) {
  if (product.images && product.images.length > 0) {
    return product.images;
  }
  
  // Generate 4 images using different picsum seeds for variety
  const baseId = parseInt(product.image.match(/id\/(\d+)/)?.[1] || '1015');
  const seeds = [baseId, baseId + 10, baseId + 20, baseId + 30];
  
  return seeds.map((id, index) => ({
    src: `https://picsum.photos/id/${id}/800/800`,
    alt: `${product.name} - View ${index + 1}`,
  }));
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const product = getProductBySlug(params.slug);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const addToCart = useCartStore((s) => s.addToCart);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-2xl mb-4">Product not found</p>
        <Link href="/shop" className="text-[var(--brand-green)] underline">Back to shop</Link>
      </div>
    );
  }

  const galleryImages = getGalleryImages(product);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
    toast.success(`${quantity} × ${product.name} added to cart`);
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const activeImage = galleryImages[activeImageIndex];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link href="/shop" className="inline-flex items-center gap-2 text-sm mb-8 text-[var(--text-muted)] hover:text-black">
        <ArrowLeft className="w-4 h-4" /> Back to shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-x-12 gap-y-10">
        {/* Image Gallery - Custom implementation (SfGallery not available in @storefront-ui/react v4) */}
        <div>
          {/* Main Image */}
          <div className="aspect-square bg-[var(--surface-muted)] rounded-3xl overflow-hidden mb-4 border border-[var(--border)]">
            <img 
              src={activeImage?.src} 
              alt={activeImage?.alt || product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    index === activeImageIndex 
                      ? 'border-[var(--brand-green)] scale-[1.02]' 
                      : 'border-transparent hover:border-[var(--border)]'
                  }`}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="text-sm text-[var(--text-muted)]">{product.category}</div>
          <h1 className="text-4xl font-semibold tracking-tight mt-1 mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <SfRating value={product.rating} />
            <span className="text-sm text-[var(--text-muted)]">({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-5xl font-semibold tabular-nums tracking-tighter">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-2xl text-[var(--text-muted)] line-through">${product.compareAtPrice}</span>
                <span className="bg-[var(--brand-orange)] text-white text-sm font-semibold px-3 py-0.5 rounded">SAVE {discount}%</span>
              </>
            )}
          </div>

          <div className="prose prose-sm mb-8 text-[var(--text-muted)]">
            {product.description}
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8 space-y-6">
              {product.variants.map((variant) => (
                <div key={variant.type}>
                  <div className="text-sm font-semibold mb-2 tracking-wide">{variant.type}</div>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map(option => {
                      const isSelected = selectedVariants[variant.type] === option;
                      return (
                        <button
                          key={option}
                          onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.type]: option }))}
                          className={`px-5 py-2 border rounded-full text-sm transition-all ${isSelected 
                            ? 'border-[var(--brand-green)] bg-[var(--brand-green)] text-white' 
                            : 'border-[var(--border)] hover:border-[var(--brand-green)]'}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-end gap-4 mb-6">
            <div>
              <div className="text-xs font-semibold tracking-widest mb-2 text-[var(--text-muted)]">QUANTITY</div>
              <div className="flex items-center border rounded-full text-lg overflow-hidden w-fit">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="px-4 py-2 hover:bg-[var(--surface-muted)] active:bg-gray-100"
                >−</button>
                <div className="px-6 font-mono tabular-nums">{quantity}</div>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="px-4 py-2 hover:bg-[var(--surface-muted)] active:bg-gray-100"
                >+</button>
              </div>
            </div>

            <SfButton 
              size="lg" 
              className="flex-1 bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] text-white text-base h-14 rounded-full"
              onClick={handleAddToCart}
            >
              Add to Cart — ${(product.price * quantity).toFixed(2)}
            </SfButton>
          </div>

          <div className="text-xs text-[var(--text-muted)]">
            {product.inStock ? "In stock • Ships today" : "Currently out of stock"}
          </div>

          <div className="mt-10 pt-8 border-t text-sm">
            <div className="font-semibold mb-2">Why farmers trust this product</div>
            <ul className="list-disc pl-5 text-[var(--text-muted)] space-y-1 text-sm">
              <li>Proven performance in Western Canadian conditions</li>
              <li>Backed by our 115-year reputation</li>
              <li>Member pricing available — ask in-store</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <h3 className="font-semibold text-xl mb-6 tracking-tight">You may also like</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 4)
            .map(p => (
              <Link key={p.id} href={`/product/${p.slug}`} className="border rounded-2xl overflow-hidden hover:border-[var(--brand-green)] transition-colors">
                <div className="aspect-video bg-[var(--surface-muted)]">
                  <img src={p.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="font-medium text-sm line-clamp-2">{p.name}</div>
                  <div className="font-semibold mt-1">${p.price}</div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
