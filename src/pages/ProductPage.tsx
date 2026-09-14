import { useState } from "react";
import type { Page, Product, Seller } from "../data";
import { products, reviews, qaItems } from "../data";
import { Stars } from "../components/ProductCard";
import ProductCard from "../components/ProductCard";

interface ProductPageProps {
  product: Product;
  onNavigate: (page: Page, payload?: unknown) => void;
  onAddToCart: (product: Product, qty?: number) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
}

const ratingDist: [number, number][] = [[5, 73], [4, 16], [3, 6], [2, 3], [1, 2]];

export default function ProductPage({ product, onNavigate, onAddToCart, onAddToWishlist, wishlistIds }: ProductPageProps) {
  const [mainImage, setMainImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? "");
  const [selectedStorage, setSelectedStorage] = useState(product.storage?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [wished, setWished] = useState(wishlistIds.has(product.id));
  const [cartAdded, setCartAdded] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller>(product.seller);
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  const handleCart = () => {
    onAddToCart(product, quantity);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  const allSellers = [
    { seller: product.seller, price: product.price, shipping: "Free delivery", deliveryDays: product.deliveryDays, stock: 23 },
    ...product.otherSellers.map(o => ({ seller: o.seller, price: o.price, shipping: o.shipping, deliveryDays: o.deliveryDays, stock: o.stock })),
  ];

  const tabs = ["description", "specifications", "reviews", "q&a", "shipping", "seller"];

  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-slate-500 mb-6 flex-wrap">
          <button onClick={() => onNavigate("home")} className="hover:text-blue-600">Home</button>
          <span>/</span>
          <button onClick={() => onNavigate("category")} className="hover:text-blue-600">{product.category}</button>
          <span>/</span>
          <button onClick={() => onNavigate("search", { query: product.subcategory })} className="hover:text-blue-600">{product.subcategory}</button>
          <span>/</span>
          <span className="text-slate-900 line-clamp-1 max-w-xs">{product.name}</span>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-[420px_1fr] xl:grid-cols-[480px_1fr] gap-8 mb-8">

          {/* Left: Gallery */}
          <div className="space-y-3">
            <div className="relative bg-slate-50 rounded-2xl overflow-hidden aspect-square border border-slate-200">
              <img
                src={product.images[mainImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-700 px-2 py-1 rounded-lg">
                  -{product.discount}% OFF
                </span>
              )}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button className="w-8 h-8 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors" title="Fullscreen">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                </button>
                <button className="w-8 h-8 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors" title="360° View">
                  <span className="text-[9px] font-700">360°</span>
                </button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${mainImage === i ? "border-blue-600" : "border-slate-200 hover:border-slate-400"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              <button className="w-16 h-16 flex-shrink-0 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <span className="text-[9px]">VIDEO</span>
                <span className="text-lg">▶</span>
              </button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-blue-600 font-600 uppercase tracking-wider">{product.brand}</span>
                {product.badge && (
                  <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${
                    product.badge === "Best Seller" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                  }`}>{product.badge}</span>
                )}
              </div>
              <h1 className="font-display text-xl md:text-2xl font-700 text-slate-900 leading-snug mb-2">{product.name}</h1>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Stars rating={product.rating} />
                  <span className="text-sm font-600 text-blue-600">{product.rating}</span>
                </div>
                <span className="text-sm text-slate-500">{product.reviewCount.toLocaleString()} reviews</span>
                <span className="text-slate-300">|</span>
                <span className="text-sm text-slate-500">{product.sold.toLocaleString()} sold</span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-400">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-display text-3xl font-800 text-slate-900">${product.price.toFixed(2)}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    <span className="text-sm font-700 text-red-500">Save ${(product.originalPrice - product.price).toFixed(2)} ({product.discount}%)</span>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-2 text-xs mt-2">
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md font-500">✓ In Stock</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-500">🚚 Free delivery in {product.deliveryDays} days</span>
                <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-md font-500">🛡️ Buyer Protection</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Or 4 interest-free payments of ${(product.price / 4).toFixed(2)} with <span className="font-700">Klarna</span></p>
            </div>

            {/* Options */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-sm font-600 text-slate-700 mb-2">Color: <span className="font-400 text-slate-500">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${selectedColor === c ? "border-blue-600 bg-blue-50 text-blue-700 font-600" : "border-slate-200 text-slate-600 hover:border-slate-400"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-600 text-slate-700 mb-2">Size: <span className="font-400 text-slate-500">{selectedSize}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-10 h-10 rounded-lg border text-sm font-500 transition-colors ${selectedSize === s ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-400"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.storage && product.storage.length > 0 && (
              <div>
                <p className="text-sm font-600 text-slate-700 mb-2">Storage</p>
                <div className="flex flex-wrap gap-2">
                  {product.storage.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedStorage(s)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${selectedStorage === s ? "border-blue-600 bg-blue-50 text-blue-700 font-600" : "border-slate-200 text-slate-600 hover:border-slate-400"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <p className="text-sm font-600 text-slate-700">Quantity:</p>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors font-700">−</button>
                <span className="w-10 text-center text-sm font-600">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors font-700">+</button>
              </div>
              <span className="text-xs text-slate-400">Only 23 left in stock</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCart}
                className={`flex-1 py-3 rounded-xl font-700 text-base transition-all ${cartAdded ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
              >
                {cartAdded ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button
                onClick={() => { onAddToCart(product, quantity); onNavigate("checkout"); }}
                className="flex-1 py-3 rounded-xl font-700 text-base bg-amber-400 hover:bg-amber-500 text-slate-900 transition-colors"
              >
                Buy Now
              </button>
              <button
                onClick={() => { setWished(!wished); onAddToWishlist(product); }}
                className={`w-12 h-12 flex-shrink-0 rounded-xl border-2 flex items-center justify-center transition-colors ${wished ? "border-red-400 bg-red-50" : "border-slate-200 hover:border-red-300"}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={wished ? "#ef4444" : "none"} stroke={wished ? "#ef4444" : "#64748b"} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { icon: "🔒", text: "Secure Payment" },
                { icon: "🛡️", text: "Buyer Protection" },
                { icon: "↩️", text: "Easy Returns" },
                { icon: "📦", text: "Delivery Guarantee" },
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-[10px] text-slate-600 font-500">{t.text}</span>
                </div>
              ))}
            </div>

            {/* Seller */}
            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-700 text-slate-900">Sold by</p>
                <button onClick={() => onNavigate("seller", product.seller)} className="text-xs text-blue-600 hover:underline">Visit store →</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-700">{product.seller.logo}</div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-600 text-slate-900">{product.seller.name}</p>
                    {product.seller.verified && <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-600">✓ Verified</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-400 text-xs">★</span>
                    <span className="text-xs text-slate-600">{product.seller.rating}</span>
                    <span className="text-xs text-slate-400">({product.seller.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other sellers */}
        {allSellers.length > 1 && (
          <section className="mb-8 border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
              <h2 className="font-700 text-slate-900 text-sm">Other sellers offering this product</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {allSellers.map((offer, i) => (
                <div
                  key={i}
                  className={`flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors ${selectedSeller.id === offer.seller.id ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-700 flex-shrink-0">{offer.seller.logo}</div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-600 text-slate-900">{offer.seller.name}</span>
                        {offer.seller.verified && <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-600">✓</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 text-[11px]">★</span>
                        <span className="text-[11px] text-slate-500">{offer.seller.rating} ({offer.seller.reviewCount.toLocaleString()})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-700 text-slate-900">${offer.price.toFixed(2)}</p>
                      <p className="text-xs text-green-600">{offer.shipping}</p>
                      <p className="text-[10px] text-slate-400">Est. delivery: {offer.deliveryDays} day{offer.deliveryDays > 1 ? "s" : ""}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedSeller(offer.seller); onAddToCart(product); }}
                      className="bg-blue-600 text-white text-xs font-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-slate-200 overflow-x-auto scroll-x mb-6">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-600 whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              >
                {tab === "q&a" ? "Q&A" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div className="prose max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">{product.description}</p>
              <h3 className="font-700 text-slate-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="text-blue-600 mt-0.5 flex-shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specs).map(([key, val], i) => (
                    <tr key={key} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                      <td className="px-5 py-3 text-sm font-600 text-slate-700 w-48">{key}</td>
                      <td className="px-5 py-3 text-sm text-slate-600">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid md:grid-cols-[200px_1fr] gap-6 bg-slate-50 rounded-2xl p-6">
                <div className="text-center">
                  <p className="font-display text-6xl font-800 text-slate-900">{product.rating}</p>
                  <Stars rating={product.rating} size={20} />
                  <p className="text-sm text-slate-500 mt-1">{product.reviewCount.toLocaleString()} reviews</p>
                </div>
                <div className="space-y-2">
                  {ratingDist.map(([star, pct]) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-4 text-right">{star}</span>
                      <span className="text-amber-400 text-xs">★</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }}/>
                      </div>
                      <span className="text-xs text-slate-500 w-8">{pct}%</span>
                    </div>
                  ))}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Great quality", "Good value", "Comfortable", "Easy to use", "Fast delivery"].map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review list */}
              {reviews.map(r => (
                <div key={r.id} className="border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-700 flex-shrink-0">{r.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-600 text-slate-900">{r.user}</span>
                        {r.verified && <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-600">✓ Verified Purchase</span>}
                        {r.variant && <span className="text-[10px] text-slate-400">Color: {r.variant}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Stars rating={r.rating} size={12} />
                        <span className="text-xs text-slate-400">{r.date}</span>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-600 text-slate-900 text-sm mb-1">{r.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-3">{r.body}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>Was this helpful?</span>
                    <button className="hover:text-blue-600 transition-colors">Yes ({r.helpful})</button>
                    <button className="hover:text-blue-600 transition-colors">No</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "q&a" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-700 text-slate-900">Customer Questions & Answers</h3>
                <button className="bg-blue-600 text-white text-xs font-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Ask a Question</button>
              </div>
              {qaItems.map(q => (
                <div key={q.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedQ(expandedQ === q.id ? null : q.id)}
                    className="w-full flex items-start gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-700 flex items-center justify-center flex-shrink-0 mt-0.5">Q</span>
                    <div className="flex-1">
                      <p className="text-sm font-600 text-slate-900">{q.question}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Asked by {q.askedBy} • {q.helpful} found helpful</p>
                    </div>
                    <span className="text-slate-400 text-sm">{expandedQ === q.id ? "▲" : "▼"}</span>
                  </button>
                  {expandedQ === q.id && (
                    <div className="border-t border-slate-100 p-4 bg-slate-50">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-700 flex items-center justify-center flex-shrink-0 mt-0.5">A</span>
                        <div>
                          <p className="text-sm text-slate-700 leading-relaxed">{q.answer}</p>
                          <p className="text-[10px] text-slate-400 mt-1.5">
                            Answered by <span className="font-600 text-slate-600">{q.answeredBy}</span>
                            {q.isSeller && " (Seller)"} • {q.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-4 text-sm text-slate-600">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Standard Delivery", desc: `${product.deliveryDays}–${product.deliveryDays + 2} business days`, price: product.freeShipping ? "Free" : "$4.99", icon: "📦" },
                  { title: "Express Delivery", desc: "1–2 business days", price: "$12.99", icon: "⚡" },
                  { title: "Same-Day Delivery", desc: "Order by 12pm", price: "$19.99", icon: "🚀" },
                ].map((s, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <p className="font-600 text-slate-900">{s.title}</p>
                      <p className="text-slate-500 text-xs">{s.desc}</p>
                      <p className="font-700 text-blue-600 mt-1">{s.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="font-600 text-blue-900 mb-1">Return Policy</p>
                <p className="text-blue-700 text-xs">30-day hassle-free returns. Items must be in original packaging and unused condition. Return shipping is free on defective items.</p>
              </div>
            </div>
          )}

          {activeTab === "seller" && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-700">{product.seller.logo}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-lg font-700 text-slate-900">{product.seller.name}</h3>
                    {product.seller.verified && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-600">✓ Verified Seller</span>}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span>★ {product.seller.rating} ({product.seller.reviewCount.toLocaleString()} reviews)</span>
                    <span>•</span>
                    <span>{product.seller.yearsActive} years active</span>
                    <span>•</span>
                    <span>{product.seller.location}</span>
                  </div>
                </div>
                <button onClick={() => onNavigate("seller", product.seller)} className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-600 hover:bg-blue-700 transition-colors">
                  Visit Store →
                </button>
              </div>
              <div className="grid grid-cols-3 gap-0 divide-x divide-slate-200 border-t border-slate-200">
                {[
                  { label: "Response Rate", value: `${product.seller.responseRate}%` },
                  { label: "Products", value: product.seller.productCount.toLocaleString() },
                  { label: "Followers", value: `${(product.seller.followers / 1000).toFixed(1)}k` },
                ].map((s, i) => (
                  <div key={i} className="p-4 text-center">
                    <p className="font-display text-xl font-700 text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-700 text-slate-900 mb-5">Customers Also Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
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
      </div>
    </div>
  );
}
