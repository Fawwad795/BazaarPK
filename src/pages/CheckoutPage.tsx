import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/helpers';
import type { PaymentMethod } from '../types';
import { trackEvent } from '../lib/analytics';
import { useThemeStore } from '../store/themeStore';
import { enableBuyerTrackShortcut } from '../components/BuyerTrackShortcut';

const paymentMethods: { id: PaymentMethod; label: string; description: string }[] = [
  { id: 'jazzcash', label: 'JazzCash', description: 'Mobile wallet  -  Instant' },
  { id: 'easypaisa', label: 'EasyPaisa', description: 'Mobile wallet  -  Instant' },
  { id: 'bank_transfer', label: 'Raast', description: 'Instant bank transfer' },
  { id: 'card', label: 'Debit/Credit Card', description: 'Visa, Mastercard' },
  { id: 'cod', label: 'Cash on Delivery', description: 'Pay when delivered  -  Rs. 49 fee' },
];

const shippingSlots = [
  { id: 'standard', title: 'Standard (3-5 days)', subtitle: 'Free' },
  { id: 'express', title: 'Express (1-2 days)', subtitle: '+ Rs. 200' },
  { id: 'same-day', title: 'Same-Day', subtitle: '+ Rs. 500' },
] as const;

export default function CheckoutPage() {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('jazzcash');
  const [selectedSlot, setSelectedSlot] = useState<'standard' | 'express' | 'same-day'>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'checkout' | 'confirmed'>('checkout');
  const [orderCode, setOrderCode] = useState('');
  const hasTrackedCheckoutRef = useRef(false);
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const subtotal = totalPrice();
  const totalDiscount = items.reduce((sum, item) => {
    const diff = Math.max(0, item.product.originalPrice - item.product.price);
    return sum + diff * item.quantity;
  }, 0);
  const shippingFee = selectedSlot === 'standard' ? 0 : selectedSlot === 'express' ? 200 : 500;
  const platformFee = 49;
  const tax = Math.round((subtotal - totalDiscount) * 0.05);
  const grandTotal = subtotal - totalDiscount + shippingFee + platformFee + tax;

  useEffect(() => {
    if (items.length === 0 || hasTrackedCheckoutRef.current) return;
    hasTrackedCheckoutRef.current = true;
    void trackEvent('begin_checkout', {
      item_count: items.length,
      value: grandTotal,
    });
  }, [items.length, grandTotal]);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    await trackEvent('purchase', {
      item_count: items.length,
      payment_method: selectedPayment,
      value: grandTotal,
    });
    setOrderCode(`BPK-${Date.now().toString().slice(-8)}`);
    setStep('confirmed');
    enableBuyerTrackShortcut();
    clearCart();
  };

  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const navBg = isLight ? 'bg-white' : 'bg-[#1a1a1a]';
  const cardBg = isLight ? 'bg-white' : 'bg-[#1a1a1a]';
  const softBg = isLight ? 'bg-[#f3f5f8]' : 'bg-[#131313]';
  const chipBg = isLight ? 'bg-[#eef0f4]' : 'bg-[#222]';
  const border = isLight ? 'border-[#d9dde5]' : 'border-[#2a2a2a]';
  const title = isLight ? 'text-[#111827]' : 'text-white';
  const sub = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const faint = isLight ? 'text-[#9ca3af]' : 'text-[#444]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const accentBg = isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]';
  const accentBtnText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';

  const summaryItems = useMemo(
    () => items.slice(0, 3).map((item) => ({
      label: item.quantity > 1 ? `${item.product.title} (x${item.quantity})` : item.product.title,
      price: item.product.price * item.quantity,
    })),
    [items]
  );

  if (items.length === 0 && step !== 'confirmed') {
    return (
      <div className={`mx-auto min-h-screen max-w-3xl px-4 py-16 text-center ${shellBg}`}>
        <h2 className={`text-2xl font-bold ${title}`}>Cart is empty</h2>
        <p className={`mt-2 ${sub}`}>Add items to your cart before checkout.</p>
        <Link
          to="/buyer"
          className={`mt-6 inline-block rounded-lg px-6 py-2.5 text-sm font-medium ${accentBg} ${accentBtnText}`}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <header className={`border ${border} ${navBg}`}>
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center px-4 sm:px-6">
          <p className={`text-[20px] font-bold ${accent}`}>BazaarPK</p>
          {step !== 'confirmed' && (
            <div className="mx-auto hidden items-center gap-2 lg:flex">
              <Link
                to="/cart"
                className={`inline-flex h-8 w-[200px] items-center justify-center rounded-md text-[12px] font-semibold ${accentBg} ${accentBtnText}`}
              >
                1 Cart
              </Link>
              <div className={`inline-flex h-8 w-[200px] items-center justify-center rounded-md text-[12px] font-semibold ${accentBg} ${accentBtnText}`}>2 Checkout</div>
              <div className={`inline-flex h-8 w-[200px] items-center justify-center rounded-md text-[12px] font-semibold ${isLight ? 'bg-[#9ca3af] text-[#6b7280]' : 'bg-[#444] text-[#9a9a9a]'}`}>3 Confirmation</div>
            </div>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className={`ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border ${border} ${chipBg} ${accent}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
        {step === 'confirmed' ? (
          <div className={`mx-auto mt-8 max-w-[640px] rounded-2xl border px-11 py-12 ${border} ${cardBg}`}>
            <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-[39px] font-bold ${accentBg} ${accentBtnText}`}>
              OK
            </div>
            <h2 className={`mt-8 text-center text-[26px] font-bold leading-none ${title}`}>Order Placed Successfully!</h2>
            <p className={`mt-3 text-center text-[14px] ${sub}`}>Your payment is now securely held in escrow.</p>

            <div className={`mt-6 grid h-16 grid-cols-2 rounded-[10px] border px-5 ${border} ${softBg}`}>
              <div className="flex flex-col justify-center">
                <p className={`text-[10px] font-medium ${faint}`}>ORDER ID</p>
                <p className={`text-[17px] font-semibold leading-none ${title}`}>#{orderCode || 'BPK-9912'}</p>
              </div>
              <div className="flex flex-col justify-center">
                <p className={`text-[10px] font-medium ${faint}`}>ESTIMATED DELIVERY</p>
                <p className={`text-[14px] font-semibold ${accent}`}>Apr 28 - Apr 30, 2026</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className={`text-[11px] font-medium ${sub}`}>ITEMS ({items.length || 3})</p>
                <p className={`mt-1 text-[13px] ${title}`}>
                  {summaryItems.map((item) => item.label).join(', ') || 'Embroidered Kurta (x2), Handwoven Rug, Wireless Earbuds'}
                </p>
              </div>
              <div>
                <p className={`text-[11px] font-medium ${sub}`}>PAID VIA</p>
                <p className={`mt-1 text-[13px] font-semibold ${title}`}>
                  {paymentMethods.find((m) => m.id === selectedPayment)?.label || 'JazzCash'} - {formatPrice(grandTotal)}
                </p>
              </div>
              <div>
                <p className={`text-[11px] font-medium ${sub}`}>DELIVERY ADDRESS</p>
                <p className={`mt-1 text-[13px] ${title}`}>DHA Phase 5, Lahore</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate('/account')}
                className={`h-12 rounded-lg text-[14px] font-semibold ${accentBg} ${accentBtnText}`}
              >
                Track Your Order
              </button>
              <button
                type="button"
                onClick={() => navigate('/buyer')}
                className={`h-12 rounded-lg border text-[14px] font-medium ${border} ${chipBg} ${title}`}
              >
                Continue Shopping
              </button>
            </div>
            <p className={`mt-4 text-center text-[12px] ${sub}`}>
              Funds release automatically 7 days after delivery, unless a dispute is filed.
            </p>
          </div>
        ) : (
          <>
            <h1 className={`text-[40px] font-bold leading-none ${title}`}>Checkout</h1>
            <p className={`mt-2 text-[13px] ${sub}`}>Complete your purchase securely</p>

            <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,816px)_384px]">
              <div className="space-y-4">
                <section className={`rounded-xl border p-5 ${border} ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <h2 className={`text-[32px] font-semibold leading-none ${title}`}>Delivery Address</h2>
                    <button type="button" className={`text-[12px] font-medium ${accent}`}>Change</button>
                  </div>

                  <div className={`mt-4 rounded-lg border-2 p-4 ${isLight ? 'border-[#00b851] bg-[#f3f5f8]' : 'border-[#00ff7a] bg-[#131313]'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 h-4 w-4 rounded-full border-2 ${isLight ? 'border-[#00b851]' : 'border-[#00ff7a]'}`}>
                        <div className={`m-[2px] h-2 w-2 rounded-full ${isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]'}`} />
                      </div>
                      <div>
                        <p className={`text-[14px] font-semibold ${title}`}>Sara Ahmed - +92 300 1234567</p>
                        <p className={`mt-1 text-[13px] ${sub}`}>House 45, Street 12, DHA Phase 5, Lahore, Punjab 54792</p>
                        <span className={`mt-2 inline-flex rounded px-2 py-1 text-[10px] font-bold ${chipBg} ${accent}`}>HOME</span>
                      </div>
                    </div>
                  </div>

                  <button type="button" className={`mt-3 h-11 w-full rounded-lg border border-dashed text-[13px] font-semibold ${border} ${accent}`}>
                    + Add New Delivery Address
                  </button>

                  <p className={`mt-4 text-[11px] font-medium ${sub}`}>DELIVERY SLOT</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {shippingSlots.map((slot) => {
                      const active = selectedSlot === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`h-14 rounded-lg border px-3 text-left ${active ? `border-2 ${isLight ? 'border-[#00b851]' : 'border-[#00ff7a]'}` : border} ${softBg}`}
                        >
                          <p className={`text-[13px] font-semibold ${title}`}>{slot.title}</p>
                          <p className={`text-[12px] font-medium ${active ? accent : sub}`}>{slot.subtitle}</p>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className={`rounded-xl border p-5 ${border} ${cardBg}`}>
                  <h2 className={`text-[32px] font-semibold leading-none ${title}`}>Payment Method</h2>
                  <p className={`mt-2 text-[12px] font-medium ${accent}`}>Payments held in escrow until you confirm delivery</p>

                  <div className="mt-4 space-y-2">
                    {paymentMethods.map((method) => {
                      const active = selectedPayment === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedPayment(method.id)}
                          className={`flex h-12 w-full items-center rounded-lg border px-3 text-left ${active ? `border-2 ${isLight ? 'border-[#00b851]' : 'border-[#00ff7a]'}` : border} ${softBg}`}
                        >
                          <div className={`mr-3 h-4 w-4 rounded-full border-2 ${active ? (isLight ? 'border-[#00b851]' : 'border-[#00ff7a]') : (isLight ? 'border-[#6b7280]' : 'border-[#9a9a9a]')}`}>
                            {active && <div className={`m-[2px] h-2 w-2 rounded-full ${isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]'}`} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-[14px] font-semibold ${title}`}>{method.label}</p>
                            <p className={`text-[12px] ${sub}`}>{method.description}</p>
                          </div>
                          {active && (
                            <span className={`inline-flex h-[22px] items-center rounded px-2 text-[10px] font-bold ${accentBg} ${accentBtnText}`}>
                              SELECTED
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              <aside className={`h-fit rounded-xl border p-5 ${border} ${cardBg}`}>
                <h2 className={`text-[32px] font-semibold leading-none ${title}`}>Order Summary</h2>
                <div className="mt-4 space-y-2">
                  {summaryItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className={`text-[12px] ${sub}`}>{item.label}</span>
                      <span className={`text-[12px] font-medium ${title}`}>{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
                <div className={`my-4 border-t ${border}`} />
                <div className="space-y-2">
                  <div className="flex items-center justify-between"><span className={`text-[13px] ${sub}`}>Subtotal</span><span className={`text-[13px] font-medium ${title}`}>{formatPrice(subtotal)}</span></div>
                  <div className="flex items-center justify-between"><span className={`text-[13px] ${sub}`}>Discount</span><span className={`text-[13px] font-medium ${title}`}>- {formatPrice(totalDiscount)}</span></div>
                  <div className="flex items-center justify-between"><span className={`text-[13px] ${sub}`}>Shipping</span><span className={`text-[13px] font-medium ${title}`}>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span></div>
                  <div className="flex items-center justify-between"><span className={`text-[13px] ${sub}`}>Platform Fee</span><span className={`text-[13px] font-medium ${title}`}>{formatPrice(platformFee)}</span></div>
                  <div className="flex items-center justify-between"><span className={`text-[13px] ${sub}`}>Tax (GST 5%)</span><span className={`text-[13px] font-medium ${title}`}>{formatPrice(tax)}</span></div>
                </div>
                <div className={`my-4 border-t ${border}`} />
                <div className="flex items-center justify-between">
                  <span className={`text-[18px] font-bold ${title}`}>Total</span>
                  <span className={`text-[34px] font-bold leading-none ${accent}`}>{formatPrice(grandTotal)}</span>
                </div>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className={`mt-5 h-[52px] w-full rounded-lg text-[15px] font-semibold ${accentBg} ${accentBtnText} disabled:opacity-60`}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
                <p className={`mt-3 text-[11px] ${faint}`}>
                  By placing your order, you agree to our Terms of Service and Escrow Policy.
                </p>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
