import type { CartItem, Page } from "../data";
import { products } from "../data";
import ProductCard from "../components/ProductCard";

interface CartPageProps {
  cart: CartItem[];
  onNavigate: (page: Page, payload?: unknown) => void;
  onUpdateQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onAddToCart: (product: (typeof products)[0]) => void;
  onAddToWishlist: (product: (typeof products)[0]) => void;
  wishlistIds: Set<string>;
}

export default function CartPage({ cart, onNavigate, onUpdateQty, onRemove, onAddToCart, onAddToWishlist, wishlistIds }: CartPageProps) {
  const grouped = cart.reduce((acc, item) => {
    const key = item.selectedSeller.id;
    if (!acc[key]) acc[key] = { seller: item.selectedSeller, items: [] };
    acc[key].items.push(item);
    return acc;
  }, {} as Record<string, { seller: CartItem["selectedSeller"]; items: CartItem[] }>);

  const subtotal = cart.reduce((s, i) => s + i.selectedPrice * i.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const frequently = products.filter(p => !cart.some(c => c.product.id === p.id)).slice(0, 4);

  if (cart.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center p-10">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6 text-4xl">🛒</div>
          <h2 className="font-display text-2xl font-700 text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-6">Looks like you haven't added anything yet.</p>
          <button onClick={() => onNavigate("home")} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-600 hover:bg-blue-700 transition-colors">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-700 text-slate-900 mb-6">
          Shopping Cart <span className="text-slate-400 font-400 text-lg">({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items */}
          <div className="flex-1 space-y-4">
            {Object.values(grouped).map(group => (
              <div key={group.seller.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {/* Seller header */}
                <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-700">{group.seller.logo}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-700 text-slate-900">{group.seller.name}</span>
                    {group.seller.verified && <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-600">✓ Verified</span>}
                  </div>
                  <span className="text-xs text-slate-400 ml-auto">★ {group.seller.rating}</span>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100">
                  {group.items.map(item => (
                    <div key={item.product.id} className="flex gap-4 p-5">
                      <button onClick={() => onNavigate("product", item.product)} className="flex-shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl bg-slate-50"/>
                      </button>
                      <div className="flex-1 min-w-0">
                        <button onClick={() => onNavigate("product", item.product)} className="text-left">
                          <p className="text-[10px] text-blue-600 font-600 uppercase">{item.product.brand}</p>
                          <p className="text-sm font-600 text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors">{item.product.name}</p>
                        </button>
                        {item.variant && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(", ")}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px] text-green-600 font-500">
                            {item.product.freeShipping ? "Free delivery" : `$${(4.99).toFixed(2)} shipping`}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] text-slate-400">Est. {item.product.deliveryDays} days</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button onClick={() => onUpdateQty(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors text-sm font-700">−</button>
                            <span className="w-8 text-center text-sm font-600">{item.quantity}</span>
                            <button onClick={() => onUpdateQty(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors text-sm font-700">+</button>
                          </div>
                          <button onClick={() => onRemove(item.product.id)} className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors">Remove</button>
                          <button className="text-xs text-slate-500 hover:text-blue-600 hover:underline transition-colors">Save for later</button>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-700 text-slate-900 text-base">${(item.selectedPrice * item.quantity).toFixed(2)}</p>
                        {item.quantity > 1 && <p className="text-xs text-slate-400">${item.selectedPrice.toFixed(2)} each</p>}
                        {item.product.discount > 0 && <p className="text-[10px] text-red-500 font-600">-{item.product.discount}%</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Seller subtotal */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Subtotal from {group.seller.name}:</span>
                  <span className="font-700 text-slate-900">
                    ${group.items.reduce((s, i) => s + i.selectedPrice * i.quantity, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <button onClick={() => onNavigate("home")} className="text-sm text-blue-600 font-600 hover:underline flex items-center gap-1">
              ← Continue Shopping
            </button>
          </div>

          {/* Summary */}
          <div className="lg:w-80 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <h2 className="font-700 text-slate-900 text-base">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600 font-500">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (est.)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {subtotal < 50 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-2 text-xs text-amber-800">
                    Add ${(50 - subtotal).toFixed(2)} more to get <span className="font-700">Free Shipping</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between font-700 text-lg text-slate-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate("checkout")}
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-700 py-3.5 rounded-xl transition-colors text-base"
              >
                Proceed to Checkout →
              </button>

              <div className="flex items-center justify-center gap-3 text-xs text-slate-400 pt-1">
                <span>🔒 Secure checkout</span>
                <span>|</span>
                <span>🛡️ Buyer protection</span>
              </div>

              <div className="flex justify-center gap-2 pt-1">
                {["VISA", "MC", "AMEX", "PayPal"].map(m => (
                  <span key={m} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] rounded font-700">{m}</span>
                ))}
              </div>
            </div>

            {/* Promo code */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-sm font-600 text-slate-900 mb-2">Promo Code</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Enter code" className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"/>
                <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-600 hover:bg-blue-700 transition-colors">Apply</button>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently bought */}
        {frequently.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-700 text-slate-900 mb-5">Frequently Bought with These Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {frequently.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onView={() => onNavigate("product", p)}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                  inWishlist={wishlistIds.has(p.id)}
                  compact
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
