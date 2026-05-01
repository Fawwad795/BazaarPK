import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Minus, Moon, Plus, Star, Sun } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { formatPrice, getDiscountPercentage, formatDate } from '../utils/helpers';
import { fetchReviews } from '../services/firestoreService';
import type { Review } from '../types';
import { trackEvent } from '../lib/analytics';
import { useThemeStore } from '../store/themeStore';
import BuyerCartShortcut from '../components/BuyerCartShortcut';
import BuyerTrackShortcut from '../components/BuyerTrackShortcut';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedImage, setSelectedImage] = useState(0);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const { products, fetchProducts } = useProductStore();
  const { addToCart, totalItems } = useCartStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const product = products.find((p) => p.id === productId);
  useEffect(() => {
    if (!productId) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
    fetchReviews(productId).then(setProductReviews).catch(console.error);
    void trackEvent('view_item', { item_id: productId });
  }, [productId]);

  if (products.length === 0) {
    return <LoadingSpinner message="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Product Not Found
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const discount = getDiscountPercentage(product.price, product.originalPrice);
  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const borderColor = isLight ? 'border-[#d9dde5]' : 'border-[#2a2a2a]';
  const navBg = isLight ? 'bg-white' : 'bg-[#1a1a1a]';
  const panelBg = isLight ? 'bg-white' : 'bg-[#1a1a1a]';
  const mutedBg = isLight ? 'bg-[#eef0f4]' : 'bg-[#222]';
  const titleText = isLight ? 'text-[#111827]' : 'text-white';
  const subText = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const faintText = isLight ? 'text-[#9ca3af]' : 'text-[#444]';
  const accentText = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const accentBg = isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]';
  const accentBtnText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';
  const redChip = isLight ? 'bg-[#fde0e0] text-[#ff5959]' : 'bg-[#3d0d0d] text-[#ff5959]';
  const imageUrl = product.images?.[selectedImage] || product.images?.[0] || '';
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const thumbnails = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images.slice(0, 4);
    }
    return ['', '', '', ''];
  }, [product.images]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    void trackEvent('add_to_cart', { item_id: product.id, quantity });
  };

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <BuyerCartShortcut />
      <BuyerTrackShortcut />
      <header className={`border ${borderColor} ${navBg}`}>
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-4 px-4 sm:px-6">
          <p className={`text-[20px] font-bold ${accentText}`}>BazaarPK</p>
          <Link to="/" className={`inline-flex items-center gap-1 text-[13px] font-medium ${subText}`}>
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Products
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className={`ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border ${borderColor} ${mutedBg} ${accentText}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/cart"
            className={`inline-flex h-9 min-w-[102px] items-center justify-center rounded-lg px-3 text-[13px] font-semibold ${accentBg} ${accentBtnText}`}
          >
            Cart ({totalItems()})
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
        <p className={`text-[12px] ${faintText}`}>Home / Clothing / Kurtas / {product.title}</p>

        <section className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
          <div>
            <div className={`overflow-hidden rounded-xl border ${borderColor} ${panelBg}`}>
              {imageUrl ? (
                <img src={imageUrl} alt={product.title} className="h-[560px] w-full object-cover" />
              ) : (
                <div className={`flex h-[560px] items-center justify-center text-center text-[36px] font-medium ${faintText}`}>
                  <div>
                    <p>PRODUCT</p>
                    <p>IMAGE</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {thumbnails.map((thumb, idx) => {
                const active = idx === selectedImage;
                return (
                  <button
                    key={`${thumb || 'placeholder'}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`h-24 overflow-hidden rounded-lg border text-[14px] ${active ? `border-2 ${isLight ? 'border-[#00b851]' : 'border-[#00ff7a]'}` : borderColor} ${panelBg} ${faintText}`}
                  >
                    {thumb ? (
                      <img src={thumb} alt={`${product.title} ${idx + 1}`} className="h-full w-full object-cover" />
                    ) : (
                      `${idx + 1}`
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`rounded-xl border p-5 ${borderColor} ${panelBg}`}>
            <span className={`inline-flex h-6 items-center rounded px-3 text-[11px] font-bold ${accentBg} ${accentBtnText}`}>
              VERIFIED
            </span>
            <h1 className={`mt-3 text-[26px] font-bold leading-tight ${titleText}`}>{product.title}</h1>
            <p className={`mt-2 text-[13px] font-medium ${accentText}`}>
              by {product.seller.storeName} - Verified Artisan
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center text-[14px] font-semibold text-[#ffd133]">
                <Star className="mr-1 h-3.5 w-3.5 fill-current" />
                {product.rating.toFixed(1)}
              </span>
              <span className={`text-[13px] ${subText}`}>
                ({product.reviewCount} reviews) - 1,240 sold
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <p className={`text-[40px] font-bold leading-none ${accentText}`}>{formatPrice(product.price)}</p>
              {discount > 0 && (
                <>
                  <span className={`inline-flex h-[22px] items-center rounded px-3 text-[11px] font-bold ${redChip}`}>
                    -{discount}%
                  </span>
                  <p className={`text-[20px] line-through ${faintText}`}>{formatPrice(product.originalPrice)}</p>
                </>
              )}
            </div>

            <p className={`mt-3 text-[11px] font-medium ${subText}`}>DESCRIPTION</p>
            <p className={`mt-2 text-[13px] leading-relaxed ${titleText}`}>{product.description}</p>

            <p className={`mt-6 text-[11px] font-medium ${subText}`}>SIZE</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((size) => {
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 min-w-12 rounded-md border px-3 text-[13px] font-semibold ${active ? `${accentBg} ${accentBtnText} border-transparent` : `${mutedBg} ${titleText} ${borderColor}`}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            <p className={`mt-4 text-[11px] font-medium ${subText}`}>QUANTITY</p>
            <div className="mt-2 flex items-center gap-3">
              <div className={`flex h-10 w-[140px] items-center rounded-md border ${borderColor} ${mutedBg}`}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`w-10 text-[18px] font-bold ${titleText}`}
                >
                  <Minus className="mx-auto h-3.5 w-3.5" />
                </button>
                <span className={`flex-1 text-center text-[14px] font-semibold ${titleText}`}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className={`w-10 text-[18px] font-bold ${titleText}`}
                >
                  <Plus className="mx-auto h-3.5 w-3.5" />
                </button>
              </div>
              <p className={`text-[12px] font-medium ${accentText}`}>In Stock - {product.stock} left</p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`h-[52px] rounded-lg text-[15px] font-semibold ${accentBg} ${accentBtnText} disabled:opacity-60`}
              >
                Add to Cart
              </button>
              <button
                type="button"
                className={`h-[52px] rounded-lg border text-[15px] font-semibold ${borderColor} ${mutedBg} ${accentText}`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </section>

        <section className={`mt-4 grid gap-3 rounded-xl border p-5 text-[13px] font-medium sm:grid-cols-2 lg:grid-cols-4 ${borderColor} ${panelBg} ${titleText}`}>
          <p className="text-center">Escrow Protected</p>
          <p className="text-center">Free Delivery over Rs.2000</p>
          <p className="text-center">7-Day Return Policy</p>
          <p className="text-center">Verified Seller</p>
        </section>

        <section className="mt-6">
          <h2 className={`text-[32px] font-semibold leading-none ${titleText}`}>Customer Reviews</h2>
          <p className={`mt-2 text-[13px] ${subText}`}>
            {product.rating.toFixed(1)} out of 5 - {product.reviewCount} reviews
          </p>
          <div className="mt-4 space-y-3">
            {(productReviews.length > 0 ? productReviews.slice(0, 3) : [
              {
                id: 'a',
                userName: 'Ali Hassan',
                userAvatar: '',
                rating: 5,
                createdAt: new Date().toISOString(),
                comment: 'Excellent quality! The embroidery is so detailed. Fits perfectly. Will order again.',
                isVerifiedPurchase: true,
                productId: product.id,
                userId: 'demo-a',
              },
            ]).map((review) => (
              <div
                key={review.id}
                className={`rounded-xl border p-4 ${borderColor} ${panelBg}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-[15px] font-bold ${accentBg} ${accentBtnText}`}>
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <p className={`text-[14px] font-semibold ${titleText}`}>{review.userName}</p>
                      <p className="mt-0.5 text-[12px] font-medium text-[#ffd133]">
                        * {review.rating} - {formatDate(review.createdAt)}
                      </p>
                      <p className={`mt-2 text-[13px] ${subText}`}>
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {productReviews.length === 0 && (
              <p className={`text-[13px] ${subText}`}>
                No reviews yet. Be the first to review this product.
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className={`mt-4 border ${borderColor} ${navBg}`}>
        <div className={`mx-auto max-w-[1280px] py-5 text-center text-[12px] ${faintText}`}>
          (c) 2026 BazaarPK
        </div>
      </footer>
    </div>
  );
}
