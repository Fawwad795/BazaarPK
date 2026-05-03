import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import type { Order, OrderStatus } from '../types';
import { formatDate, formatPrice } from '../utils/helpers';
import { fetchSellerOrders } from '../services/firestoreService';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

type OrdersTab = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered';

const tabStatuses: Record<OrdersTab, OrderStatus[] | null> = {
  all: null,
  pending: ['pending', 'confirmed'],
  processing: ['processing'],
  shipped: ['shipped'],
  delivered: ['delivered'],
};

export default function SellerOrdersPage() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<OrdersTab>('pending');
  const navigate = useNavigate();
  const location = useLocation();
  const sellerId = user?.id || 'seller-1';

  useEffect(() => {
    fetchSellerOrders(sellerId).then(setOrders).catch(console.error);
  }, [sellerId]);

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
    { label: 'Support', action: () => {}, disabled: true },
    {
      label: 'Log Out',
      action: async () => {
        await logout();
        navigate('/login');
      },
    },
  ];

  const filteredOrders = useMemo(() => {
    const matcher = tabStatuses[activeTab];
    if (!matcher) return orders;
    return orders.filter((order) => matcher.includes(order.status));
  }, [orders, activeTab]);

  const counts = useMemo(
    () => ({
      all: orders.length,
      pending: orders.filter((o) => ['pending', 'confirmed'].includes(o.status)).length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
    }),
    [orders]
  );

  const metrics = useMemo(
    () => ({
      newOrders: counts.pending,
      processing: counts.processing,
      shipped: counts.shipped,
      revenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    }),
    [counts, orders]
  );

  const applyAction = (order: Order) => {
    if (order.status === 'processing') return { label: 'Ship', next: 'shipped' as OrderStatus };
    if (order.status === 'shipped') return { label: 'Track', next: 'shipped' as OrderStatus, details: true };
    if (order.status === 'pending' || order.status === 'confirmed') {
      return { label: 'Accept', next: 'processing' as OrderStatus };
    }
    return { label: 'View', next: order.status, details: true };
  };

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              updatedAt: new Date().toISOString(),
            }
          : order
      )
    );
  };

  const badgeClass = (status: OrderStatus) => {
    if (status === 'processing') return 'border-[#00b851] text-[#00b851] dark:border-[#00ff7a] dark:text-[#00ff7a]';
    if (status === 'shipped') return 'border-[#4d99ff] text-[#4d99ff]';
    if (status === 'delivered') return 'border-[#6b7280] text-[#6b7280] dark:border-[#9a9a9a] dark:text-[#9a9a9a]';
    if (status === 'cancelled') return 'border-[#ff5959] text-[#ff5959]';
    return 'border-[#ffd133] text-[#ffd133]';
  };

  const badgeLabel = (status: OrderStatus) => {
    if (status === 'confirmed') return 'PENDING';
    return status.toUpperCase();
  };

  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const topBarBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const cardBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const surfaceBg = isLight ? 'bg-[#f3f5f8] border-[#d9dde5]' : 'bg-[#131313] border-[#2a2a2a]';
  const titleColor = isLight ? 'text-[#111827]' : 'text-white';
  const subColor = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const avatarText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <header className={`border ${topBarBg}`}>
        <div className="flex h-[64px] w-full items-center px-4 sm:px-6 lg:px-8">
          <p className={`text-[20px] font-bold ${accent}`}>BazaarPK</p>
          <p className={`ml-6 text-[14px] font-medium ${titleColor}`}>Orders</p>
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
          <div className={`mb-6 rounded-xl border p-4 ${surfaceBg}`}>
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
                  disabled={item.disabled}
                  onClick={() => void item.action()}
                  className={`relative h-10 rounded-lg px-4 text-left text-[13px] font-medium leading-10 transition ${
                    item.disabled
                      ? `${isLight ? 'text-[#c5c9d0]' : 'text-[#333]'} cursor-not-allowed`
                      : active
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
          <h1 className={`text-3xl font-bold leading-none lg:text-[38px] ${titleColor}`}>Orders</h1>
          <p className={`mt-2 text-[13px] ${subColor}`}>Manage incoming orders and fulfillment</p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="New Orders" value={metrics.newOrders.toString()} valueClass={accent} cardBg={cardBg} subColor={subColor} />
            <MetricCard label="Processing" value={metrics.processing.toString()} valueClass="text-[#ffd133]" cardBg={cardBg} subColor={subColor} />
            <MetricCard label="Shipped" value={metrics.shipped.toString()} valueClass="text-[#4d99ff]" cardBg={cardBg} subColor={subColor} />
            <MetricCard label="Revenue (Month)" value={formatPrice(metrics.revenue)} valueClass={accent} cardBg={cardBg} subColor={subColor} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {([
              ['all', `All (${counts.all})`],
              ['pending', `Pending (${counts.pending})`],
              ['processing', `Processing (${counts.processing})`],
              ['shipped', `Shipped (${counts.shipped})`],
              ['delivered', `Delivered (${counts.delivered})`],
            ] as [OrdersTab, string][]).map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`h-[34px] rounded-md border px-4 text-xs ${
                  activeTab === tab
                    ? `${isLight ? 'bg-[#eef0f4] border-[#d9dde5] text-[#111827]' : 'bg-[#222] border-[#2a2a2a] text-white'}`
                    : `${isLight ? 'border-[#d9dde5] text-[#6b7280]' : 'border-[#2a2a2a] text-[#9a9a9a]'}`
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto">
            <div className={`hidden min-w-[980px] grid-cols-[120px_160px_180px_120px_120px_140px_120px] rounded-lg px-4 py-4 text-[10px] font-bold md:grid ${isLight ? 'bg-[#eef0f4] text-[#6b7280]' : 'bg-[#222] text-[#9a9a9a]'}`}>
              {['ORDER ID', 'CUSTOMER', 'ITEMS', 'AMOUNT', 'DATE', 'STATUS', 'ACTION'].map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
            <div className="mt-2 min-w-[980px] space-y-2">
              {filteredOrders.map((order) => {
                const action = applyAction(order);
                const customerName = order.shippingAddress.fullName || 'Customer';
                const itemLabel = order.items?.[0]?.product?.title
                  ? `${order.items[0].product.title}${order.items.length > 1 ? ` +${order.items.length - 1}` : ''}`
                  : `${order.items.length} item(s)`;
                return (
                  <div
                    key={order.id}
                    className={`grid cursor-pointer grid-cols-[120px_160px_180px_120px_120px_140px_120px] items-center rounded-lg border px-4 py-3 ${cardBg}`}
                    onClick={() => navigate(`/dashboard/orders/${encodeURIComponent(order.id)}`)}
                  >
                    <span className={`text-[13px] font-semibold ${titleColor}`}>{order.id}</span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]'} ${avatarText} text-[12px] font-bold`}>
                        {customerName[0]?.toUpperCase() || 'U'}
                      </span>
                      <span className={`truncate text-[12px] ${titleColor}`}>{customerName}</span>
                    </div>
                    <span className={`truncate text-[12px] ${subColor}`}>{itemLabel}</span>
                    <span className={`text-[13px] font-semibold ${accent}`}>{formatPrice(order.totalAmount)}</span>
                    <span className={`text-[12px] ${subColor}`}>{formatDate(order.createdAt)}</span>
                    <span className={`inline-flex h-[22px] w-[108px] items-center justify-center rounded border text-[9px] font-bold ${badgeClass(order.status)}`}>
                      {badgeLabel(order.status)}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        if ('details' in action && action.details) {
                          navigate(`/dashboard/orders/${encodeURIComponent(order.id)}`);
                          return;
                        }
                        updateStatus(order.id, action.next);
                      }}
                      className={`h-7 w-[72px] rounded text-[11px] font-semibold ${isLight ? 'bg-[#00b851] text-[#f7f8fa]' : 'bg-[#00ff7a] text-[#0d0d0d]'}`}
                    >
                      {action.label}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  valueClass,
  cardBg,
  subColor,
}: {
  label: string;
  value: string;
  valueClass: string;
  cardBg: string;
  subColor: string;
}) {
  return (
    <div className={`rounded-xl border p-5 ${cardBg}`}>
      <p className={`text-[11px] font-medium ${subColor}`}>{label}</p>
      <p className={`mt-2 text-[34px] font-bold leading-none ${valueClass}`}>{value}</p>
    </div>
  );
}
