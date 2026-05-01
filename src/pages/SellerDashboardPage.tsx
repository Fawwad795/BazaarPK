import { useEffect, useMemo, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { fetchProductsFromFirestore, fetchSellerDashboardStats, fetchSellerOrders } from '../services/firestoreService';
import { formatPrice, formatDate } from '../utils/helpers';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { DashboardStats, Order, Product } from '../types';
import { useThemeStore } from '../store/themeStore';

export default function SellerDashboardPage() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [activePeriod, setActivePeriod] = useState('30D');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [sellerOrders, setSellerOrders] = useState<Order[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const sellerId = user?.id || 'seller-1';

  useEffect(() => {
    fetchSellerDashboardStats(sellerId).then(setDashboardStats).catch(console.error);
    fetchProductsFromFirestore()
      .then((list) => setSellerProducts(list.filter((product) => product.seller.id === sellerId)))
      .catch(console.error);
    fetchSellerOrders(sellerId).then(setSellerOrders).catch(console.error);
  }, [sellerId]);

  const activeSidebar = useMemo(() => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/products') return 'Inventory';
    if (location.pathname.startsWith('/dashboard/orders')) return 'Orders';
    if (location.pathname === '/dashboard/analytics') return 'Analytics';
    if (location.pathname === '/dashboard/payments' || location.pathname === '/checkout') return 'Payments';
    if (location.pathname === '/chat') return 'Support';
    return 'Dashboard';
  }, [location.pathname]);

  const effectiveStats = useMemo(
    () =>
      dashboardStats || {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: sellerProducts.length,
        averageRating: 0,
        revenueChange: 0,
        ordersChange: 0,
        monthlyRevenue: [],
      },
    [dashboardStats, sellerProducts.length]
  );

  const statCards = [
    {
      label: 'Revenue (30d)',
      value: formatPrice(effectiveStats.totalRevenue),
      change: `+${Math.abs(effectiveStats.revenueChange || 12.4)}%`,
    },
    {
      label: 'Orders',
      value: effectiveStats.totalOrders.toLocaleString(),
      change: `+${Math.abs(effectiveStats.ordersChange || 8.2)}%`,
    },
    {
      label: 'Conversion',
      value: '3.6%',
      change: '+0.4%',
    },
    {
      label: 'Avg. Rating',
      value: effectiveStats.averageRating.toFixed(1),
      change: '+0.1',
    },
  ];

  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const topBarBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const cardBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const surfaceBg = isLight ? 'bg-[#f3f5f8] border-[#d9dde5]' : 'bg-[#131313] border-[#2a2a2a]';
  const titleColor = isLight ? 'text-[#111827]' : 'text-white';
  const subColor = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const softLine = isLight ? 'border-[#e4e7ec]' : 'border-[#2a2a2a]';
  const trendColor = isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]';
  const avatarText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';
  const inventoryAlertBg = isLight ? 'bg-[#fff7d6] text-[#111827]' : 'bg-[#3d330d] text-white';
  const inventoryAlertBtn = isLight ? 'bg-[#ffd133] text-[#f7f8fa]' : 'bg-[#ffd133] text-[#0d0d0d]';

  const periodTabs = ['7D', '30D', '90D', '1Y'];
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
  const stockAlerts = [
    { name: 'Handwoven Rug 3x5', count: '8 left', state: 'low' as const },
    { name: 'Brass Diya Set', count: '5 left', state: 'low' as const },
    { name: 'Wireless Earbuds', count: '0', state: 'out' as const },
    { name: 'Truck Art Mug', count: '3 left', state: 'low' as const },
  ];
  const buyerSources = [
    { city: 'Karachi', pct: 42, color: isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]' },
    { city: 'Lahore', pct: 28, color: isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]' },
    { city: 'Islamabad', pct: 18, color: 'bg-[#ffd133]' },
    { city: 'Other', pct: 12, color: isLight ? 'bg-[#9ca3af]' : 'bg-[#444]' },
  ];
  const topProducts = sellerProducts.slice(0, 3).map((p, index) => ({
    rank: `#${index + 1}`,
    name: p.title,
    sold: `${p.reviewCount || 12} sold`,
  }));
  const chartBars = effectiveStats.monthlyRevenue.length
    ? effectiveStats.monthlyRevenue.map((m) => m.revenue)
    : [29, 39, 26, 48, 34, 57, 45, 52, 60, 68, 52, 76, 64, 72, 59, 68, 81, 74, 83, 92, 79, 85, 94, 100, 91, 104, 94, 103, 111, 120];
  const maxBar = Math.max(...chartBars, 1);

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <header className={`border ${topBarBg}`}>
        <div className="flex h-[64px] w-full items-center px-4 sm:px-6 lg:px-8">
          <p className={`text-[20px] font-bold ${accent}`}>BazaarPK</p>
          <p className={`ml-6 text-[14px] font-medium ${titleColor}`}>Seller Dashboard</p>
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
              const baseClass = `relative h-10 rounded-lg px-4 text-left text-[13px] font-medium leading-10 transition ${
                active
                  ? `${isLight ? 'bg-[#eef0f4] text-[#111827]' : 'bg-[#222] text-white'}`
                  : `${subColor} hover:${isLight ? 'bg-[#eef0f4]' : 'bg-[#222]'}`
              }`;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => void item.action()}
                  className={baseClass}
                >
                  {active && <span className={`absolute left-0 top-2 h-6 w-[3px] rounded-sm ${isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]'}`} />}
                  {item.label}
                </button>
              );
            })}
          </div>
          <Link
            to="/products/new"
            className={`mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg text-[13px] font-semibold lg:mt-auto ${isLight ? 'bg-[#00b851] text-[#f7f8fa]' : 'bg-[#00ff7a] text-[#0d0d0d]'}`}
          >
            + Add New Product
          </Link>
        </aside>

        <main className="w-full px-4 py-8 sm:px-6 lg:flex-1 lg:px-8">
          <h1 className={`text-3xl font-bold leading-none lg:text-[38px] ${titleColor}`}>Assalamualaikum, {user?.name?.split(' ')[0] || 'Ahmed'}</h1>
          <p className={`mt-2 text-[13px] ${subColor}`}>Here is what is happening at The Atelier today</p>

          <div className={`mt-4 ml-auto flex h-9 w-[208px] items-center rounded-lg border ${surfaceBg}`}>
            {periodTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActivePeriod(tab)}
                className={`h-9 w-[52px] rounded-md text-xs font-semibold ${
                  tab === activePeriod
                    ? `${isLight ? 'bg-[#00b851] text-[#f7f8fa]' : 'bg-[#00ff7a] text-[#0d0d0d]'}`
                    : `${subColor}`
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => (
              <div key={stat.label} className={`rounded-xl border p-[18px] ${cardBg}`}>
                <p className={`text-[11px] font-medium ${subColor}`}>{stat.label}</p>
                <p className={`mt-2 text-[28px] font-bold leading-none ${titleColor}`}>{stat.value}</p>
                <p className={`mt-3 text-[11px] font-semibold ${stat.label === 'Avg. Rating' ? 'text-[#ffd133]' : accent}`}>{stat.change}</p>
              </div>
            ))}
          </div>

          <div className={`mt-4 flex flex-col gap-3 rounded-[10px] border px-5 py-3 sm:flex-row sm:items-center ${isLight ? 'bg-[#fff7d6] border-[#ffd133]' : 'bg-[#3d330d] border-[#ffd133]'}`}>
            <p className={`text-[13px] font-semibold ${inventoryAlertBg} sm:flex-1`}>
              Inventory Alert  -  12 products are low stock  -  4 are out of stock. Restock to avoid lost sales.
            </p>
            <Link to="/products" className={`inline-flex h-8 w-[120px] items-center justify-center rounded-md text-[11px] font-bold ${inventoryAlertBtn}`}>
              View Inventory
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
            <div className={`rounded-xl border p-6 ${cardBg}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-[30px] font-semibold ${titleColor}`}>Revenue Trend</p>
                  <p className={`text-xs ${subColor}`}>Last 30 days</p>
                </div>
                <p className={`text-[22px] font-bold ${accent}`}>{formatPrice(effectiveStats.totalRevenue || 432500)}</p>
              </div>
              <div className={`mt-5 h-56 border-b ${softLine}`}>
                <div className="flex h-full items-end gap-1 sm:gap-[6px]">
                  {chartBars.map((bar, index) => (
                    <div
                      key={index}
                      className={`min-w-0 flex-1 rounded-t-[4px] ${trendColor}`}
                      style={{ height: `${(bar / maxBar) * 120}px` }}
                    />
                  ))}
                </div>
              </div>
              <div className={`mt-2 flex justify-between px-1 text-[10px] ${isLight ? 'text-[#9ca3af]' : 'text-[#444]'}`}>
                {['Apr 1', 'Apr 8', 'Apr 15', 'Apr 22', 'Apr 29'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${cardBg}`}>
              <div className="mb-3 flex items-center justify-between">
                <p className={`text-[17px] font-semibold ${titleColor}`}>Stock Alerts</p>
                <span className="inline-flex h-[22px] w-[60px] items-center justify-center rounded bg-[#ff5959] text-[9px] font-bold text-white">
                  16 ITEMS
                </span>
              </div>
              <div className="space-y-[10px]">
                {stockAlerts.map((item) => (
                  <div key={item.name} className={`rounded-lg border p-3 ${surfaceBg}`}>
                    <div className="flex items-start gap-2">
                      <span className={`mt-1 h-2 w-2 rounded ${item.state === 'out' ? 'bg-[#ff5959]' : 'bg-[#ffd133]'}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-xs font-semibold ${titleColor}`}>{item.name}</p>
                        <p className={`text-[11px] ${subColor}`}>{item.count}</p>
                      </div>
                      <span
                        className={`inline-flex h-[18px] w-12 items-center justify-center rounded border text-[9px] font-bold ${
                          item.state === 'out'
                            ? 'border-[#ff5959] text-[#ff5959]'
                            : 'border-[#ffd133] text-[#ffd133]'
                        }`}
                      >
                        {item.state === 'out' ? 'OUT' : 'LOW'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-6">
            <p className={`text-[17px] font-semibold ${titleColor}`}>Recent Orders</p>
            <Link to="/dashboard/orders" className={`text-xs font-semibold ${accent}`}>
              View all  →
            </Link>
          </div>

          <div className={`mt-3 hidden rounded-lg px-4 py-4 text-[10px] font-bold md:block ${isLight ? 'bg-[#eef0f4] text-[#6b7280]' : 'bg-[#222] text-[#9a9a9a]'}`}>
            <div className="grid grid-cols-[128px_176px_180px_120px_120px_108px_92px]">
              {['ORDER ID', 'CUSTOMER', 'ITEMS', 'AMOUNT', 'DATE', 'STATUS', ''].map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
          </div>

          <div className="mt-2 space-y-1.5">
            {sellerOrders.slice(0, 6).map((order) => (
              <Link
                to="/dashboard/orders"
                key={order.id}
                className={`block rounded-lg border px-4 py-3 ${cardBg}`}
              >
                <div className="grid md:grid-cols-[128px_176px_180px_120px_120px_108px_92px] md:items-center">
                  <span className={`text-xs font-semibold ${titleColor}`}>#{order.id.replace(/[^A-Z0-9]/gi, '').slice(-8).toUpperCase()}</span>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]'} ${avatarText} text-[11px] font-bold`}>
                      {(order.buyerId || 'U')[0]?.toUpperCase()}
                    </span>
                    <span className={`truncate text-xs ${titleColor}`}>{order.buyerId || 'Customer'}</span>
                  </div>
                  <span className={`truncate text-[11px] ${subColor}`}>
                    {order.items?.length ? `${order.items.length} item(s)` : 'Product item'}
                  </span>
                  <span className={`text-xs font-semibold ${accent}`}>{formatPrice(order.totalAmount)}</span>
                  <span className={`text-[11px] ${subColor}`}>{formatDate(order.createdAt)}</span>
                  <OrderStatusBadge status={order.status} />
                  <span className={`hidden pl-8 text-sm font-bold md:block ${subColor}`}>...</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 2xl:grid-cols-2">
            <div className={`rounded-xl border p-4 ${cardBg}`}>
              <p className={`text-[15px] font-semibold ${titleColor}`}>Top Products this Week</p>
              <div className="mt-3 space-y-2">
                {(topProducts.length ? topProducts : [
                  { rank: '#1', name: 'Embroidered Kurta', sold: '42 sold' },
                  { rank: '#2', name: 'Handwoven Rug', sold: '18 sold' },
                  { rank: '#3', name: 'Silver Jhumka', sold: '26 sold' },
                ]).map((p) => (
                  <Link to="/products" key={p.rank} className={`grid h-10 grid-cols-[26px_1fr_auto] items-center rounded-lg border px-3 ${surfaceBg}`}>
                    <span className={`text-xs font-bold ${accent}`}>{p.rank}</span>
                    <span className={`text-xs font-semibold ${titleColor}`}>{p.name}</span>
                    <span className={`text-[11px] ${subColor}`}>{p.sold}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${cardBg}`}>
              <p className={`text-[15px] font-semibold ${titleColor}`}>Where Buyers Come From</p>
              <div className="mt-4 space-y-3">
                {buyerSources.map((source) => (
                  <div key={source.city} className="grid grid-cols-[62px_1fr_34px] items-center gap-4">
                    <span className={`text-[11px] ${titleColor}`}>{source.city}</span>
                    <div className={`h-[18px] rounded-md ${isLight ? 'bg-[#eef0f4]' : 'bg-[#222]'}`}>
                      <div
                        className={`h-[18px] rounded-md ${source.color}`}
                        style={{ width: `${source.pct}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-semibold ${subColor}`}>{source.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    delivered: 'border-[#6b7280] text-[#6b7280]',
    shipped: 'border-[#4d99ff] text-[#4d99ff]',
    processing: 'border-[#00b851] text-[#00b851] dark:border-[#00ff7a] dark:text-[#00ff7a]',
    pending: 'border-[#ffd133] text-[#ffd133]',
    cancelled: 'border-[#ff5959] text-[#ff5959]',
    confirmed: 'border-[#00b851] text-[#00b851] dark:border-[#00ff7a] dark:text-[#00ff7a]',
    disputed: 'border-[#ff5959] text-[#ff5959]',
  };

  return (
    <span
      className={`inline-flex h-[22px] min-w-[108px] items-center justify-center rounded border px-2 text-[9px] font-bold uppercase ${
        styles[status] ?? styles.pending
      }`}
    >
      {status}
    </span>
  );
}
