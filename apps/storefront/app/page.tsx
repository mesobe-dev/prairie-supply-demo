import Link from "next/link";
import { SfButton } from "@storefront-ui/react";
import { ArrowRight, Truck, Users, Award } from "lucide-react";
import { products, categories } from "@/lib/products";

export default function PrairieSupplyHome() {
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Note: Top bar + Navbar now come from root layout */}

      {/* Hero - UFA inspired strong promotional style */}
      <div className="relative bg-[var(--brand-green-dark)] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-block bg-white/10 text-white text-xs tracking-[2px] font-medium px-4 py-1 rounded-full mb-6">
              SPRING 2026 FLYER NOW AVAILABLE
            </div>
            
            <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter leading-none mb-6">
              Everything your<br />operation needs.
            </h1>
            
            <p className="text-xl text-white/80 max-w-md mb-10">
              Trusted by generations of Western Canadian farmers and ranchers. 
              Quality products. Honest prices. Local experts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <SfButton size="lg" className="w-full sm:w-auto bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-dark)] text-white border-0 text-base px-10 h-14 rounded-full font-semibold">
                  Shop Now
                </SfButton>
              </Link>
              <Link href="/shop?category=fencing-livestock">
                <SfButton 
                  size="lg" 
                  variant="secondary" 
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white border-white/30 text-base px-8 h-14 rounded-full font-semibold backdrop-blur"
                >
                  View Fencing Details
                </SfButton>
              </Link>
            </div>

            <div className="mt-8 text-sm text-white/60 flex items-center gap-6">
              <div>Free delivery on orders over $250</div>
              <div className="hidden sm:block">•</div>
              <div>Pick up at 87 locations</div>
            </div>
          </div>
        </div>

        {/* Subtle farm imagery hint */}
        <div className="absolute right-0 bottom-0 w-1/2 h-full bg-[radial-gradient(#ffffff10_0.8px,transparent_1px)] bg-[length:4px_4px] pointer-events-none" />
      </div>

      {/* Trust Bar */}
      <div className="border-b border-[var(--border)] bg-white py-4">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 text-center md:text-left text-sm">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Truck className="text-[var(--brand-green)] w-5 h-5" />
            <span className="font-medium">Fast rural delivery across the prairies</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Users className="text-[var(--brand-green)] w-5 h-5" />
            <span className="font-medium">Member-owned co-operative</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Award className="text-[var(--brand-green)] w-5 h-5" />
            <span className="font-medium">115 years serving Canadian agriculture</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3 text-[var(--brand-green)] font-semibold">
            <Link href="/account" className="hover:underline">Join as a member →</Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <div className="text-sm uppercase tracking-[1.5px] text-[var(--text-muted)] font-medium">Shop by Need</div>
            <h2 className="text-4xl tracking-tight font-semibold text-[var(--brand-green-dark)]">Categories</h2>
          </div>
          <Link href="/shop" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[var(--brand-green)] hover:gap-3 transition-all">
            Browse full catalogue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop/${category.slug}`}
              className="group block bg-white border border-[var(--border)] hover:border-[var(--brand-green)] rounded-2xl overflow-hidden transition-all hover:shadow-md"
            >
              {/* Category Photo */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-muted)]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Subtle gradient overlay for better text readability if needed */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Category Info */}
              <div className="p-4">
                <div className="font-semibold text-lg tracking-tight text-[var(--brand-green-dark)] group-hover:text-[var(--brand-green)] transition-colors">
                  {category.name}
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Shop now <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products / Deals */}
      <div className="bg-white border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="text-sm uppercase tracking-[1.5px] text-[var(--brand-orange)] font-semibold">Spring Savings</div>
              <h2 className="text-4xl tracking-tight font-semibold">Featured this week</h2>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[var(--brand-green)] hover:gap-3 transition-all">
              View all products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {featuredProducts.map((product) => {
              const discount = product.compareAtPrice 
                ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
                : 0;

              return (
                <Link 
                  key={product.id} 
                  href={`/product/${product.slug}`}
                  className="group bg-white border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--brand-green)] transition-all flex flex-col"
                >
                  <div className="relative aspect-square bg-[var(--surface-muted)] overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-[var(--brand-orange)] text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
                        {product.badge}
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="absolute top-3 right-3 bg-white text-[var(--brand-orange)] text-xs font-bold px-2.5 py-0.5 rounded shadow">
                        SAVE {discount}%
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs text-[var(--text-muted)] mb-1">{product.category}</div>
                    <h3 className="font-semibold text-[15px] leading-tight tracking-[-0.2px] mb-3 pr-1 line-clamp-2 group-hover:text-[var(--brand-green)] transition-colors">
                      {product.name}
                    </h3>

                    <div className="mt-auto flex items-baseline gap-2">
                      <span className="text-2xl font-semibold tabular-nums tracking-tight">${product.price.toFixed(2)}</span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-[var(--text-muted)] line-through">${product.compareAtPrice.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                      ★ {product.rating} <span className="opacity-50">({product.reviewCount})</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/shop">
              <SfButton size="lg" variant="secondary" className="px-10 rounded-full border-[var(--brand-green)] text-[var(--brand-green)] hover:bg-[var(--brand-green)] hover:text-white">
                Browse the full catalogue
              </SfButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-5xl tracking-tighter font-semibold mb-4">Ready to get growing?</h2>
        <p className="text-xl text-[var(--text-muted)] max-w-md mx-auto mb-8">
          Join 42,000+ members who rely on Prairie Supply Co. for their operations.
        </p>
        <Link href="/shop">
          <SfButton size="lg" className="bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] text-white px-12 rounded-full text-lg h-14">
            Start Shopping
          </SfButton>
        </Link>
        <p className="mt-4 text-sm text-[var(--text-muted)]">No account required to browse. Members save more.</p>
      </div>

      {/* Footer */}
      <footer className="bg-[var(--brand-green-dark)] text-white/70 text-sm pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-y-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-lg font-bold">PS</div>
              <span className="font-semibold text-white text-lg tracking-tight">Prairie Supply Co.</span>
            </div>
            <div className="text-white/50 max-w-xs">
              A member-owned co-operative proudly serving Western Canadian agriculture for over 115 years.
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="font-semibold text-white mb-3 tracking-wide text-xs">SHOP</div>
              <div className="space-y-1.5">
                <div>Feed &amp; Nutrition</div>
                <div>Fencing &amp; Livestock</div>
                <div>Crop Inputs</div>
                <div>Workwear</div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white mb-3 tracking-wide text-xs">SUPPORT</div>
              <div className="space-y-1.5">
                <div>Find a Store</div>
                <div>Delivery &amp; Pickup</div>
                <div>Member Benefits</div>
                <div>Contact Us</div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white mb-3 tracking-wide text-xs">COMPANY</div>
              <div className="space-y-1.5">
                <div>About Us</div>
                <div>Careers</div>
                <div>Community</div>
                <div>myUFA Portal</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/50 max-w-7xl mx-auto px-6">
          © Prairie Supply Co. — Demo Storefront built with Storefront UI. Not affiliated with UFA.
        </div>
      </footer>
    </div>
  );
}
