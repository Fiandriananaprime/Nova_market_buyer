import type { Page, Product } from "../data";
import { products as allProducts } from "../data";

interface ComparisonPageProps {
  products: Product[];
  onNavigate: (page: Page, payload?: unknown) => void;
  onAddToCart: (product: Product) => void;
}

export default function ComparisonPage({ products, onNavigate, onAddToCart }: ComparisonPageProps) {
  const compareList = products.length >= 2 ? products : allProducts.slice(0, 3);

  const rows = [
    { label: "Price", key: (p: Product) => `$${p.price.toFixed(2)}`, highlight: true },
    { label: "Original Price", key: (p: Product) => `$${p.originalPrice.toFixed(2)}`, highlight: false },
    { label: "Discount", key: (p: Product) => p.discount > 0 ? `-${p.discount}%` : "—", highlight: false },
    { label: "Rating", key: (p: Product) => `${p.rating} ★ (${p.reviewCount.toLocaleString()})`, highlight: false },
    { label: "Brand", key: (p: Product) => p.brand, highlight: false },
    { label: "Seller", key: (p: Product) => p.seller.name, highlight: false },
    { label: "Delivery", key: (p: Product) => `${p.deliveryDays} day${p.deliveryDays > 1 ? "s" : ""}`, highlight: false },
    { label: "Free Shipping", key: (p: Product) => p.freeShipping ? "✓ Yes" : "✕ No", highlight: false },
    { label: "In Stock", key: (p: Product) => p.inStock ? "✓ In Stock" : "✕ Out of Stock", highlight: false },
    { label: "Warranty", key: (p: Product) => p.specs["Warranty"] || "—", highlight: false },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-700 text-slate-900">Product Comparison</h1>
            <p className="text-slate-500 text-sm">Comparing {compareList.length} products</p>
          </div>
          <button onClick={() => onNavigate("search", { query: "" })} className="text-sm text-blue-600 font-600 hover:underline">← Back to Search</button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              {/* Product headers */}
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-4 text-left text-sm font-700 text-slate-500 w-36">Feature</th>
                  {compareList.map(p => (
                    <th key={p.id} className="p-4 text-center align-top">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-28 h-28 rounded-xl overflow-hidden bg-slate-50 mx-auto">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-blue-600 font-600 uppercase">{p.brand}</p>
                          <p className="text-sm font-600 text-slate-900 line-clamp-2 text-center">{p.name}</p>
                        </div>
                        <button
                          onClick={() => onAddToCart(p)}
                          className="bg-blue-600 text-white text-xs font-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => onNavigate("product", p)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View details →
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, i) => {
                  const values = compareList.map(p => row.key(p));
                  const unique = new Set(values).size > 1;
                  return (
                    <tr key={row.label} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-slate-50/50" : "bg-white"} ${unique && row.highlight ? "bg-amber-50" : ""}`}>
                      <td className="p-4 text-sm font-600 text-slate-600">{row.label}</td>
                      {compareList.map((p, j) => {
                        const val = row.key(p);
                        const isPrice = row.label === "Price";
                        const isLowest = isPrice && val === values.reduce((a, b) => parseFloat(a.replace("$", "")) < parseFloat(b.replace("$", "")) ? a : b);
                        return (
                          <td key={p.id + row.label} className="p-4 text-center">
                            <span className={`text-sm ${
                              isLowest ? "text-green-600 font-700" :
                              val.includes("✓") ? "text-green-600 font-600" :
                              val.includes("✕") ? "text-red-400" :
                              "text-slate-700"
                            }`}>
                              {val}
                            </span>
                            {isLowest && <span className="block text-[9px] text-green-600 font-600 mt-0.5">Best Price</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Specs */}
                {Object.keys(compareList[0]?.specs || {}).map(specKey => (
                  <tr key={specKey} className="border-b border-slate-100">
                    <td className="p-4 text-sm font-600 text-slate-600">{specKey}</td>
                    {compareList.map(p => (
                      <td key={p.id + specKey} className="p-4 text-center text-sm text-slate-700">
                        {p.specs[specKey] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
