import type { Page, Product } from "../data";
import { products } from "../data";

interface WishlistPageProps {
  wishlistIds: Set<string>;
  onNavigate: (page: Page, payload?: unknown) => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
}

const folders = ["All", "Electronics", "Fashion", "Home", "Gifts"];

export default function WishlistPage({ wishlistIds, onNavigate, onAddToCart, onRemoveFromWishlist }: WishlistPageProps) {
  const wishlistProducts = products.filter(p => wishlistIds.has(p.id));

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-700 text-slate-900">My Wishlist <span className="text-slate-400 font-400 text-lg">({wishlistIds.size})</span></h1>
          <button className="text-sm border border-slate-300 px-3 py-2 rounded-lg text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors">+ New Folder</button>
        </div>

        {/* Folder tabs */}
        <div className="flex gap-2 overflow-x-auto scroll-x mb-6">
          {folders.map(f => (
            <button key={f} className={`px-4 py-1.5 rounded-full text-sm font-600 whitespace-nowrap transition-colors ${f === "All" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"}`}>{f}</button>
          ))}
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-4xl mb-5">❤️</div>
            <h2 className="font-display text-xl font-700 text-slate-900 mb-2">Your wishlist is empty</h2>
            <p className="text-slate-500 text-sm mb-6">Save products you love and revisit them anytime.</p>
            <button onClick={() => onNavigate("home")} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-600 hover:bg-blue-700 transition-colors">Start Browsing</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistProducts.map(p => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-blue-300 transition-all group">
                <div className="relative product-image-zoom">
                  <button
                    onClick={() => onRemoveFromWishlist(p)}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white shadow border border-slate-200 flex items-center justify-center text-red-400 hover:text-red-600 hover:border-red-300 transition-colors"
                  >
                    ✕
                  </button>
                  {p.discount > 0 && (
                    <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-700 px-1.5 py-0.5 rounded-md">-{p.discount}%</span>
                  )}
                  <button onClick={() => onNavigate("product", p)}>
                    <img src={p.image} alt={p.name} className="w-full h-48 object-cover"/>
                  </button>
                </div>
                <div className="p-3 space-y-1.5">
                  <p className="text-[10px] text-blue-600 font-600 uppercase">{p.brand}</p>
                  <button onClick={() => onNavigate("product", p)} className="text-sm font-600 text-slate-900 line-clamp-2 text-left hover:text-blue-600 transition-colors">{p.name}</button>
                  <div className="flex items-baseline gap-2">
                    <span className="font-700 text-slate-900">${p.price.toFixed(2)}</span>
                    {p.originalPrice > p.price && <span className="text-xs text-slate-400 line-through">${p.originalPrice.toFixed(2)}</span>}
                    {p.discount > 5 && <span className="text-[10px] text-red-500 font-600 bg-red-50 px-1.5 py-0.5 rounded">Price drop!</span>}
                  </div>
                  <p className="text-[10px] text-slate-400">by {p.seller.name}</p>
                  <p className={`text-[10px] font-600 ${p.inStock ? "text-green-600" : "text-red-500"}`}>
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </p>
                  <button
                    onClick={() => onAddToCart(p)}
                    disabled={!p.inStock}
                    className={`w-full py-2 rounded-lg text-xs font-600 transition-colors ${p.inStock ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                  >
                    {p.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommended */}
        {wishlistProducts.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-700 text-slate-900 mb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.filter(p => !wishlistIds.has(p.id)).slice(0, 4).map(p => (
                <div key={p.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigate("product", p)}>
                  <img src={p.image} alt={p.name} className="w-full h-36 object-cover"/>
                  <div className="p-3">
                    <p className="text-sm font-600 text-slate-900 line-clamp-1">{p.name}</p>
                    <p className="text-sm font-700 text-blue-600 mt-1">${p.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
