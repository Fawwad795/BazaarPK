import { Link } from 'react-router-dom';
import { ChevronLeft, Minus, Moon, PackageOpen, Plus, Sun } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/helpers';
import { useThemeStore } from '../store/themeStore';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCartStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const navBg = isLight ? 'bg-white' : 'bg-[#1a1a1a]';
  const borderColor = isLight ? 'border-[#d9dde5]' : 'border-[#2a2a2a]';
  const cardBg = isLight ? 'bg-white' : 'bg-[#1a1a1a]';
  const mutedBg = isLight ? 'bg-[#eef0f4]' : 'bg-[#222]';
  const inputBg = isLight ? 'bg-[#f3f5f8]' : 'bg-[#131313]';
  const titleText = isLight ? 'text-[#111827]' : 'text-white';
  const subText = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const faintText = isLight ? 'text-[#9ca3af]' : 'text-[#444]';
  const accentText = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const accentBg = isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]';
  const accentBtnText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';

  if (items.length === 0) {
    return (
      <div className={`flex min-h-screen items-center justify-center px-4 ${shellBg}`}>
        <div className="text-center">
          <PackageOpen className={`mx-auto mb-4 h-14 w-14 ${faintText}`} />
          <h2 className={`text-[34px] font-bold leading-none ${titleText}`}>Your cart is empty</h2>
          <p className={`mx-auto mt-3 max-w-md text-[14px] ${subText}`}>
            Looks like you haven&apos;t added any products yet. Start browsing to find amazing deals!
          </p>
          <Link
            to="/buyer"
            className={`mt-6 inline-flex h-11 items-center justify-center rounded-lg px-6 text-[14px] font-semibold ${accentBg} ${accentBtnText}`}
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = totalPrice();
  const totalDiscount = items.reduce((sum, cartItem) => {
    const diff = Math.max(0, cartItem.product.originalPrice - cartItem.product.price);
    return sum + diff * cartItem.quantity;
  }, 0);
  const deliveryFee = subtotal >= 5000 ? 0 : 200;
  const platformFee = 49;
  const grandTotal = subtotal - totalDiscount + deliveryFee + platformFee;
  return (
    <div className={`min-h-screen ${shellBg}`}>
      <header className={`border ${borderColor} ${navBg}`}>
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-4 px-4 sm:px-6">
          <p className={`text-[20px] font-bold ${accentText}`}>BazaarPK</p>
          <Link to="/buyer" className={`inline-flex items-center gap-1 text-[13px] font-medium ${subText}`}>
            <ChevronLeft className="h-3.5 w-3.5" />
            Continue Shopping
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className={`ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border ${borderColor} ${mutedBg} ${accentText}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
        <h1 className={`text-[40px] font-bold leading-none ${titleText}`}>Your Cart</h1>
        <p className={`mt-2 text-[14px] ${subText}`}>
          {items.length} items - Save {formatPrice(totalDiscount)}
        </p>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,816px)_384px]">
          <div className="space-y-4">
            {items.map((cartItem) => (
              <article
                key={cartItem.product.id}
                className={`rounded-xl border p-[15px] ${borderColor} ${cardBg}`}
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    to={`/products/${cartItem.product.id}`}
                    className={`flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-lg ${mutedBg}`}
                  >
                    {cartItem.product.images[0] ? (
                      <img
                        src={cartItem.product.images[0]}
                        alt={cartItem.product.title}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <span className={`text-[14px] ${faintText}`}>IMG</span>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <Link
                        to={`/products/${cartItem.product.id}`}
                        className={`line-clamp-1 text-[24px] font-semibold leading-tight ${titleText}`}
                      >
                        {cartItem.product.title}
                      </Link>
                      <p className={`mt-1 text-[12px] font-medium ${accentText}`}>
                        {cartItem.product.seller.storeName}
                      </p>
                      <p className={`mt-1 text-[12px] ${subText}`}>Size: M</p>

                      <div className="mt-3 flex items-center gap-3">
                        <div
                          className={`flex h-8 w-[100px] items-center rounded-md border ${borderColor} ${mutedBg}`}
                        >
                          <button
                            type="button"
                            onClick={() => updateQuantity(cartItem.product.id, cartItem.quantity - 1)}
                            className={`w-8 text-[14px] font-bold ${titleText}`}
                          >
                            <Minus className="mx-auto h-3.5 w-3.5" />
                          </button>
                          <span className={`flex-1 text-center text-[12px] font-semibold ${titleText}`}>
                            {cartItem.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(cartItem.product.id, cartItem.quantity + 1)}
                            className={`w-8 text-[14px] font-bold ${titleText}`}
                          >
                            <Plus className="mx-auto h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(cartItem.product.id)}
                          className="text-[12px] font-medium text-[#ff5959]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-[30px] font-bold leading-none ${accentText}`}>
                        {formatPrice(cartItem.product.price)}
                      </p>
                      <p className={`mt-1 text-[12px] ${faintText}`}>
                        {formatPrice(cartItem.product.originalPrice)}
                      </p>
                      <p className={`text-[10px] ${faintText}`}>each</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className={`h-fit rounded-xl border p-6 ${borderColor} ${cardBg}`}>
            <h2 className={`text-[32px] font-semibold leading-none ${titleText}`}>Order Summary</h2>

            <div className={`mt-5 space-y-3 border-b pb-6 ${borderColor}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[13px] ${subText}`}>Subtotal ({items.length} items)</span>
                <span className={`text-[13px] font-medium ${titleText}`}>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[13px] ${subText}`}>Discount</span>
                <span className={`text-[13px] font-medium ${titleText}`}>- {formatPrice(totalDiscount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[13px] ${subText}`}>Shipping</span>
                <span className={`text-[13px] font-medium ${titleText}`}>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[13px] ${subText}`}>Platform Fee</span>
                <span className={`text-[13px] font-medium ${titleText}`}>{formatPrice(platformFee)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className={`text-[17px] font-bold ${titleText}`}>Total</p>
              <p className={`text-[34px] font-bold leading-none ${accentText}`}>{formatPrice(grandTotal)}</p>
            </div>

            <div className={`mt-6 flex h-11 items-center rounded-lg border px-3 ${borderColor} ${inputBg}`}>
              <input
                type="text"
                placeholder="Coupon code"
                className={`h-full flex-1 bg-transparent text-[13px] outline-none ${titleText} ${isLight ? 'placeholder:text-[#9ca3af]' : 'placeholder:text-[#444]'}`}
              />
              <button type="button" className={`text-[12px] font-bold ${accentText}`}>
                APPLY
              </button>
            </div>

            <Link
              to="/checkout"
              className={`mt-5 inline-flex h-[52px] w-full items-center justify-center rounded-lg text-[15px] font-semibold ${accentBg} ${accentBtnText}`}
            >
              Proceed to Checkout
            </Link>

            <p className={`mt-4 text-center text-[12px] font-medium ${subText}`}>
              Secured by BazaarPK Escrow
            </p>
          </aside>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="mt-4 text-[12px] font-medium text-[#ff5959]"
        >
          Clear Cart
        </button>
      </main>
    </div>
  );
}
