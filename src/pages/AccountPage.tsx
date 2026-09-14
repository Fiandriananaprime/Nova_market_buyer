import type { Page } from "../data";
import { mockOrder, products } from "../data";

interface AccountPageProps {
  onNavigate: (page: Page, payload?: unknown) => void;
  activeSub?: string;
}

const orderList = [
  { ...mockOrder, status: "delivered", date: "Oct 15, 2024" },
  { ...mockOrder, id: "ORD-2024-771203", status: "in-transit", date: "Nov 20, 2024" },
  { ...mockOrder, id: "ORD-2024-643918", status: "processing", date: "Nov 18, 2024" },
];

const statusColors: Record<string, string> = {
  delivered: "bg-green-50 text-green-700",
  "in-transit": "bg-blue-50 text-blue-700",
  processing: "bg-amber-50 text-amber-700",
  shipped: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function AccountPage({ onNavigate, activeSub = "overview" }: AccountPageProps) {
  const tabs = [
    { id: "overview", label: "Dashboard", icon: "🏠" },
    { id: "orders", label: "My Orders", icon: "📦" },
    { id: "wishlist", label: "Wishlist", icon: "❤️" },
    { id: "addresses", label: "Addresses", icon: "📍" },
    { id: "payment-methods", label: "Payment", icon: "💳" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "returns", label: "Returns", icon: "↩️" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-56 flex-shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              {/* User */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-700">AJ</div>
                  <div>
                    <p className="font-700 text-slate-900 text-sm">Alex Johnson</p>
                    <p className="text-xs text-slate-400">alex@email.com</p>
                  </div>
                </div>
              </div>
              {/* Nav */}
              <nav className="p-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => onNavigate(tab.id as Page)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${activeSub === tab.id || (tab.id === "orders" && activeSub === "orders") ? "bg-blue-50 text-blue-700 font-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-2 pt-2">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <span>🚪</span>
                    Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Dashboard overview */}
            {activeSub === "overview" && (
              <div className="space-y-5">
                <h1 className="font-display text-2xl font-700 text-slate-900">Welcome back, Alex</h1>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Orders", value: "24", sub: "All time", icon: "📦", page: "orders" },
                    { label: "Wishlist Items", value: "12", sub: "Saved products", icon: "❤️", page: "wishlist" },
                    { label: "Reviews Written", value: "8", sub: "Verified", icon: "⭐", page: "account" },
                    { label: "Loyalty Points", value: "2,450", sub: "$24.50 value", icon: "🎁", page: "account" },
                  ].map((card, i) => (
                    <button
                      key={i}
                      onClick={() => onNavigate(card.page as Page)}
                      className="bg-white border border-slate-200 rounded-xl p-4 text-left hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <span className="text-2xl block mb-2">{card.icon}</span>
                      <p className="font-display text-2xl font-800 text-slate-900">{card.value}</p>
                      <p className="text-xs font-600 text-slate-700">{card.label}</p>
                      <p className="text-[10px] text-slate-400">{card.sub}</p>
                    </button>
                  ))}
                </div>

                {/* Recent orders */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h2 className="font-700 text-slate-900 text-sm">Recent Orders</h2>
                    <button onClick={() => onNavigate("orders")} className="text-xs text-blue-600 font-600 hover:underline">View all →</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {orderList.slice(0, 3).map((order, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-4 px-5 py-4">
                        <img src={order.items[0].product.image} alt="" className="w-12 h-12 object-cover rounded-xl bg-slate-50 flex-shrink-0"/>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-600 text-slate-900">#{order.id}</p>
                          <p className="text-xs text-slate-400">{order.date}</p>
                        </div>
                        <span className={`text-[10px] font-700 px-2 py-1 rounded-full capitalize ${statusColors[order.status] || "bg-slate-100 text-slate-600"}`}>
                          {order.status.replace("-", " ")}
                        </span>
                        <span className="font-700 text-slate-900 text-sm">${order.total.toFixed(2)}</span>
                        <button onClick={() => onNavigate("order-tracking")} className="text-xs text-blue-600 hover:underline font-600">Track →</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recently viewed */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h2 className="font-700 text-slate-900 text-sm mb-4">Recently Viewed</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {products.slice(0, 4).map(p => (
                      <button key={p.id} onClick={() => onNavigate("product", p)} className="text-left group">
                        <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"/>
                        </div>
                        <p className="text-xs font-600 text-slate-900 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-blue-600 font-700">${p.price.toFixed(2)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders list */}
            {activeSub === "orders" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="font-display text-2xl font-700 text-slate-900">My Orders</h1>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 overflow-x-auto scroll-x">
                  {["All", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"].map(t => (
                    <button key={t} className={`px-4 py-1.5 rounded-full text-sm font-600 whitespace-nowrap transition-colors ${t === "All" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"}`}>{t}</button>
                  ))}
                </div>

                {orderList.map((order, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-slate-50 border-b border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500">Order # <span className="font-700 text-slate-900">{order.id}</span></p>
                        <p className="text-xs text-slate-400">Placed {order.date}</p>
                      </div>
                      <span className={`text-[10px] font-700 px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || "bg-slate-100 text-slate-600"}`}>
                        {order.status.replace("-", " ")}
                      </span>
                    </div>
                    {order.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 last:border-0">
                        <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-cover rounded-xl bg-slate-50 flex-shrink-0"/>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-600 text-slate-900 line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-slate-400">Seller: {item.seller.name} • Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-700 text-slate-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-2 px-5 py-3 bg-slate-50 border-t border-slate-100">
                      <button onClick={() => onNavigate("order-tracking")} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-600 hover:bg-blue-700 transition-colors">Track Order</button>
                      <button onClick={() => onNavigate("returns")} className="text-xs border border-slate-300 text-slate-600 px-3 py-1.5 rounded-lg font-600 hover:border-slate-400 transition-colors">Return</button>
                      <button className="text-xs border border-slate-300 text-slate-600 px-3 py-1.5 rounded-lg font-600 hover:border-slate-400 transition-colors">Write Review</button>
                      <span className="ml-auto text-sm font-700 text-slate-900">Total: ${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
