import { useEffect, useMemo, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { fetchProductsFromFirestore, fetchSellerDashboardStats } from '../services/firestoreService';
import { formatPrice } from '../utils/helpers';
import type { DashboardStats, Product } from '../types';

type Period = '7D' | '30D' | '90D' | '1Y';

export default function SellerAnalyticsPage() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [activePeriod, setActivePeriod] = useState<Period>('30D');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const sellerId = user?.id || 'seller-1';

  useEffect(() => {
    fetchSellerDashboardStats(sellerId).then(setStats).catch(console.error);
    fetchProductsFromFirestore().then(setProducts).catch(console.error);
  }, [sellerId]);

  const sellerProducts = useMemo(
    () => products.filter((product) => product.seller.id === sellerId),
    [products, sellerId]
  );

  const revenueBars = [128, 110, 138, 139, 129, 150, 47, 83, 66, 89, 66, 109, 45, 47];
  const trafficSources = [
    { label: 'Organic Search', pct: 42, color: isDarkMode ? 'bg-[#00ff7a]' : 'bg-[#00b851]' },
    { label: 'Direct', pct: 28, color: 'bg-[#ffd133]' },
    { label: 'Social', pct: 18, color: 'bg-[#4d99ff]' },
    { label: 'Referral', pct: 12, color: isDarkMode ? 'bg-[#444]' : 'bg-[#9ca3af]' },
  ];
  const topProducts = (sellerProducts.length ? sellerProducts : products.slice(0, 4))
    .slice(0, 4)
    .map((product, index) => ({
      rank: `#${index + 1}`,
      name: product.title,
      sold: Math.max(product.reviewCount, 12 + index * 6),
      revenue: formatPrice(Math.round(product.price * Math.max(product.reviewCount, 12 + index * 6))),
    }));

  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const topBarBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const cardBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const surfaceBg = isLight ? 'bg-[#f3f5f8] border-[#d9dde5]' : 'bg-[#131313] border-[#2a2a2a]';
  const titleColor = isLight ? 'text-[#111827]' : 'text-white';
  const subColor = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const faintText = isLight ? 'text-[#9ca3af]' : 'text-[#444]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const accentBg = isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]';
  const avatarText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';

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

  const activeSidebar = useMemo(() => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/products') return 'Inventory';
    if (location.pathname.startsWith('/dashboard/orders')) return 'Orders';
    if (location.pathname === '/dashboard/analytics') return 'Analytics';
    if (location.pathname === '/dashboard/payments' || location.pathname === '/checkout') return 'Payments';
    if (location.pathname === '/chat') return 'Support';
    return 'Analytics';
  }, [location.pathname]);

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <header className={`border ${topBarBg}`}>
        <div className="flex h-[64px] w-full items-center px-4 sm:px-6 lg:px-8">
          <p className={`text-[20px] font-bold ${accent}`}>BazaarPK</p>
          <p className={`ml-6 text-[14px] font-medium ${titleColor}`}>Analytics</p>
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
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${accentBg} ${avatarText} text-sm font-bold`}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </div>
      </header>

      <div className="flex w-full flex-col lg:flex-row">
        <aside className={`w-full border-b px-[15px] py-6 lg:flex lg:min-h-[calc(100vh-64px)] lg:w-52 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r ${topBarBg}`}>
          <div className={`mb-6 rounded-xl border p-4 ${surfaceBg}`}>
            <p className={`text-[10px] font-medium ${faintText}`}>STORE</p>
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
                  {active && <span className={`absolute left-0 top-2 h-6 w-[3px] rounded-sm ${accentBg}`} />}
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="w-full px-4 py-8 sm:px-6 lg:flex-1 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className={`text-3xl font-bold leading-none lg:text-[38px] ${titleColor}`}>Analytics</h1>
              <p className={`mt-2 text-[13px] ${subColor}`}>Performance insights for your store</p>
            </div>
            <div className={`flex h-9 items-center rounded-lg border px-1 ${surfaceBg}`}>
              {(['7D', '30D', '90D', '1Y'] as Period[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setActivePeriod(period)}
                  className={`h-8 w-16 rounded-md text-xs font-semibold ${
                    period === activePeriod
                      ? `${isLight ? 'bg-[#00b851] text-[#f7f8fa]' : 'bg-[#00ff7a] text-[#0d0d0d]'}`
                      : `${subColor}`
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Revenue" value={formatPrice(stats?.totalRevenue || 432500)} trend="+12.4%" positive cardBg={cardBg} titleColor={titleColor} subColor={subColor} accent={accent} />
            <MetricCard label="Orders" value={(stats?.totalOrders || 147).toString()} trend="+8.2%" positive cardBg={cardBg} titleColor={titleColor} subColor={subColor} accent={accent} />
            <MetricCard label="Avg Order Value" value={formatPrice(Math.round((stats?.totalRevenue || 432500) / Math.max(stats?.totalOrders || 147, 1)))} trend="-1.8%" positive={false} cardBg={cardBg} titleColor={titleColor} subColor={subColor} accent={accent} />
            <MetricCard label="Conversion Rate" value="3.6%" trend="+0.4%" positive cardBg={cardBg} titleColor={titleColor} subColor={subColor} accent={accent} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_296px]">
            <section className={`rounded-xl border p-5 ${cardBg}`}>
              <p className={`text-[30px] font-semibold leading-none ${titleColor}`}>Revenue Trend</p>
              <p className={`mt-1 text-xs ${subColor}`}>Last 30 days</p>
              <div className={`mt-4 h-[180px] border-b ${isLight ? 'border-[#d9dde5]' : 'border-[#2a2a2a]'}`}>
                <div className="flex h-full items-end gap-1">
                  {revenueBars.map((bar, index) => (
                    <div key={index} className={`w-full rounded-t-[6px] ${accentBg}`} style={{ height: `${bar}px` }} />
                  ))}
                </div>
              </div>
              <div className={`mt-3 flex justify-around text-[11px] ${faintText}`}>
                {['W1', 'W2', 'W3', 'W4'].map((wk) => (
                  <span key={wk}>{wk}</span>
                ))}
              </div>
            </section>

            <section className={`rounded-xl border p-4 ${cardBg}`}>
              <p className={`text-[17px] font-semibold ${titleColor}`}>Top Products</p>
              <div className="mt-3 space-y-2">
                {topProducts.map((product) => (
                  <div key={product.rank} className={`grid grid-cols-[26px_1fr_auto] items-center rounded-lg border px-3 py-2 ${surfaceBg}`}>
                    <span className={`text-xs font-bold ${accent}`}>{product.rank}</span>
                    <div>
                      <p className={`text-xs font-semibold ${titleColor}`}>{product.name}</p>
                      <p className={`text-[11px] ${subColor}`}>{product.sold} sold</p>
                    </div>
                    <span className={`text-[11px] font-semibold ${accent}`}>{product.revenue}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <section className={`rounded-xl border p-5 ${cardBg}`}>
              <p className={`text-[17px] font-semibold ${titleColor}`}>Traffic Sources</p>
              <div className="mt-4 flex h-6 overflow-hidden rounded">
                {trafficSources.map((source) => (
                  <div key={source.label} className={source.color} style={{ width: `${source.pct}%` }} />
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {trafficSources.map((source) => (
                  <div key={source.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${source.color}`} />
                      <span className={titleColor}>{source.label}</span>
                    </div>
                    <span className={`font-semibold ${subColor}`}>{source.pct}%</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={`rounded-xl border p-5 ${cardBg}`}>
              <p className={`text-[17px] font-semibold ${titleColor}`}>Conversion Funnel</p>
              <div className="mt-4 space-y-3">
                <FunnelRow width="100%" color={accentBg} label="Visitors" value="4,280  -  100%" dark={isDarkMode} />
                <FunnelRow width="45%" color={accentBg} label="Product Views" value="1,920  -  45%" dark={isDarkMode} />
                <FunnelRow width="13%" color="bg-[#ffd133]" label="Added to Cart" value="540  -  13%" dark={isDarkMode} />
                <FunnelRow width="4%" color="bg-[#4d99ff]" label="Purchased" value="154  -  4%" dark={isDarkMode} />
              </div>
            </section>
          </div>

          <section className={`mt-4 rounded-xl border p-5 ${cardBg}`}>
            <p className={`text-[17px] font-semibold ${titleColor}`}>Customer Insights</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <InsightCard label="Repeat Customers" value="34%" boxBg={surfaceBg} subColor={subColor} accent={accent} />
              <InsightCard label="New Customers" value="66%" boxBg={surfaceBg} subColor={subColor} accent={accent} />
              <InsightCard label="Top City" value="Karachi - 28%" boxBg={surfaceBg} subColor={subColor} accent={accent} />
              <InsightCard label="Avg. Rating" value="4.8 stars" boxBg={surfaceBg} subColor={subColor} accent={accent} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  trend,
  positive,
  cardBg,
  titleColor,
  subColor,
  accent,
}: {
  label: string;
  value: string;
  trend: string;
  positive: boolean;
  cardBg: string;
  titleColor: string;
  subColor: string;
  accent: string;
}) {
  return (
    <div className={`rounded-xl border p-[18px] ${cardBg}`}>
      <p className={`text-[11px] font-medium ${subColor}`}>{label}</p>
      <p className={`mt-2 text-[34px] font-bold leading-none ${titleColor}`}>{value}</p>
      <p className={`mt-3 text-[11px] font-semibold ${positive ? accent : 'text-[#ff5959]'}`}>
        {trend}
        <span className={`font-normal ${subColor}`}> vs last period</span>
      </p>
    </div>
  );
}

function FunnelRow({
  width,
  color,
  label,
  value,
  dark,
}: {
  width: string;
  color: string;
  label: string;
  value: string;
  dark: boolean;
}) {
  const numericWidth = Number.parseFloat(width);
  const compactRow = Number.isFinite(numericWidth) && numericWidth < 20;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-7 min-w-[16px] items-center rounded px-2 ${color}`}
        style={{ width }}
      >
        {!compactRow && (
          <span className={`whitespace-nowrap text-xs font-semibold ${dark ? 'text-[#0d0d0d]' : 'text-[#111827]'}`}>
            {label}
          </span>
        )}
      </div>
      <span className={`whitespace-nowrap text-xs font-bold ${dark ? 'text-white' : 'text-[#111827]'}`}>
        {compactRow ? `${value} ${label}` : value}
      </span>
    </div>
  );
}

function InsightCard({
  label,
  value,
  boxBg,
  subColor,
  accent,
}: {
  label: string;
  value: string;
  boxBg: string;
  subColor: string;
  accent: string;
}) {
  return (
    <div className={`rounded-lg border p-4 ${boxBg}`}>
      <p className={`text-[11px] font-medium ${subColor}`}>{label}</p>
      <p className={`mt-2 text-[20px] font-bold leading-tight ${accent}`}>{value}</p>
    </div>
  );
}
