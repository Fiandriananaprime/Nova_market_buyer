import type { Page, Product } from "../data";
import { categories, products } from "../data";
import ProductCard from "../components/ProductCard";

interface CategoryPageProps {
  category?: typeof categories[0];
  onNavigate: (page: Page, payload?: unknown) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
}

const subcats: Record<string, string[]> = {
  electronics: ["Smartphones", "Laptops", "Headphones", "Speakers", "TVs", "Cameras", "Gaming", "Accessories"],
  fashion: ["Men's Tops", "Women's Tops", "Jeans", "Dresses", "Shoes", "Bags", "Accessories", "Activewear"],
  home: ["Sofas", "Tables", "Chairs", "Bedroom", "Kitchen", "Decor", "Lighting", "Storage"],
};

export default function CategoryPage({ category, onNavigate, onAddToCart, onAddToWishlist, wishlistIds }: CategoryPageProps) {
  const cat = category || categories[0];
  const subs = subcats[cat.id] || ["Featured", "New Arrivals", "Best Sellers", "Deals"];
  const catProducts = products.filter(p => p.category.toLowerCase().includes(cat.id) || cat.id === "electronics" && p.category === "Electronics");

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src={catProducts[0]?.image || `https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1400&h=300&fit=crop&auto=format`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 py-12">
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
            <button onClick={() => onNavigate("home")} className="hover:text-white">Home</button>
            <span>/</span>
            <span className="text-white">{cat.name}</span>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-4xl">{cat.icon}</span>
            <h1 className="font-display text-3xl md:text-4xl font-800">{cat.name}</h1>
          </div>
          <p className="text-slate-300 text-sm">{cat.count.toLocaleString()} products from verified sellers</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Subcategories */}
        <section className="mb-8">
          <h2 className="font-display text-xl font-700 text-slate-900 mb-4">Browse by Subcategory</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {subs.map(sub => (
              <button
                key={sub}
                onClick={() => onNavigate("search", { query: sub })}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: cat.color }}>{cat.icon}</div>
                <span className="text-[10px] font-600 text-slate-700 text-center leading-tight">{sub}</span>
              </button>
            ))}
          </div>
        </section>

        {/* All categories if no specific one */}
        {!category && (
          <section className="mb-8">
            <h2 className="font-display text-xl font-700 text-slate-900 mb-4">All Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => onNavigate("category", c)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
                >
                  <span className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: c.color }}>{c.icon}</span>
                  <div>
                    <p className="font-600 text-slate-900 text-sm">{c.name}</p>
                    <p className="text-[10px] text-slate-400">{(c.count / 1000).toFixed(0)}k+ products</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Trending */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-700 text-slate-900">Trending in {cat.name}</h2>
            <button onClick={() => onNavigate("search", { query: cat.name })} className="text-sm text-blue-600 font-600 hover:underline">View all →</button>
          </div>
          {catProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {catProducts.map(p => (
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
          ) : (
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
          )}
        </section>
      </div>
    </div>
  );
}
