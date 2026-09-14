import { useState } from "react";
import type { Page, Product, Seller } from "../data";
import { products } from "../data";
import ProductCard from "../components/ProductCard";

interface SellerPageProps {
  seller: Seller;
  onNavigate: (page: Page, payload?: unknown) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
}

const tabs = ["Tous les produits", "Meilleures ventes", "Nouveautés", "Promotions"];

const businessHours = [
  { day: "Lundi – Vendredi", hours: "08h00 – 18h00" },
  { day: "Samedi", hours: "09h00 – 15h00" },
  { day: "Dimanche", hours: "Fermé" },
];

export default function SellerPage({ seller, onNavigate, onAddToCart, onAddToWishlist, wishlistIds }: SellerPageProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isFollowing, setIsFollowing] = useState(seller.isFollowedByCurrentUser);
  const sellerProducts = products.filter(p => p.seller.id === seller.id || p.otherSellers.some(o => o.seller.id === seller.id));

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Seller header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-700 flex-shrink-0">{seller.logo}</div>
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-3 mb-2">
                <h1 className="font-display text-2xl font-800">{seller.name}</h1>
                {seller.verified && <span className="text-xs bg-blue-500 text-white px-2.5 py-1 rounded-full font-600">✓ Vendeur vérifié</span>}
                <span className={`text-xs px-2.5 py-1 rounded-full font-600 ${seller.isOpen ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"}`}>
                  {seller.isOpen ? "● Ouvert" : "● Fermé"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span>★ {seller.rating} ({seller.reviewCount.toLocaleString()} avis)</span>
                <span>•</span>
                <span>{seller.yearsActive} ans sur Nova Market</span>
                <span>•</span>
                <span>📍 {seller.location}</span>
                <span>•</span>
                <span>💬 {seller.responseRate}% de réponse</span>
              </div>
              {seller.description && (
                <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">{seller.description}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-4 py-2 rounded-xl text-sm font-600 transition-colors border ${isFollowing ? "bg-white/10 border-white/30 text-white hover:bg-red-500/20 hover:border-red-400/30 hover:text-red-300" : "border-white/30 hover:bg-white/10 text-white"}`}
              >
                {isFollowing ? "✓ Abonné" : "+ Suivre la boutique"}
              </button>
              <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-600 transition-colors">Contacter</button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 border-t border-white/10 pt-6">
            {[
              { label: "Produits", value: seller.productCount.toLocaleString() },
              { label: "Abonnés", value: `${(seller.followers / 1000).toFixed(1)}k` },
              { label: "Note", value: `${seller.rating} ★` },
              { label: "Taux de réponse", value: `${seller.responseRate}%` },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-2xl font-800 text-white">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scroll-x mb-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-600 whitespace-nowrap transition-colors ${tab === activeTab ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"}`}
            >{tab}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Products grid */}
          <div className="lg:col-span-3">
            {sellerProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-slate-500">Aucun produit trouvé pour cette boutique.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sellerProducts.map(p => (
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
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Seller info */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-700 text-slate-900 mb-3 text-sm">À propos de la boutique</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {seller.description || `${seller.name} est un vendeur vérifié avec ${seller.yearsActive} ans d'expérience. Basé à ${seller.location}.`}
              </p>
              <div className="space-y-2">
                {[
                  { icon: "📦", label: "Expédition sous 1–2 jours" },
                  { icon: "↩️", label: "Retours sous 30 jours" },
                  { icon: "💬", label: `${seller.responseRate}% taux de réponse` },
                  { icon: "✓", label: "Vendeur vérifié Nova Market" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <span>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Business hours */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-700 text-slate-900 text-sm">Horaires d'ouverture</h2>
                <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${seller.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {seller.isOpen ? "Ouvert" : "Fermé"}
                </span>
              </div>
              <div className="space-y-2">
                {businessHours.map(h => (
                  <div key={h.day} className="flex justify-between text-xs">
                    <span className="text-slate-500">{h.day}</span>
                    <span className={`font-600 ${h.hours === "Fermé" ? "text-slate-400" : "text-slate-900"}`}>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow CTA */}
            {!isFollowing && (
              <button
                onClick={() => setIsFollowing(true)}
                className="w-full bg-blue-50 border border-blue-200 text-blue-700 py-3 rounded-xl text-sm font-600 hover:bg-blue-100 transition-colors"
              >
                + Suivre cette boutique
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
