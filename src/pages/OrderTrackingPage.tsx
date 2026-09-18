import { useState } from "react";
import type { Page } from "../data";
import { mockOrder, orderStatuses } from "../data";

interface OrderTrackingPageProps {
  onNavigate: (page: Page, payload?: unknown) => void;
}

const statusLabels: Record<string, string> = {
  placed: "Order Placed",
  confirmed: "Payment Confirmed",
  preparing: "Seller Preparing",
  shipped: "Shipped",
  "in-transit": "In Transit",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
};

const statusDates: Record<string, string> = {
  placed: "Nov 20, 2024 — 9:14 AM",
  confirmed: "Nov 20, 2024 — 9:22 AM",
  preparing: "Nov 20, 2024 — 11:00 AM",
  shipped: "Nov 21, 2024 — 8:30 AM",
  "in-transit": "Nov 21, 2024 — 2:15 PM",
  "out-for-delivery": "",
  delivered: "",
};

export default function OrderTrackingPage({ onNavigate }: OrderTrackingPageProps) {
  const [showMap, setShowMap] = useState(false);
  const currentIdx = orderStatuses.indexOf(mockOrder.status);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-[900px] mx-auto px-4">
        <button onClick={() => onNavigate("orders")} className="text-sm text-blue-600 font-600 hover:underline mb-5 flex items-center gap-1">
          ← Back to Orders
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-700 text-slate-900">Track Order</h1>
            <p className="text-slate-500 text-sm">Order #{mockOrder.id} • Placed {mockOrder.date}</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">
            <span className="text-blue-600">📦</span>
            <div>
              <p className="text-xs text-blue-700 font-600">Tracking: {mockOrder.trackingNumber}</p>
              <p className="text-[10px] text-blue-500">via {mockOrder.carrier}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-4">
            {/* Status card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-700 text-slate-900 text-lg">
                  {statusLabels[mockOrder.status]}
                </h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-600">
                  {mockOrder.carrier}
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-1">Current location: {mockOrder.currentLocation}</p>
              <p className="text-green-600 font-600 text-sm">Estimated delivery: {mockOrder.estimatedDelivery}</p>
              <button
                type="button"
                onClick={() => setShowMap((visible) => !visible)}
                aria-expanded={showMap}
                className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-700 text-white transition-colors hover:bg-blue-700"
              >
                {showMap ? "Masquer la carte" : "Voir le suivi en direct"}
              </button>

              {showMap && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <div className="relative h-64 overflow-hidden bg-[#e8f0e9]" role="img" aria-label={`Carte du trajet, colis actuellement à ${mockOrder.currentLocation}`}>
                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(32deg, transparent 47%, #c5d5cb 48%, #c5d5cb 50%, transparent 51%), linear-gradient(112deg, transparent 45%, #c5d5cb 46%, #c5d5cb 48%, transparent 49%), linear-gradient(#d4e2d7 1px, transparent 1px), linear-gradient(90deg, #d4e2d7 1px, transparent 1px)", backgroundSize: "170px 140px, 220px 180px, 42px 42px, 42px 42px" }} />
                    <div className="absolute left-[18%] top-[67%] h-1 w-[62%] rotate-[-24deg] rounded-full bg-blue-600 shadow-sm" />
                    <div className="absolute left-[16%] top-[62%] flex size-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-xs font-800 text-white shadow-lg" aria-label="Point de départ">1</div>
                    <div className="absolute right-[15%] top-[18%] flex size-10 items-center justify-center rounded-full border-4 border-white bg-orange-500 text-xs font-800 text-white shadow-lg" aria-label={`Position actuelle: ${mockOrder.currentLocation}`}>●</div>
                    <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-2 text-xs font-700 text-slate-800 shadow-sm">Position actuelle<br /><span className="font-500 text-slate-500">{mockOrder.currentLocation}</span></div>
                    <div className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-3 py-2 text-right text-xs font-700 text-slate-800 shadow-sm">Arrivée estimée<br /><span className="font-500 text-green-600">Demain, avant 18:00</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 bg-white p-4 text-sm">
                    <div><p className="text-xs text-slate-400">Temps restant</p><p className="font-700 text-slate-900">~ 1 jour</p></div>
                    <div><p className="text-xs text-slate-400">Dernière mise à jour</p><p className="font-700 text-slate-900">Il y a 18 min</p></div>
                  </div>
                </div>
              )}

              {/* Progress bar */}
              <div className="mt-6 relative">
                {/* Line */}
                <div className="absolute top-3 left-3 right-3 h-0.5 bg-slate-200">
                  <div className="h-full bg-blue-600 transition-all" style={{ width: `${(currentIdx / (orderStatuses.length - 1)) * 100}%` }}/>
                </div>

                <div className="flex justify-between relative">
                  {orderStatuses.map((status, i) => {
                    const done = i <= currentIdx;
                    const current = i === currentIdx;
                    return (
                      <div key={status} className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
                          done ? (current ? "bg-blue-600 border-blue-600" : "bg-green-500 border-green-500") : "bg-white border-slate-300"
                        }`}>
                          {done && !current && <span className="text-white text-[9px] font-800">✓</span>}
                          {current && <span className="w-2 h-2 rounded-full bg-white"/>}
                        </div>
                        <span className={`text-[9px] mt-2 text-center max-w-12 leading-tight ${current ? "text-blue-600 font-700" : done ? "text-green-600" : "text-slate-400"}`}>
                          {statusLabels[status].replace(" ", "\n")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-700 text-slate-900 mb-4">Shipment Timeline</h3>
              <div className="space-y-4">
                {orderStatuses.slice(0, currentIdx + 1).reverse().map((status, i) => (
                  <div key={status} className={`flex gap-4 ${i === 0 ? "opacity-100" : "opacity-60"}`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${i === 0 ? "bg-blue-600" : "bg-green-500"}`}/>
                      {i < currentIdx && <div className="w-0.5 bg-slate-200 flex-1 mt-1"/>}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-600 text-slate-900">{statusLabels[status]}</p>
                      {statusDates[status] && <p className="text-xs text-slate-400">{statusDates[status]}</p>}
                      {status === "in-transit" && <p className="text-xs text-slate-500 mt-0.5">Package scanned at Oakland, CA Distribution Center</p>}
                      {status === "shipped" && <p className="text-xs text-slate-500 mt-0.5">Package picked up by {mockOrder.carrier}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items per seller */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
                <h3 className="font-700 text-slate-900 text-sm">Shipment Contents</h3>
              </div>
              {mockOrder.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 border-b border-slate-100 last:border-0">
                  <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-cover rounded-xl bg-slate-50 flex-shrink-0"/>
                  <div className="flex-1">
                    <p className="text-sm font-600 text-slate-900 line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-slate-400">Seller: {item.seller.name} • Qty: {item.quantity}</p>
                  </div>
                  <p className="font-700 text-slate-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Delivery address */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-700 text-slate-900 text-sm mb-3">Delivery Address</h3>
              <p className="text-sm font-600 text-slate-900">{mockOrder.address.name}</p>
              <p className="text-sm text-slate-600">{mockOrder.address.line1}</p>
              <p className="text-sm text-slate-600">{mockOrder.address.city}, {mockOrder.address.region} {mockOrder.address.zip}</p>
            </div>

            {/* Order summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-700 text-slate-900 text-sm mb-3">Order Summary</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-500"><span>Items</span><span>${(mockOrder.total - mockOrder.tax - mockOrder.shipping).toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-500"><span>Shipping</span><span>{mockOrder.shipping === 0 ? "Free" : `$${mockOrder.shipping}`}</span></div>
                <div className="flex justify-between text-slate-500"><span>Tax</span><span>${mockOrder.tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-700 text-slate-900 border-t border-slate-100 pt-2 mt-2"><span>Total</span><span>${mockOrder.total.toFixed(2)}</span></div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button className="w-full border border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-600 hover:border-slate-400 transition-colors">Contact Seller</button>
              <button onClick={() => onNavigate("returns")} className="w-full border border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-600 hover:border-slate-400 transition-colors">Return Item</button>
              <button className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors">Report a Problem</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
