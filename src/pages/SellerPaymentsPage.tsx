import { useMemo } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export default function SellerPaymentsPage() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const payoutHistory = [
    { date: 'Apr 22, 2026', method: 'JazzCash', txn: 'TXN-8891-2X', amount: 'Rs. 42,300', status: 'completed' },
    { date: 'Apr 15, 2026', method: 'JazzCash', txn: 'TXN-7821-9K', amount: 'Rs. 38,900', status: 'completed' },
    { date: 'Apr 08, 2026', method: 'Meezan Bank', txn: 'TXN-7112-4F', amount: 'Rs. 51,200', status: 'completed' },
    { date: 'Apr 01, 2026', method: 'JazzCash', txn: 'TXN-6344-7M', amount: 'Rs. 30,000', status: 'completed' },
    { date: 'Mar 25, 2026', method: 'Meezan Bank', txn: 'TXN-5912-2P', amount: 'Rs. 28,700', status: 'pending' },
  ];

  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const topBarBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const cardBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const surfaceBg = isLight ? 'bg-[#f3f5f8] border-[#d9dde5]' : 'bg-[#131313] border-[#2a2a2a]';
  const titleColor = isLight ? 'text-[#111827]' : 'text-white';
  const subColor = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const accentBg = isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]';
  const avatarText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';

  const activeSidebar = useMemo(() => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/products') return 'Inventory';
    if (location.pathname.startsWith('/dashboard/orders')) return 'Orders';
    if (location.pathname === '/dashboard/analytics') return 'Analytics';
    if (location.pathname === '/dashboard/payments' || location.pathname === '/checkout') return 'Payments';
    if (location.pathname === '/chat') return 'Support';
    return 'Payments';
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

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <header className={`border ${topBarBg}`}>
        <div className="flex h-[64px] w-full items-center px-4 sm:px-6 lg:px-8">
          <p className={`text-[20px] font-bold ${accent}`}>BazaarPK</p>
          <p className={`ml-6 text-[14px] font-medium ${titleColor}`}>Payments</p>
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
          <h1 className={`text-3xl font-bold leading-none lg:text-[38px] ${titleColor}`}>Payments</h1>
          <p className={`mt-2 text-[13px] ${subColor}`}>Earnings, payouts and linked accounts</p>

          <section className={`mt-8 rounded-xl border p-5 ${cardBg}`}>
            <p className={`text-[10px] font-bold ${subColor}`}>AVAILABLE BALANCE</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className={`text-[34px] font-bold leading-none ${accent}`}>Rs. 87,240</p>
                <p className={`mt-3 text-xs ${subColor}`}>Next payout: Fri, Apr 26 via JazzCash</p>
              </div>
              <button type="button" className={`h-11 w-40 rounded-lg text-[13px] font-semibold ${isLight ? 'bg-[#00b851] text-[#f7f8fa]' : 'bg-[#00ff7a] text-[#0d0d0d]'}`}>
                Withdraw Now
              </button>
            </div>
          </section>

          <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ['Pending (Escrow)', 'Rs. 23,100'],
              ['Paid (This Month)', 'Rs. 162,400'],
              ['Lifetime Earnings', 'Rs. 1.2M'],
            ].map(([label, value]) => (
              <div key={label} className={`rounded-xl border p-5 ${cardBg}`}>
                <p className={`text-[11px] font-medium ${subColor}`}>{label}</p>
                <p className={`mt-3 text-[28px] font-bold leading-none ${accent}`}>{value}</p>
              </div>
            ))}
          </section>

          <section className={`mt-4 rounded-xl border p-5 ${cardBg}`}>
            <p className={`text-[17px] font-semibold ${titleColor}`}>Linked Payout Methods</p>
            <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
              <div className={`flex items-center justify-between rounded-lg border p-3 ${surfaceBg}`}>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-lg text-lg font-bold ${isLight ? 'bg-[#00b851] text-[#f7f8fa]' : 'bg-[#00ff7a] text-[#0d0d0d]'}`}>J</span>
                  <div>
                    <p className={`text-[14px] font-semibold ${titleColor}`}>JazzCash</p>
                    <p className={`text-xs ${subColor}`}>+92 300 *** 4567</p>
                  </div>
                </div>
                <span className={`inline-flex h-[22px] w-[76px] items-center justify-center rounded border text-[10px] font-bold ${isLight ? 'border-[#00b851] text-[#00b851]' : 'border-[#00ff7a] text-[#00ff7a]'}`}>
                  PRIMARY
                </span>
              </div>
              <div className={`flex items-center justify-between rounded-lg border p-3 ${surfaceBg}`}>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#4d99ff] text-lg font-bold text-[#f7f8fa]">M</span>
                  <div>
                    <p className={`text-[14px] font-semibold ${titleColor}`}>Meezan Bank</p>
                    <p className={`text-xs ${subColor}`}>Acct: **** 8821</p>
                  </div>
                </div>
                <span className="inline-flex h-[22px] w-[76px] items-center justify-center rounded border border-[#4d99ff] text-[10px] font-bold text-[#4d99ff]">
                  BACKUP
                </span>
              </div>
            </div>
          </section>

          <section className="mt-5">
            <p className={`text-[17px] font-semibold ${titleColor}`}>Payout History</p>
            <div className={`mt-3 hidden rounded-lg px-4 py-4 text-[10px] font-bold md:block ${isLight ? 'bg-[#eef0f4] text-[#6b7280]' : 'bg-[#222] text-[#9a9a9a]'}`}>
              <div className="grid grid-cols-[116px_160px_240px_160px_160px_1fr]">
                {['DATE', 'METHOD', 'TRANSACTION ID', 'AMOUNT', 'STATUS', 'INVOICE'].map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>
            </div>
            <div className="mt-2 space-y-2">
              {payoutHistory.map((row) => (
                <div key={row.txn} className={`grid rounded-lg border px-4 py-4 md:grid-cols-[116px_160px_240px_160px_160px_1fr] ${cardBg}`}>
                  <span className={`text-xs ${titleColor}`}>{row.date}</span>
                  <span className={`text-xs ${subColor}`}>{row.method}</span>
                  <span className={`text-xs font-medium ${subColor}`}>{row.txn}</span>
                  <span className={`text-[13px] font-semibold ${accent}`}>{row.amount}</span>
                  <span className={`inline-flex h-[22px] w-[108px] items-center justify-center rounded border text-[9px] font-bold ${
                    row.status === 'completed'
                      ? `${isLight ? 'border-[#00b851] text-[#00b851]' : 'border-[#00ff7a] text-[#00ff7a]'}`
                      : 'border-[#ffd133] text-[#ffd133]'
                  }`}>
                    {row.status.toUpperCase()}
                  </span>
                  <button type="button" className={`text-left text-xs font-medium ${accent}`}>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
