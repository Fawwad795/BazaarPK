import { useEffect, useMemo, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchDisputes, fetchProductsFromFirestore } from '../services/firestoreService';
import type { Dispute, Product } from '../types';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

type AdminNav =
  | 'Dashboard'
  | 'Seller Verification'
  | 'Disputes'
  | 'Users'
  | 'Analytics'
  | 'Transactions'
  | 'Settings'
  | 'Log Out';

export default function AdminPanelPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeNav, setActiveNav] = useState<AdminNav>('Dashboard');

  useEffect(() => {
    fetchDisputes().then(setDisputes).catch(console.error);
    fetchProductsFromFirestore().then(setProducts).catch(console.error);
  }, []);

  const navItems: AdminNav[] = [
    'Dashboard',
    'Seller Verification',
    'Disputes',
    'Users',
    'Analytics',
    'Transactions',
    'Settings',
    'Log Out',
  ];

  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const topBarBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const cardBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const softBg = isLight ? 'bg-[#f3f5f8] border-[#d9dde5]' : 'bg-[#131313] border-[#2a2a2a]';
  const mutedPanel = isLight ? 'bg-[#eef0f4] border-[#d9dde5]' : 'bg-[#222] border-[#2a2a2a]';
  const titleColor = isLight ? 'text-[#111827]' : 'text-white';
  const subColor = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const accentBg = isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]';
  const accentText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';

  const openDisputes = useMemo(
    () =>
      disputes
        .filter((dispute) => dispute.status !== 'resolved' && dispute.status !== 'closed')
        .slice(0, 3),
    [disputes]
  );

  const liveActivity = useMemo(() => {
    const base = openDisputes.slice(0, 2).map((dispute, index) => ({
      title: index === 0 ? 'Dispute Opened' : 'Order Placed',
      description:
        index === 0
          ? `${dispute.id} - ${dispute.reason}`
          : `${dispute.orderId || dispute.id} - Rs. 1,800`,
      time: index === 0 ? '12 min ago' : '2 min ago',
      dot: index === 0 ? 'bg-[#ff5959]' : isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]',
    }));

    return [
      ...base,
      {
        title: 'New Seller',
        description: 'Karachi Tech Shop applied',
        time: '5 min ago',
        dot: 'bg-[#9966ff]',
      },
      {
        title: 'Payout',
        description: 'TCS courier - Rs. 12,000',
        time: '18 min ago',
        dot: 'bg-[#4d99ff]',
      },
      {
        title: 'Verified',
        description: 'Lahore Fashion Co.',
        time: '32 min ago',
        dot: isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]',
      },
    ].slice(0, 5);
  }, [openDisputes, isLight]);

  const gmvBars = [79, 126, 166, 199, 119, 119, 98, 177, 190, 159, 84, 120];

  const handleNavClick = async (item: AdminNav) => {
    setActiveNav(item);
    if (item === 'Disputes') {
      navigate('/admin/disputes');
      return;
    }
    if (item === 'Analytics') {
      navigate('/admin/analytics');
      return;
    }
    if (item === 'Seller Verification') {
      navigate('/admin/seller-verification');
      return;
    }
    if (item === 'Log Out') {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <header className={`border ${topBarBg}`}>
        <div className="flex h-[64px] w-full items-center px-[31px]">
          <p className={`text-[20px] font-bold ${accent}`}>BazaarPK Admin</p>
          <p className={`ml-6 text-[14px] font-medium ${titleColor}`}>Dashboard</p>
          <div className="ml-auto flex items-center gap-2.5">
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
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${accentBg} text-[15px] font-bold ${accentText}`}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </div>
      </header>

      <div className="flex w-full flex-col lg:flex-row">
        <aside className={`w-full border-b px-[15px] py-[23px] lg:flex lg:min-h-[calc(100vh-64px)] lg:w-[240px] lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r ${topBarBg}`}>
          <div className={`mb-6 rounded-xl border p-4 ${mutedPanel}`}>
            <p className={`text-[10px] font-medium ${isLight ? 'text-[#9ca3af]' : 'text-[#444]'}`}>ADMIN</p>
            <p className={`mt-1 text-[14px] font-semibold ${titleColor}`}>Platform Admin</p>
            <p className={`mt-1 text-[11px] ${accent}`}>Super Admin</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {navItems.map((item) => {
              const isActive = activeNav === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => void handleNavClick(item)}
                  className={`relative h-10 rounded-lg px-4 text-left text-[13px] font-medium leading-10 ${
                    isActive
                      ? `${isLight ? 'bg-[#eef0f4] text-[#111827]' : 'bg-[#222] text-white'}`
                      : `${subColor}`
                  }`}
                >
                  {isActive && <span className={`absolute left-0 top-2 h-6 w-[3px] rounded-sm ${accentBg}`} />}
                  {item}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="w-full px-4 py-8 lg:flex-1 lg:px-8">
          <div className="mx-auto w-full max-w-[1040px]">
            <h1 className={`text-[26px] font-bold leading-none ${titleColor}`}>Platform Overview</h1>
            <p className={`mt-[8px] text-[13px] ${subColor}`}>Welcome back, Admin. Here is what is happening today.</p>

            <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'GMV (Month)', value: 'Rs. 12.4M', delta: '+18.2%' },
                { label: 'Active Users', value: '24,891', delta: '+5.4%' },
                { label: 'Verified Sellers', value: `${Math.max(512, products.length)}`, delta: '+32 new' },
                { label: 'Platform Fees', value: 'Rs. 748K', delta: '+14.1%' },
              ].map((stat) => (
                <div key={stat.label} className={`h-[112px] rounded-xl border px-[19px] py-[17px] ${cardBg}`}>
                  <p className={`text-[11px] font-medium ${subColor}`}>{stat.label}</p>
                  <p className={`mt-1 text-[24px] font-bold leading-none ${titleColor}`}>{stat.value}</p>
                  <p className={`mt-2 text-[11px] font-semibold ${accent}`}>{stat.delta}</p>
                </div>
              ))}
            </section>

            <section
              className={`mt-4 flex h-[56px] items-center gap-3 rounded-[10px] border px-[19px] ${
                isLight ? 'border-[#ff5959] bg-[#fde0e0]' : 'border-[#ff5959] bg-[#3d0d0d]'
              }`}
            >
              <span className="text-[18px] font-bold text-[#ff5959]">!</span>
              <p className={`text-[13px] font-semibold ${titleColor}`}>
                ATTENTION - {Math.max(12, openDisputes.length)} open disputes need review - 5 seller applications pending &gt; 48h
              </p>
            <button
              type="button"
              onClick={() => navigate('/admin/disputes')}
              className={`ml-auto h-8 w-[120px] rounded-[6px] bg-[#ff5959] text-[12px] font-semibold ${isLight ? 'text-[#111827]' : 'text-white'}`}
            >
                Review Now
              </button>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[672px_292px]">
              <article className={`h-[320px] rounded-xl border px-[23px] py-[23px] ${cardBg}`}>
                <p className={`text-[17px] font-semibold leading-none ${titleColor}`}>Gross Merchandise Value</p>
                <p className={`mt-1 text-[12px] ${subColor}`}>Last 12 months</p>
                <div className="mt-[38px] flex h-[200px] items-end gap-[18px] border-b pb-0 pr-2" style={{ borderColor: isLight ? '#d9dde5' : '#2a2a2a' }}>
                  {gmvBars.map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className={`w-9 rounded-[6px] ${index < 6 ? (isLight ? 'bg-[#9ca3af]' : 'bg-[#444]') : accentBg}`}
                      style={{ height }}
                    />
                  ))}
                </div>
              </article>

              <article className={`h-[320px] rounded-xl border px-[15px] py-[23px] ${cardBg}`}>
                <div className="flex items-center">
                  <p className={`text-[17px] font-semibold leading-none ${titleColor}`}>Live Activity</p>
                  <span className={`ml-auto h-2 w-2 rounded ${accentBg}`} />
                  <span className={`ml-2 text-[10px] font-bold ${accent}`}>LIVE</span>
                </div>
                <div className="mt-5 space-y-[6px]">
                  {liveActivity.map((item) => (
                    <div key={`${item.title}-${item.time}`} className={`flex h-[44px] items-start rounded-lg border px-3 py-[7px] ${softBg}`}>
                      <span className={`mt-[10px] h-1.5 w-1.5 rounded ${item.dot}`} />
                      <div className="ml-2.5 min-w-0">
                        <p className={`text-[11px] font-semibold ${titleColor}`}>{item.title}</p>
                        <p className={`truncate text-[10px] ${subColor}`}>{item.description}</p>
                      </div>
                      <span className={`ml-auto pt-[9px] pl-2 text-[10px] ${isLight ? 'text-[#9ca3af]' : 'text-[#444]'}`}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[504px_460px]">
              <article className={`h-[240px] rounded-xl border px-[23px] py-[23px] ${cardBg}`}>
                <div className="flex items-center">
                  <p className={`text-[17px] font-semibold leading-none ${titleColor}`}>Seller Verification Queue</p>
                  <span className="ml-3 inline-flex h-6 items-center rounded-[4px] bg-[#ffd133] px-4 text-[10px] font-bold text-[#f7f8fa] dark:text-[#0d0d0d]">
                    5 NEW
                  </span>
                </div>
                <div className="mt-[14px] space-y-2">
                  {[
                    ['Z', 'Zainab Crafts', 'Faisalabad - Handicrafts'],
                    ['K', 'Karachi Tech Shop', 'Karachi - Electronics'],
                    ['P', 'Peshawar Fabrics', 'Peshawar - Clothing'],
                  ].map(([initial, name, subtitle]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => navigate('/admin/seller-verification')}
                      className={`flex h-[44px] w-full items-center rounded-lg border px-[7px] py-[5px] text-left ${softBg}`}
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#9966ff] text-[13px] font-bold text-[#f7f8fa]">
                        {initial}
                      </span>
                      <span className="ml-2.5">
                        <span className={`block text-[12px] font-semibold ${titleColor}`}>{name}</span>
                        <span className={`block text-[11px] ${subColor}`}>{subtitle}</span>
                      </span>
                      <span className={`ml-auto text-[11px] font-semibold ${accent}`}>Review →</span>
                    </button>
                  ))}
                </div>
              </article>

              <article className={`h-[240px] rounded-xl border px-[23px] py-[23px] ${cardBg}`}>
                <div className="flex items-center">
                  <p className={`text-[17px] font-semibold leading-none ${titleColor}`}>Open Disputes</p>
                  <span className={`ml-3 inline-flex h-6 items-center rounded-[4px] px-4 text-[10px] font-bold ${isLight ? 'bg-[#ff5959] text-[#111827]' : 'bg-[#ff5959] text-white'}`}>
                    {Math.max(12, openDisputes.length)} OPEN
                  </span>
                </div>
                <div className="mt-[14px] space-y-2">
                  {openDisputes.map((dispute, index) => {
                    const highPriority = index !== 1;
                    return (
                    <button
                      key={dispute.id}
                      type="button"
                      onClick={() => navigate('/admin/disputes')}
                      className={`flex h-[44px] w-full items-center rounded-lg border px-[13px] py-[7px] text-left ${softBg}`}
                    >
                        <span className="min-w-0 flex-1 pr-3">
                          <span className={`block text-[12px] font-semibold ${titleColor}`}>{dispute.id}</span>
                          <span className={`block truncate text-[11px] ${subColor}`}>
                            {dispute.reason} - Buyer: {dispute.buyerName}
                          </span>
                        </span>
                        <span className="ml-auto inline-flex shrink-0 items-center gap-3">
                          <span
                            className={`inline-flex h-5 min-w-[52px] items-center justify-center rounded border px-2 text-[9px] font-bold ${
                              highPriority ? 'border-[#ff5959] text-[#ff5959]' : 'border-[#ffd133] text-[#ffd133]'
                            }`}
                          >
                            {highPriority ? 'HIGH' : 'MED'}
                          </span>
                          <span className={`text-[11px] font-semibold ${accent}`}>Rule →</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </article>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
