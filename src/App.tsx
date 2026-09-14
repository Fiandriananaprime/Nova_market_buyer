import { useState, useCallback } from "react";
import type { CartItem, Currency, Lang, Page, Product } from "./data";
import { products as allProducts, sellers } from "./data";
import AuthPage from "./pages/AuthPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import AIAssistant from "./components/AIAssistant";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AccountPage from "./pages/AccountPage";
import WishlistPage from "./pages/WishlistPage";
import SellerPage from "./pages/SellerPage";
import CategoryPage from "./pages/CategoryPage";
import ComparisonPage from "./pages/ComparisonPage";
import {
  AddressesPage,
  PaymentMethodsPage,
  NotificationsPage,
  ReturnsPage,
  NotFoundPage,
} from "./pages/MiscPages";

interface NavState {
  page: Page;
  payload?: unknown;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "error";
}

export default function App() {
  const [nav, setNav] = useState<NavState>({ page: "home" });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [currency, setCurrency] = useState<Currency>("MGA");
  const [lang, setLang] = useState<Lang>("fr");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const onNavigate = useCallback((page: Page, payload?: unknown) => {
    setNav({ page, payload });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onAddToCart = useCallback((product: Product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, {
        product,
        quantity: qty,
        selectedSeller: product.seller,
        selectedPrice: product.price,
      }];
    });
    showToast(`${product.name.slice(0, 40)}... added to cart`, "success");
  }, [showToast]);

  const onAddToWishlist = useCallback((product: Product) => {
    setWishlistIds(prev => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast("Removed from wishlist", "info");
      } else {
        next.add(product.id);
        showToast("Added to wishlist ❤️", "success");
      }
      return next;
    });
  }, [showToast]);

  const onRemoveFromWishlist = useCallback((product: Product) => {
    setWishlistIds(prev => {
      const next = new Set(prev);
      next.delete(product.id);
      return next;
    });
    showToast("Removed from wishlist", "info");
  }, [showToast]);

  const onUpdateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.product.id !== productId));
    } else {
      setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
    }
  }, []);

  const onRemoveFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
    showToast("Item removed from cart", "info");
  }, [showToast]);

  const onPlaceOrder = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const { page, payload } = nav;

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage onNavigate={onNavigate} onAddToCart={onAddToCart} onAddToWishlist={onAddToWishlist} wishlistIds={wishlistIds} />;

      case "search":
        return <SearchPage
          query={(payload as { query: string })?.query || ""}
          onNavigate={onNavigate}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          wishlistIds={wishlistIds}
        />;

      case "product":
        return <ProductPage
          product={payload as Product || allProducts[0]}
          onNavigate={onNavigate}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          wishlistIds={wishlistIds}
        />;

      case "category":
        return <CategoryPage
          category={payload as (typeof import("./data").categories)[0] | undefined || undefined}
          onNavigate={onNavigate}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          wishlistIds={wishlistIds}
        />;

      case "cart":
        return <CartPage
          cart={cart}
          onNavigate={onNavigate}
          onUpdateQty={onUpdateQty}
          onRemove={onRemoveFromCart}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          wishlistIds={wishlistIds}
        />;

      case "checkout":
        return <CheckoutPage cart={cart} onNavigate={onNavigate} onPlaceOrder={onPlaceOrder} currency={currency} />;

      case "order-confirmation":
        return <OrderConfirmationPage onNavigate={onNavigate} />;

      case "order-tracking":
        return <OrderTrackingPage onNavigate={onNavigate} />;

      case "account":
        return <AccountPage onNavigate={onNavigate} activeSub="overview" />;

      case "orders":
        return <AccountPage onNavigate={onNavigate} activeSub="orders" />;

      case "order-detail":
        return <OrderTrackingPage onNavigate={onNavigate} />;

      case "wishlist":
        return <WishlistPage
          wishlistIds={wishlistIds}
          onNavigate={onNavigate}
          onAddToCart={onAddToCart}
          onRemoveFromWishlist={onRemoveFromWishlist}
        />;

      case "seller":
        return <SellerPage
          seller={payload as typeof sellers[0] || sellers[0]}
          onNavigate={onNavigate}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          wishlistIds={wishlistIds}
        />;

      case "comparison":
        return <ComparisonPage
          products={compareProducts.length >= 2 ? compareProducts : (payload as Product[] || allProducts.slice(0, 3))}
          onNavigate={onNavigate}
          onAddToCart={onAddToCart}
        />;

      case "addresses":
        return <AddressesPage onNavigate={onNavigate} />;

      case "payment-methods":
        return <PaymentMethodsPage onNavigate={onNavigate} />;

      case "notifications":
        return <NotificationsPage onNavigate={onNavigate} />;

      case "returns":
        return <ReturnsPage onNavigate={onNavigate} />;

      case "login":
        return <AuthPage mode="login" onNavigate={onNavigate} onLogin={() => setIsLoggedIn(true)} />;

      case "register":
        return <AuthPage mode="register" onNavigate={onNavigate} onLogin={() => setIsLoggedIn(true)} />;

      case "404":
      default:
        return <NotFoundPage onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Header
        onNavigate={onNavigate}
        cartCount={cartCount}
        wishlistCount={wishlistIds.size}
        currency={currency}
        onCurrencyChange={setCurrency}
        lang={lang}
        onLangChange={setLang}
        isLoggedIn={isLoggedIn}
      />

      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer onNavigate={onNavigate} />

      {/* AI Assistant */}
      <AIAssistant onNavigate={onNavigate} />

      {/* Toasts */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl text-white text-sm font-500 shadow-xl toast-in ${
              t.type === "success" ? "bg-slate-900" :
              t.type === "error" ? "bg-red-600" :
              "bg-slate-700"
            }`}
          >
            <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
            {t.message}
          </div>
        ))}
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex">
        {[
          { icon: "🏠", label: "Home", page: "home" as Page },
          { icon: "🔍", label: "Search", page: "search" as Page },
          { icon: "❤️", label: "Wishlist", page: "wishlist" as Page, badge: wishlistIds.size },
          { icon: "🛒", label: "Cart", page: "cart" as Page, badge: cartCount },
          { icon: "👤", label: "Account", page: "account" as Page },
        ].map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-500 relative ${nav.page === item.page ? "text-blue-600" : "text-slate-500"}`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.badge != null && item.badge > 0 && (
              <span className="absolute top-1.5 right-1/2 translate-x-2 w-4 h-4 bg-blue-600 text-white text-[9px] font-700 rounded-full flex items-center justify-center">{item.badge}</span>
            )}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom padding for mobile nav */}
      <div className="lg:hidden h-14"/>
    </div>
  );
}
