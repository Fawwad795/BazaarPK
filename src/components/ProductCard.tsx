import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import type { Product } from '../types';
import { formatPrice, getDiscountPercentage } from '../utils/helpers';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);
  const discount = getDiscountPercentage(product.price, product.originalPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-surface-dark"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute right-3 top-3 rounded-full bg-accent-500 px-2.5 py-1 text-xs font-bold text-white">
            Featured
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute right-3 bottom-3 rounded-full p-2 backdrop-blur-sm transition-all group-hover:opacity-100 ${
            wishlisted
              ? 'bg-red-500 text-white opacity-100'
              : 'bg-white/80 text-gray-600 opacity-0 hover:bg-white hover:text-red-500 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        <span className="mb-1 text-xs font-medium text-primary-600 dark:text-primary-400">
          {product.category.name}
        </span>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
          {product.title}
        </h3>

        {/* Seller */}
        <div className="mb-2 flex items-center gap-1.5">
          <img
            src={product.seller.avatar}
            alt={product.seller.storeName}
            className="h-4 w-4 rounded-full"
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {product.seller.storeName}
          </span>
        </div>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {product.rating}
          </span>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <span className="ml-2 text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="rounded-lg bg-primary-600 p-2 text-white transition-colors hover:bg-primary-700"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
