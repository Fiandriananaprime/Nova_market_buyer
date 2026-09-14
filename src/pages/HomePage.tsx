import { useState, useEffect } from "react";
import { products, categories, sellers } from "../data";
import type { Page, Product } from "../data";
import ProductCard from "../components/ProductCard";

interface HomePageProps {
  onNavigate: (page: Page, payload?: unknown) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
}

const heroSlides = [
  {
    headline: "Everything you need.",
    sub: "From thousands of trusted sellers worldwide.",
    cta: "Shop now",
    badge: "Flash Sale — Up to 40% off",
    bg: "from-slate-900 to-blue-950",
    img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=500&fit=crop&auto=format",
    accent: "#3b82f6",
  },
  {
    headline: "Premium Audio. Delivered.",
    sub: "The best headphones from Sony, Bose, JBL and more.",
    cta: "Explore deals",
    badge: "Save up to 30%",
    bg: "from-slate-900 to-indigo-950",
    img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=500&fit=crop&auto=format",
    accent: "#818cf8",
  },
  {
    headline: "Transform Your Space.",
    sub: "Thousands of home products from verified sellers.",
    cta: "Shop home",
    badge: "New arrivals daily",
    bg: "from-slate-900 to-emerald-950",
    img: "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?w=800&h=500&fit=crop&auto=format",
    accent: "#34d399",
  },
];

function CountdownTimer() {
  const [time, setTime] = useState({ h: 4, m: 22, s: 47 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime(t => {
        if (t.s > 0) return { ...t, s: t.s - 1 };
        if (t.m > 0) return { h: t.h, m: t.m - 1, s: 59 };
        if (t.h > 0) return { h: t.h - 1, m: 59, s: 59 };
        return t;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-slate-500">Ends in:</span>
      {[time.h, time.m, time.s].map((n, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-slate-900 text-white text-sm font-700 px-2 py-0.5 rounded-md deal-pulse">{pad(n)}</span>
          {i < 2 && <span className="text-slate-400 font-700 text-sm">:</span>}
        </span>
      ))}
    </div>
  );
}

export default function HomePage({ onNavigate, onAddToCart, onAddToWishlist, wishlistIds }: HomePageProps) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [loadingSkeletons] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = heroSlides[heroIdx];
  const dealProducts = products.filter(p => p.isDeal);
  const bestSellers = products.filter(p => p.isBestSeller);
  const newArrivals = products.filter(p => p.isNew);

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className={`bg-gradient-to-r ${slide.bg} text-white relative overflow-hidden`}>
        <div className="max-w-[1400px] mx-auto px-4 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 z-10">
            <span className="inline-block bg-amber-400 text-amber-900 text-xs font-700 px-3 py-1 rounded-full mb-4">{slide.badge}</span>
            <h1 className="font-display text-4xl md:text-5xl font-800 leading-tight mb-4">{slide.headline}<br /><span style={{ color: slide.accent }}>{slide.sub.split(".")[0]}.</span></h1>
            <p className="text-slate-300 text-lg mb-8">{slide.sub.split(". ").slice(1).join(". ")}</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("search", { query: "" })}
                className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-lg font-600 transition-colors text-sm"
              >
                {slide.cta}
              </button>
              <button
                onClick={() => onNavigate("search", { query: "deals" })}
                className="border border-white/30 hover:bg-white/10 px-6 py-3 rounded-lg font-600 transition-colors text-sm"
              >
                Explore deals →
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto">
              <img src={slide.img} alt="Hero product" className="w-full h-64 md:h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"/>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === heroIdx ? "w-6 bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-[1400px] mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "50M+", label: "Products" },
            { value: "120K+", label: "Verified Sellers" },
            { value: "190+", label: "Countries" },
            { value: "4.8★", label: "Avg. Marketplace Rating" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-2xl font-800">{s.value}</p>
              <p className="text-blue-200 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Deals */}
      <section className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-2xl font-700 text-slate-900">Today's Deals</h2>
            <CountdownTimer />
          </div>
          <button onClick={() => onNavigate("search", { query: "deals" })} className="text-sm text-blue-600 font-600 hover:underline">View all deals →</button>
        </div>
        <div className="scroll-x">
          <div className="flex gap-4 pb-2" style={{ minWidth: "max-content" }}>
            {dealProducts.map(p => (
              <div key={p.id} style={{ width: 220 }}>
                <ProductCard
                  product={p}
                  onView={() => onNavigate("product", p)}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                  inWishlist={wishlistIds.has(p.id)}
                  compact
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-slate-50 py-10">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-700 text-slate-900">Shop by Category</h2>
            <button onClick={() => onNavigate("category")} className="text-sm text-blue-600 font-600 hover:underline">All categories →</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onNavigate("category", cat)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                  style={{ background: cat.color }}
                >
                  {cat.icon}
                </span>
                <span className="text-xs font-600 text-slate-700 text-center leading-tight">{cat.name}</span>
                <span className="text-[10px] text-slate-400">{(cat.count / 1000).toFixed(0)}k+ items</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl font-700 text-slate-900">Best Sellers</h2>
          <button onClick={() => onNavigate("search", { query: "best sellers" })} className="text-sm text-blue-600 font-600 hover:underline">See all →</button>
        </div>
        {loadingSkeletons ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-slate-100">
                <div className="skeleton h-48 w-full"/>
                <div className="p-3 space-y-2">
                  <div className="skeleton h-3 w-3/4"/>
                  <div className="skeleton h-3 w-1/2"/>
                  <div className="skeleton h-4 w-1/3"/>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onView={() => onNavigate("product", p)}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                inWishlist={wishlistIds.has(p.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Promo banners */}
      <section className="max-w-[1400px] mx-auto px-4 pb-10 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-2xl overflow-hidden relative bg-slate-900 p-8 flex flex-col justify-end min-h-48">
          <img
            src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=900&h=400&fit=crop&auto=format"
            alt="Fashion promo"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10">
            <span className="text-amber-400 text-xs font-700 uppercase tracking-widest mb-2 block">Flash Sale</span>
            <h3 className="font-display text-2xl font-700 text-white mb-1">Up to 50% off Fashion</h3>
            <p className="text-slate-300 text-sm mb-4">Thousands of styles from top verified sellers.</p>
            <button onClick={() => onNavigate("category", categories[1])} className="bg-white text-slate-900 text-sm font-600 px-5 py-2 rounded-lg hover:bg-slate-100 transition-colors">Shop Fashion →</button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-2xl overflow-hidden relative bg-slate-900 p-6 flex flex-col justify-end">
            <img
              src="https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?w=400&h=300&fit=crop&auto=format"
              alt="Home promo"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative z-10">
              <h3 className="font-display text-lg font-700 text-white mb-1">New Home Arrivals</h3>
              <button onClick={() => onNavigate("category", categories[2])} className="text-sm text-blue-300 font-600 hover:text-white">Explore →</button>
            </div>
          </div>
          <div className="flex-1 rounded-2xl bg-blue-600 p-6 flex flex-col justify-between">
            <div>
              <span className="text-blue-200 text-xs font-600 uppercase tracking-wider">Marketplace Promise</span>
              <h3 className="font-display text-lg font-700 text-white mt-1">Free shipping on orders over $50</h3>
            </div>
            <button onClick={() => onNavigate("search", { query: "" })} className="text-sm bg-white text-blue-700 font-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors w-fit">Shop now →</button>
          </div>
        </div>
      </section>

      {/* Recommended */}
      <section className="bg-slate-50 py-10">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="font-display text-2xl font-700 text-slate-900 mb-1">Recommended for You</h2>
          <p className="text-slate-500 text-sm mb-5">Based on your browsing and purchase history</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 4).map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onView={() => onNavigate("product", p)}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                inWishlist={wishlistIds.has(p.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-700 text-slate-900">New Arrivals</h2>
            <button onClick={() => onNavigate("search", { query: "new" })} className="text-sm text-blue-600 font-600 hover:underline">View all →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newArrivals.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onView={() => onNavigate("product", p)}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                inWishlist={wishlistIds.has(p.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trusted Sellers */}
      <section className="bg-slate-50 py-10">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="font-display text-2xl font-700 text-slate-900 mb-5">Trusted Sellers</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {sellers.map(s => (
              <button
                key={s.id}
                onClick={() => onNavigate("seller", s)}
                className="bg-white border border-slate-200 rounded-xl p-4 text-left hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-700">{s.logo}</div>
                  {s.verified && <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-600">✓ Verified</span>}
                </div>
                <p className="text-sm font-600 text-slate-900 line-clamp-1">{s.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-amber-400 text-xs">★</span>
                  <span className="text-xs text-slate-600">{s.rating}</span>
                  <span className="text-xs text-slate-400">({(s.reviewCount / 1000).toFixed(1)}k)</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{s.productCount.toLocaleString()} products</p>
                <p className="text-xs text-blue-600 font-500 mt-2 group-hover:underline">Visit store →</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="max-w-[1400px] mx-auto px-4 py-10">
        <h2 className="font-display text-2xl font-700 text-slate-900 mb-5">Frequently Bought Together</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(3, 7).map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onView={() => onNavigate("product", p)}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              inWishlist={wishlistIds.has(p.id)}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
