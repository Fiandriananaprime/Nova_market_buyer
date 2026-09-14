import { useState, useMemo } from "react";
import { products } from "../data";
import type { Page, Product } from "../data";
import ProductCard from "../components/ProductCard";

interface SearchPageProps {
  query: string;
  onNavigate: (page: Page, payload?: unknown) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
}

const sortOptions = ["Relevance", "Price: Low to High", "Price: High to Low", "Avg. Rating", "Newest", "Best Selling"];
const brands = ["Sony", "Apple", "Samsung", "Bose", "JBL", "Dell", "Article", "Nordstrom Rack"];

export default function SearchPage({ query, onNavigate, onAddToCart, onAddToWishlist, wishlistIds }: SearchPageProps) {
  const [sort, setSort] = useState("Relevance");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let result = [...products];
    if (query && query !== "deals" && query !== "best sellers" && query !== "new") {
      result = result.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (priceMin) result = result.filter(p => p.price >= Number(priceMin));
    if (priceMax) result = result.filter(p => p.price <= Number(priceMax));
    if (selectedBrands.size > 0) result = result.filter(p => selectedBrands.has(p.brand));
    if (minRating > 0) result = result.filter(p => p.rating >= minRating);
    if (inStockOnly) result = result.filter(p => p.inStock);
    if (freeShippingOnly) result = result.filter(p => p.freeShipping);
    if (sort === "Price: Low to High") result.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") result.sort((a, b) => b.price - a.price);
    if (sort === "Avg. Rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [query, sort, priceMin, priceMax, selectedBrands, minRating, inStockOnly, freeShippingOnly]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => {
      const next = new Set(prev);
      next.has(brand) ? next.delete(brand) : next.add(brand);
      return next;
    });
  };

  const toggleCompare = (product: Product) => {
    setCompareIds(prev => {
      const next = new Set(prev);
      if (next.has(product.id)) { next.delete(product.id); return next; }
      if (next.size >= 4) return prev;
      next.add(product.id);
      return next;
    });
  };

  const compareProducts = products.filter(p => compareIds.has(p.id));

  const FilterPanel = () => (
    <aside className="w-full lg:w-56 flex-shrink-0">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
        {/* Category */}
        <div className="p-4">
          <h3 className="text-sm font-700 text-slate-900 mb-2">Category</h3>
          {["Electronics", "Fashion", "Home & Living", "Sports", "Beauty"].map(c => (
            <label key={c} className="flex items-center gap-2 py-1 cursor-pointer group">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{c}</span>
            </label>
          ))}
        </div>

        {/* Price */}
        <div className="p-4">
          <h3 className="text-sm font-700 text-slate-900 mb-3">Price Range</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={e => setPriceMin(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-400"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={e => setPriceMax(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-400"
            />
          </div>
          <button
            onClick={() => {}}
            className="w-full text-xs bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </div>

        {/* Brand */}
        <div className="p-4">
          <h3 className="text-sm font-700 text-slate-900 mb-2">Brand</h3>
          {brands.map(b => (
            <label key={b} className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.has(b)}
                onChange={() => toggleBrand(b)}
                className="rounded"
              />
              <span className="text-sm text-slate-600">{b}</span>
            </label>
          ))}
        </div>

        {/* Rating */}
        <div className="p-4">
          <h3 className="text-sm font-700 text-slate-900 mb-2">Customer Rating</h3>
          {[4, 3, 2].map(r => (
            <label key={r} className="flex items-center gap-2 py-1 cursor-pointer">
              <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} />
              <div className="flex items-center gap-1">
                {"★★★★★".slice(0, r).split("").map((s, i) => (
                  <span key={i} className="text-amber-400 text-sm">{s}</span>
                ))}
                <span className="text-xs text-slate-500">& up</span>
              </div>
            </label>
          ))}
        </div>

        {/* Availability */}
        <div className="p-4">
          <h3 className="text-sm font-700 text-slate-900 mb-2">Availability</h3>
          <label className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} />
            <span className="text-sm text-slate-600">In Stock</span>
          </label>
          <label className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="checkbox" checked={freeShippingOnly} onChange={e => setFreeShippingOnly(e.target.checked)} />
            <span className="text-sm text-slate-600">Free Delivery</span>
          </label>
        </div>

        {/* Condition */}
        <div className="p-4">
          <h3 className="text-sm font-700 text-slate-900 mb-2">Condition</h3>
          {["New", "Refurbished", "Used - Like New"].map(c => (
            <label key={c} className="flex items-center gap-2 py-1 cursor-pointer">
              <input type="checkbox" />
              <span className="text-sm text-slate-600">{c}</span>
            </label>
          ))}
        </div>

        {/* Seller */}
        <div className="p-4">
          <h3 className="text-sm font-700 text-slate-900 mb-2">Seller</h3>
          {["Verified Sellers Only", "Top-Rated Sellers"].map(s => (
            <label key={s} className="flex items-center gap-2 py-1 cursor-pointer">
              <input type="checkbox" />
              <span className="text-sm text-slate-600">{s}</span>
            </label>
          ))}
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              setSelectedBrands(new Set());
              setMinRating(0);
              setInStockOnly(false);
              setFreeShippingOnly(false);
              setPriceMin("");
              setPriceMax("");
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
          <button onClick={() => onNavigate("home")} className="hover:text-blue-600">Home</button>
          <span>/</span>
          <span className="text-slate-900">Search results for "{query}"</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="font-display text-xl font-700 text-slate-900">
              {filtered.length.toLocaleString()} results for &ldquo;{query}&rdquo;
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {["wireless", "noise cancelling", "over-ear", "bluetooth"].map(tag => (
                <button
                  key={tag}
                  onClick={() => onNavigate("search", { query: tag })}
                  className="text-xs px-2.5 py-1 rounded-full border border-slate-300 hover:border-blue-400 hover:text-blue-600 transition-colors text-slate-600"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-1.5 border border-slate-300 px-3 py-2 rounded-lg text-sm text-slate-700 hover:border-blue-400 transition-colors"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
              Filters
            </button>

            <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
              <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-700"}`}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
              <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-700"}`}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
              </button>
            </div>

            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 bg-white"
            >
              {sortOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop filters */}
          <div className="hidden lg:block">
            <FilterPanel />
          </div>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)}/>
              <div className="relative bg-white w-72 ml-auto h-full overflow-y-auto shadow-xl">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <h3 className="font-700 text-slate-900">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>✕</button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-4">🔍</div>
                <h2 className="font-display text-xl font-700 text-slate-900 mb-2">No results found</h2>
                <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search for something else.</p>
                <button onClick={() => onNavigate("home")} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-600 hover:bg-blue-700 transition-colors">Back to Home</button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onView={() => onNavigate("product", p)}
                    onAddToCart={onAddToCart}
                    onAddToWishlist={onAddToWishlist}
                    inWishlist={wishlistIds.has(p.id)}
                    showCompare
                    onCompare={toggleCompare}
                    inComparison={compareIds.has(p.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(p => (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigate("product", p)}>
                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-50">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-blue-600 font-600 uppercase mb-0.5">{p.brand}</p>
                      <h3 className="text-sm font-600 text-slate-900 line-clamp-2 mb-1">{p.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-amber-400 text-xs">{"★".repeat(Math.floor(p.rating))}</span>
                        <span className="text-xs text-slate-500">({p.reviewCount.toLocaleString()})</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">{p.description}</p>
                      <p className="text-xs text-slate-500">by {p.seller.name} {p.seller.verified && "✓"}</p>
                    </div>
                    <div className="flex-shrink-0 text-right flex flex-col gap-2">
                      <div>
                        <p className="text-lg font-700 text-slate-900">${p.price.toFixed(2)}</p>
                        {p.originalPrice > p.price && <p className="text-xs text-slate-400 line-through">${p.originalPrice.toFixed(2)}</p>}
                      </div>
                      {p.freeShipping && <p className="text-xs text-green-600 font-500">Free delivery</p>}
                      <button
                        onClick={e => { e.stopPropagation(); onAddToCart(p); }}
                        className="bg-blue-600 text-white text-xs font-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Compare bar */}
            {compareIds.size >= 2 && (
              <div className="fixed bottom-4 right-4 bg-slate-900 text-white rounded-xl p-4 shadow-xl flex items-center gap-4 z-40">
                <p className="text-sm font-500">{compareIds.size} products selected</p>
                <button
                  onClick={() => onNavigate("comparison", compareProducts)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Compare now →
                </button>
                <button onClick={() => setCompareIds(new Set())} className="text-slate-400 hover:text-white text-lg">✕</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
