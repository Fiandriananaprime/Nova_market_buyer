import { useState } from "react";
import type { Product } from "../data";

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  inWishlist?: boolean;
  showCompare?: boolean;
  onCompare?: (product: Product) => void;
  inComparison?: boolean;
  compact?: boolean;
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.floor(rating) ? "#f59e0b" : i - 0.5 <= rating ? "url(#half)" : "none"} stroke="#f59e0b" strokeWidth={1.5}>
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#f59e0b"/>
              <stop offset="50%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  );
}

export { Stars };

export default function ProductCard({
  product,
  onView,
  onAddToCart,
  onAddToWishlist,
  inWishlist = false,
  showCompare = false,
  onCompare,
  inComparison = false,
  compact = false,
}: ProductCardProps) {
  const [wished, setWished] = useState(inWishlist);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWished(!wished);
    onAddToWishlist(product);
  };

  const handleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAddedToCart(true);
    onAddToCart(product);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer relative flex flex-col"
      onClick={() => onView(product)}
    >
      {/* Image */}
      <div className="relative bg-slate-50 product-image-zoom">
        {product.badge && (
          <span className={`absolute top-2 left-2 z-10 text-[10px] font-700 px-2 py-0.5 rounded-full ${
            product.badge === "Best Seller" ? "bg-amber-400 text-amber-900" :
            product.badge === "New" ? "bg-green-500 text-white" :
            product.badge === "Deal" ? "bg-red-500 text-white" :
            "bg-blue-600 text-white"
          }`}>
            {product.badge}
          </span>
        )}
        {product.discount > 0 && (
          <span className="absolute top-2 right-2 z-10 bg-red-50 text-red-600 text-[10px] font-700 px-1.5 py-0.5 rounded-md border border-red-100">
            -{product.discount}%
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute bottom-2 right-2 z-10 w-7 h-7 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-red-300"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={wished ? "#ef4444" : "none"} stroke={wished ? "#ef4444" : "#64748b"} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

        <img
          src={product.image}
          alt={product.name}
          className={`w-full object-cover ${compact ? "h-40" : "h-52"}`}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <p className="text-[10px] text-blue-600 font-600 uppercase tracking-wider">{product.brand}</p>
        <h3 className={`text-slate-900 font-500 leading-snug ${compact ? "text-xs line-clamp-2" : "text-sm line-clamp-2"}`}>{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} size={12} />
          <span className="text-[11px] text-slate-500">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className={`font-700 text-slate-900 ${compact ? "text-base" : "text-lg"}`}>${product.price.toFixed(2)}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Seller + shipping */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 truncate">by {product.seller.name}</span>
          {product.freeShipping && (
            <span className="text-[10px] text-green-600 font-500">Free ship</span>
          )}
        </div>

        {/* Delivery */}
        <p className="text-[10px] text-slate-400">
          Delivery in {product.deliveryDays} day{product.deliveryDays > 1 ? "s" : ""}
        </p>

        {/* Actions */}
        <div className="flex gap-1.5 mt-1">
          {showCompare && onCompare && (
            <button
              onClick={e => { e.stopPropagation(); onCompare(product); }}
              className={`text-[10px] px-2 py-1 rounded-md border transition-colors ${inComparison ? "bg-blue-50 border-blue-300 text-blue-700" : "border-slate-200 text-slate-500 hover:border-blue-300"}`}
            >
              {inComparison ? "✓ Comparing" : "Compare"}
            </button>
          )}
          <button
            onClick={handleCart}
            className={`flex-1 text-xs py-1.5 rounded-lg font-600 transition-all ${
              addedToCart
                ? "bg-green-500 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {addedToCart ? "✓ Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
