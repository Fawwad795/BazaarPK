import { useEffect, useMemo, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Order, OrderStatus } from '../types';
import { fetchSellerOrders } from '../services/firestoreService';
import { formatDate, formatPrice } from '../utils/helpers';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

type Carrier = 'TCS' | 'Leopards' | 'PostEx' | 'BlueEx';

const carriers: Carrier[] = ['TCS', 'Leopards', 'PostEx', 'BlueEx'];

export default function SellerOrderDetailsPage() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier>('TCS');
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const sellerId = user?.id || 'seller-1';

  useEffect(() => {
    fetchSellerOrders(sellerId).then(setOrders).catch(console.error);
  }, [sellerId]);

  const order = useMemo(() => orders.find((o) => o.id === orderId), [orders, orderId]);

  const activeSidebar = useMemo(() => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/products') return 'Inventory';
    if (location.pathname.startsWith('/dashboard/orders')) return 'Orders';
    if (location.pathname === '/dashboard/analytics') return 'Analytics';
    if (location.pathname === '/dashboard/payments' || location.pathname === '/checkout') return 'Payments';
    if (location.pathname === '/chat') return 'Support';
    return 'Orders';
  }, [location.pathname]);

  const sidebarItems = [
    { label: 'Dashboard', action: () => navigate('/dashboard') },
    { label: 'Inventory', action: () => navigate('/products') },
    { label: 'Orders', action: () => navigate('/dashboard/orders') },
    { label: 'Analytics', action: () => navigate('/dashboard/analytics') },
    { label: 'Payments', action: () => navigate('/dashboard/payments') },
    { label: 'Support', action: () => navigate('/chat') },
    {
      label: 'Log Out',
      action: async () => {
        await logout();
        navigate('/login');
      },
    },
  ];

  const updateOrderStatus = (status: OrderStatus) => {
    if (!order) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );
  };

  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const topBarBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const cardBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const inputBg = isLight ? 'bg-[#f3f5f8] border-[#d9dde5]' : 'bg-[#131313] border-[#2a2a2a]';
  const titleColor = isLight ? 'text-[#111827]' : 'text-white';
  const subColor = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const avatarText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';

  if (!order) {
    return (
      <div className={`min-h-screen ${shellBg} flex items-center justify-center`}>
        <button type="button" onClick={() => navigate('/dashboard/orders')} className={`rounded-lg border px-4 py-2 text-sm ${isLight ? 'border-[#d9dde5] text-[#111827]' : 'border-[#2a2a2a] text-white'}`}>
          Back to Orders
        </button>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <header className={`border ${topBarBg}`}>
        <div className="flex h-[64px] w-full items-center px-4 sm:px-6 lg:px-8">
          <p className={`text-[20px] font-bold ${accent}`}>BazaarPK</p>
          <p className={`ml-6 text-[14px] font-medium ${titleColor}`}>Order Details</p>
          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${
                isLight ? 'border-[#d9dde5] bg-[#eef0f4] text-[#00b851]' : 'border-[#2a2a2a] bg-[#222] text-[#00ff7a]'
              }`}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]'} ${avatarText} text-sm font-bold`}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </div>
      </header>

      <div className="flex w-full flex-col lg:flex-row">
        <aside className={`w-full border-b px-[15px] py-6 lg:flex lg:min-h-[calc(100vh-64px)] lg:w-52 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r ${topBarBg}`}>
          <div className={`mb-6 rounded-xl border p-4 ${inputBg}`}>
            <p className={`text-[10px] font-medium ${isLight ? 'text-[#9ca3af]' : 'text-[#444]'}`}>STORE</p>
            <p className={`mt-1 text-[14px] font-semibold ${titleColor}`}>The Atelier</p>
            <p className={`mt-1 text-[11px] ${accent}`}>Verified Artisan Store</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {sidebarItems.map((item) => {
              const active = activeSidebar === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => void item.action()}
                  className={`relative h-10 rounded-lg px-4 text-left text-[13px] font-medium leading-10 transition ${
                    active
                      ? `${isLight ? 'bg-[#eef0f4] text-[#111827]' : 'bg-[#222] text-white'}`
                      : `${subColor} hover:${isLight ? 'bg-[#eef0f4]' : 'bg-[#222]'}`
                  }`}
                >
                  {active && <span className={`absolute left-0 top-2 h-6 w-[3px] rounded-sm ${isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]'}`} />}
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="w-full px-4 py-8 sm:px-6 lg:flex-1 lg:px-8">
          <button type="button" className={`text-[13px] font-medium ${subColor}`} onClick={() => navigate('/dashboard/orders')}>
            {'< Back to Orders'}
          </button>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className={`text-[38px] font-bold leading-none ${titleColor}`}>Order {order.id}</h1>
            <span className={`inline-flex h-6 w-[108px] items-center justify-center rounded border text-[10px] font-bold ${order.status === 'processing' ? `${isLight ? 'border-[#00b851] text-[#00b851]' : 'border-[#00ff7a] text-[#00ff7a]'}` : `${isLight ? 'border-[#d9dde5] text-[#6b7280]' : 'border-[#2a2a2a] text-[#9a9a9a]'}`}`}>
              {order.status.toUpperCase()}
            </span>
          </div>
          <p className={`mt-2 text-[13px] ${subColor}`}>Placed {formatDate(order.createdAt)}</p>

          <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_336px]">
            <section className={`rounded-xl border p-5 ${cardBg}`}>
              <p className={`text-[28px] font-semibold leading-none ${titleColor}`}>Items ({order.items.length})</p>
              <div className="mt-4 space-y-3">
                {order.items.map((item, index) => (
                  <div key={`${item.product.id}-${index}`} className={`grid grid-cols-[40px_1fr_56px_90px] items-center gap-3 rounded-lg border p-2 ${inputBg}`}>
                    <div className={`h-10 w-10 overflow-hidden rounded ${isLight ? 'bg-[#eef0f4]' : 'bg-[#222]'}`}>
                      <img src={item.product.images[0]} alt={item.product.title} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className={`text-[13px] font-semibold ${titleColor}`}>{item.product.title}</p>
                      <p className={`text-[11px] ${subColor}`}>SKU: {item.product.id} | {item.product.category.name}</p>
                    </div>
                    <p className={`text-[12px] font-medium ${titleColor}`}>Qty {item.quantity}</p>
                    <p className={`text-right text-[13px] font-semibold ${accent}`}>{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={`rounded-xl border p-5 ${cardBg}`}>
              <p className={`text-[15px] font-semibold ${titleColor}`}>Customer</p>
              <div className="mt-4 flex items-center gap-3">
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]'} ${avatarText} text-[20px] font-bold`}>
                  {order.shippingAddress.fullName[0]?.toUpperCase() || 'U'}
                </span>
                <div>
                  <p className={`text-[14px] font-semibold ${titleColor}`}>{order.shippingAddress.fullName}</p>
                  <p className={`text-[11px] ${subColor}`}>{user?.email || 'customer@email.com'}</p>
                </div>
              </div>
              <button type="button" className={`mt-6 h-9 w-full rounded-md border text-[12px] font-semibold ${isLight ? 'bg-[#eef0f4] border-[#d9dde5] text-[#111827]' : 'bg-[#222] border-[#2a2a2a] text-white'}`}>
                Message Customer
              </button>
            </section>

            <section className={`rounded-xl border p-5 ${cardBg}`}>
              <p className={`text-[28px] font-semibold leading-none ${titleColor}`}>Shipping Information</p>
              <p className={`mt-5 text-[10px] font-bold ${subColor}`}>SHIP TO</p>
              <p className={`mt-1 text-[14px] font-semibold ${titleColor}`}>
                {order.shippingAddress.fullName} - {order.shippingAddress.phone}
              </p>
              <p className={`mt-1 text-[13px] ${subColor}`}>
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.province}
              </p>

              <p className={`mt-6 text-[10px] font-bold ${subColor}`}>SELECT CARRIER</p>
              <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
                {carriers.map((carrier) => (
                  <button
                    key={carrier}
                    type="button"
                    onClick={() => setSelectedCarrier(carrier)}
                    className={`h-11 rounded-md border text-[13px] font-semibold ${
                      selectedCarrier === carrier
                        ? `${isLight ? 'bg-[#eef0f4] border-[#00b851] text-[#111827]' : 'bg-[#222] border-[#00ff7a] text-white'} border-2`
                        : `${inputBg} ${titleColor}`
                    }`}
                  >
                    {carrier}
                  </button>
                ))}
              </div>

              <p className={`mt-4 text-[10px] font-bold ${subColor}`}>TRACKING NUMBER</p>
              <div className={`mt-2 h-10 rounded-md border px-3 text-[13px] leading-10 ${inputBg} ${isLight ? 'text-[#9ca3af]' : 'text-[#444]'}`}>
                {order.trackingNumber || 'Auto-generated on ship'}
              </div>
            </section>

            <section className={`rounded-xl border p-5 ${cardBg}`}>
              <p className={`text-[15px] font-semibold ${titleColor}`}>Summary</p>
              <div className="mt-5 space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className={subColor}>Subtotal</span>
                  <span className={titleColor}>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={subColor}>Shipping</span>
                  <span className={titleColor}>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className={subColor}>Tax</span>
                  <span className={titleColor}>{formatPrice(tax)}</span>
                </div>
                <hr className={`my-3 ${isLight ? 'border-[#d9dde5]' : 'border-[#2a2a2a]'}`} />
                <div className="flex items-center justify-between">
                  <span className={`text-[15px] font-bold ${titleColor}`}>Total</span>
                  <span className={`text-[32px] font-bold ${accent}`}>{formatPrice(total)}</span>
                </div>
              </div>
              <p className={`mt-3 text-[11px] ${subColor}`}>Held in escrow</p>
            </section>

            <div />

            <section className={`rounded-xl border p-5 ${cardBg}`}>
              <p className={`text-[15px] font-semibold ${titleColor}`}>Actions</p>
              <button
                type="button"
                onClick={() => updateOrderStatus('shipped')}
                className={`mt-4 h-10 w-full rounded-md text-[13px] font-semibold ${isLight ? 'bg-[#00b851] text-[#f7f8fa]' : 'bg-[#00ff7a] text-[#0d0d0d]'}`}
              >
                Mark as Shipped
              </button>
              <button
                type="button"
                onClick={() => updateOrderStatus('cancelled')}
                className={`mt-3 h-10 w-full rounded-md border text-[13px] font-semibold text-[#ff5959] ${isLight ? 'bg-[#eef0f4] border-[#ff5959]' : 'bg-[#222] border-[#ff5959]'}`}
              >
                Reject Order
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
