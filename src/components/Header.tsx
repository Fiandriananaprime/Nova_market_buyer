import { useState, useRef, useEffect } from "react";
import { products, categories, type Currency, type Lang, CURRENCY_SYMBOLS } from "../data";
import type { Page } from "../data";

interface HeaderProps {
  onNavigate: (page: Page, payload?: unknown) => void;
  cartCount: number;
  wishlistCount: number;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  lang: Lang;
  onLangChange: (l: Lang) => void;
  isLoggedIn: boolean;
}

const navLinks = [
  { label: "Toutes catégories", page: "category" as Page },
  { label: "Promotions du jour", page: "search" as Page },
  { label: "Nouveautés", page: "search" as Page },
  { label: "Meilleures ventes", page: "search" as Page },
  { label: "Électronique", page: "category" as Page },
  { label: "Mode", page: "category" as Page },
  { label: "Maison", page: "category" as Page },
  { label: "Beauté", page: "category" as Page },
  { label: "Sports", page: "category" as Page },
  { label: "Plus ▾", page: "home" as Page },
];

const LANGS: Record<Lang, string> = { mg: "MG", fr: "FR", en: "EN" };
const CURRENCIES: Currency[] = ["MGA", "EUR", "USD"];

export default function Header({ onNavigate, cartCount, wishlistCount, currency, onCurrencyChange, lang, onLangChange, isLoggedIn }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [notifCount] = useState(3);
  const inputRef = useRef<HTMLInputElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const filtered = query.length > 1
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : [];

  const trendingSuggestions = query.length === 0
    ? ["casque bluetooth", "macbook pro", "galaxy s24", "canapé", "chemise", "JBL Flip 6"]
    : products.map(p => p.name).filter(n => n.toLowerCase().includes(query.toLowerCase())).slice(0, 4);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!inputRef.current?.closest(".search-container")?.contains(e.target as Node)) setShowSuggestions(false);
      if (!currencyRef.current?.contains(e.target as Node)) setShowCurrencyMenu(false);
      if (!langRef.current?.contains(e.target as Node)) setShowLangMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (q: string) => {
    setShowSuggestions(false);
    setQuery(q);
    onNavigate("search", { query: q });
  };

  const sym = CURRENCY_SYMBOLS[currency];

  return (
    <header className="sticky-header bg-white">
      {/* Utility bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span className="text-white font-medium">Livrer à</span>
            <span className="underline cursor-pointer hover:text-white transition-colors">Antananarivo 101</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {/* Language */}
            <div className="relative" ref={langRef}>
              <button onClick={() => setShowLangMenu(!showLangMenu)} className="hover:text-white transition-colors flex items-center gap-1">
                🌐 {LANGS[lang]} ▾
              </button>
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 min-w-24">
                  {(["mg", "fr", "en"] as Lang[]).map(l => (
                    <button key={l} onClick={() => { onLangChange(l); setShowLangMenu(false); }} className={`w-full text-left px-3 py-2 text-sm transition-colors ${lang === l ? "bg-blue-50 text-blue-700 font-600" : "text-slate-700 hover:bg-slate-50"}`}>
                      {l === "mg" ? "🇲🇬 Malagasy" : l === "fr" ? "🇫🇷 Français" : "🇬🇧 English"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency */}
            <div className="relative" ref={currencyRef}>
              <button onClick={() => setShowCurrencyMenu(!showCurrencyMenu)} className="hover:text-white transition-colors flex items-center gap-1">
                {sym} {currency} ▾
              </button>
              {showCurrencyMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 min-w-28">
                  {CURRENCIES.map(c => (
                    <button key={c} onClick={() => { onCurrencyChange(c); setShowCurrencyMenu(false); }} className={`w-full text-left px-3 py-2 text-sm transition-colors ${currency === c ? "bg-blue-50 text-blue-700 font-600" : "text-slate-700 hover:bg-slate-50"}`}>
                      {CURRENCY_SYMBOLS[c]} {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="hover:text-white transition-colors" onClick={() => onNavigate("order-tracking")}>Suivi commande</button>
            <button className="hover:text-white transition-colors">Aide</button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex-shrink-0 flex items-center gap-1 group"
          >
            <span className="font-display text-xl font-800 text-slate-900 tracking-tight leading-none">
              nova<span className="text-blue-600">·</span><span className="text-blue-600">market</span>
            </span>
            <span className="text-[9px] text-slate-400 font-500 ml-0.5 hidden lg:block">.mg</span>
          </button>

          {/* Search bar */}
          <div className="search-container flex-1 relative">
            <div className="flex items-center border-2 border-blue-600 rounded-xl overflow-hidden bg-white shadow-sm">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={e => e.key === "Enter" && handleSearch(query)}
                placeholder="Que cherchez-vous ?"
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-white text-slate-900 placeholder-slate-400"
              />
              <div className="flex items-center border-l border-slate-200 px-2 gap-1.5">
                {/* Camera / visual search */}
                <button
                  className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                  title="Recherche visuelle"
                  onClick={() => onNavigate("search", { query: "photo" })}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </button>
                {/* Voice */}
                <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors" title="Recherche vocale">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                  </svg>
                </button>
              </div>
              <button
                onClick={() => handleSearch(query)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-medium transition-colors flex items-center justify-center"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>

            {/* Search dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                {filtered.length > 0 && (
                  <div className="p-2">
                    <p className="text-[10px] font-600 text-slate-400 uppercase tracking-wider px-2 py-1">Produits</p>
                    {filtered.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { onNavigate("product", p); setShowSuggestions(false); }}
                        className="w-full flex items-center gap-3 px-2 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
                      >
                        <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded-lg bg-slate-100" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-blue-600 font-600">Ar {p.price.toLocaleString("fr-MG")}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {trendingSuggestions.length > 0 && (
                  <div className="border-t border-slate-100 p-2">
                    <p className="text-[10px] font-600 text-slate-400 uppercase tracking-wider px-2 py-1">
                      {query ? "Suggestions" : "Recherches tendance"}
                    </p>
                    {(query ? trendingSuggestions : ["casque bluetooth", "macbook pro", "galaxy s24", "canapé", "chemise", "JBL Flip 6"]).slice(0, 5).map(s => (
                      <button
                        key={s}
                        onClick={() => handleSearch(s)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg transition-colors text-left"
                      >
                        <svg className="text-slate-400 flex-shrink-0" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <span className="text-sm text-slate-700">{s}</span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="border-t border-slate-100 p-2">
                  <p className="text-[10px] font-600 text-slate-400 uppercase tracking-wider px-2 py-1">Catégories</p>
                  <div className="flex flex-wrap gap-1 px-2 pb-1">
                    {categories.slice(0, 6).map(c => (
                      <button
                        key={c.id}
                        onClick={() => { onNavigate("category", c); setShowSuggestions(false); }}
                        className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition-colors text-slate-600"
                      >
                        {c.icon} {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {isLoggedIn ? (
              <button className="hidden lg:flex flex-col items-center px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 group" onClick={() => onNavigate("account")}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:text-blue-600 transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span className="text-[10px] font-500 mt-0.5">Mon compte</span>
              </button>
            ) : (
              <button className="hidden lg:flex flex-col items-center px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 group" onClick={() => onNavigate("login")}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:text-blue-600 transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span className="text-[10px] font-500 mt-0.5">Connexion</span>
              </button>
            )}

            <button className="hidden lg:flex flex-col items-center px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 group" onClick={() => onNavigate("orders")}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:text-blue-600 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <span className="text-[10px] font-500 mt-0.5">Commandes</span>
            </button>

            <button
              className="relative flex flex-col items-center px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 group"
              onClick={() => onNavigate("wishlist")}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:text-red-500 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-700 rounded-full flex items-center justify-center">{wishlistCount}</span>
              )}
              <span className="text-[10px] font-500 mt-0.5 hidden lg:block">Favoris</span>
            </button>

            <button
              className="relative flex flex-col items-center px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 group"
              onClick={() => onNavigate("cart")}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:text-blue-600 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-700 rounded-full flex items-center justify-center badge-bounce">{cartCount}</span>
              )}
              <span className="text-[10px] font-500 mt-0.5 hidden lg:block">Panier</span>
            </button>

            <button
              className="relative flex flex-col items-center px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 group"
              onClick={() => onNavigate("notifications")}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:text-blue-600 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-700 rounded-full flex items-center justify-center">{notifCount}</span>
              )}
              <span className="text-[10px] font-500 mt-0.5 hidden lg:block">Alertes</span>
            </button>

            <button className="lg:hidden p-2 rounded-xl hover:bg-slate-50" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="scroll-x">
            <div className="flex items-center min-w-max">
              {navLinks.map((link, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(link.page)}
                  className={`px-3.5 py-2.5 text-sm font-500 hover:bg-white/10 transition-colors whitespace-nowrap ${i === 0 ? "flex items-center gap-1.5" : ""}`}
                >
                  {i === 0 && <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>}
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-40 p-4">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button onClick={() => { onNavigate(isLoggedIn ? "account" : "login"); setShowMobileMenu(false); }} className="text-left p-2 text-sm text-slate-700 hover:text-blue-600">{isLoggedIn ? "Mon compte" : "Connexion"}</button>
            <button onClick={() => { onNavigate("orders"); setShowMobileMenu(false); }} className="text-left p-2 text-sm text-slate-700 hover:text-blue-600">Commandes</button>
            <button onClick={() => { onNavigate("wishlist"); setShowMobileMenu(false); }} className="text-left p-2 text-sm text-slate-700 hover:text-blue-600">Favoris</button>
            <button onClick={() => { onNavigate("order-tracking"); setShowMobileMenu(false); }} className="text-left p-2 text-sm text-slate-700 hover:text-blue-600">Suivi commande</button>
          </div>
          <div className="flex gap-2 border-t border-slate-100 pt-3">
            {(["mg", "fr", "en"] as Lang[]).map(l => (
              <button key={l} onClick={() => { onLangChange(l); setShowMobileMenu(false); }} className={`flex-1 py-1.5 rounded-lg text-xs font-600 transition-colors ${lang === l ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{LANGS[l]}</button>
            ))}
            {CURRENCIES.map(c => (
              <button key={c} onClick={() => { onCurrencyChange(c); setShowMobileMenu(false); }} className={`flex-1 py-1.5 rounded-lg text-xs font-600 transition-colors ${currency === c ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{CURRENCY_SYMBOLS[c]} {c}</button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
