import type { Page } from "../data";
import { mockOrder } from "../data";

interface OrderConfirmationPageProps {
  onNavigate: (page: Page, payload?: unknown) => void;
}

export default function OrderConfirmationPage({ onNavigate }: OrderConfirmationPageProps) {
  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-10">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          {/* Success header */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4 text-white text-2xl">✓</div>
            <h1 className="font-display text-2xl font-800 text-slate-900 mb-1">Order Confirmed!</h1>
            <p className="text-slate-500">Thank you for your purchase. Your order is being processed.</p>
          </div>

          {/* Order details */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Order Number", value: mockOrder.id },
                { label: "Estimated Delivery", value: mockOrder.estimatedDelivery },
                { label: "Payment", value: "Visa ****3456" },
                { label: "Total", value: `$${mockOrder.total.toFixed(2)}` },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-sm font-700 text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Items by seller */}
            <div>
              <h3 className="font-700 text-slate-900 text-sm mb-3">Order Details</h3>
              {mockOrder.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
                  <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg bg-slate-50"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-600 text-slate-900 line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-slate-400">Seller: {item.seller.name} • Qty: {item.quantity}</p>
                  </div>
                  <span className="font-700 text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Delivery address */}
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-600 text-slate-500 uppercase tracking-wider mb-2">Delivering to</p>
              <p className="text-sm font-600 text-slate-900">{mockOrder.address.name}</p>
              <p className="text-sm text-slate-600">{mockOrder.address.line1}</p>
              <p className="text-sm text-slate-600">{mockOrder.address.city}, {mockOrder.address.region} {mockOrder.address.zip}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate("order-tracking")}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-700 hover:bg-blue-700 transition-colors text-sm"
              >
                Track Order
              </button>
              <button
                onClick={() => onNavigate("orders")}
                className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl font-700 hover:border-slate-400 transition-colors text-sm"
              >
                View All Orders
              </button>
              <button
                onClick={() => onNavigate("home")}
                className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl font-700 hover:border-slate-400 transition-colors text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
