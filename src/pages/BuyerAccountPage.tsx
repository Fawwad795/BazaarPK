import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import BuyerCartShortcut from '../components/BuyerCartShortcut';
import BuyerTrackShortcut from '../components/BuyerTrackShortcut';

const tabs = ['All (12)', 'Pending (1)', 'Shipped (2)', 'Delivered (8)', 'Cancelled (1)'] as const;

const orders = [
  { id: '#BPK-9912', item: 'Embroidered Kurta +2', date: 'Apr 24, 2026', total: 'Rs. 16,348', status: 'IN TRANSIT', statusType: 'transit' },
  { id: '#BPK-9891', item: 'Silver Jhumka Set', date: 'Apr 22, 2026', total: 'Rs. 1,850', status: 'DELIVERED', statusType: 'delivered' },
  { id: '#BPK-9875', item: 'Handwoven Rug', date: 'Apr 20, 2026', total: 'Rs. 8,900', status: 'DELIVERED', statusType: 'delivered' },
  { id: '#BPK-9862', item: 'Truck Art Mug +1', date: 'Apr 18, 2026', total: 'Rs. 1,750', status: 'DELIVERED', statusType: 'delivered' },
  { id: '#BPK-9854', item: 'Kashmiri Dry Fruits', date: 'Apr 16, 2026', total: 'Rs. 2,299', status: 'DELIVERED', statusType: 'delivered' },
  { id: '#BPK-9841', item: 'Brass Diya Set', date: 'Apr 14, 2026', total: 'Rs. 1,100', status: 'CANCELLED', statusType: 'cancelled' },
] as const;

export default function BuyerAccountPage() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const isLight = !isDarkMode;

  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const navBg = isLight ? 'bg-white' : 'bg-[#1a1a1a]';
  const sideBg = isLight ? 'bg-white' : 'bg-[#1a1a1a]';
  const cardBg = isLight ? 'bg-white' : 'bg-[#1a1a1a]';
  const softBg = isLight ? 'bg-[#eef0f4]' : 'bg-[#222]';
  const border = isLight ? 'border-[#d9dde5]' : 'border-[#2a2a2a]';
  const title = isLight ? 'text-[#111827]' : 'text-white';
  const sub = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const accentBg = isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]';
  const accentBtnText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';

  const sidebarItems = [
    { label: 'My Orders', functional: true },
    { label: 'Saved Items', functional: false },
    { label: 'Addresses', functional: false },
    { label: 'Payment Methods', functional: false },
    { label: 'Reviews', functional: false },
    { label: 'Notifications', functional: false },
    { label: 'Settings', functional: false },
    { label: 'Help & Support', functional: false },
    { label: 'Log Out', functional: false },
  ] as const;

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <BuyerCartShortcut />
      <BuyerTrackShortcut />
      <header className={`border ${border} ${navBg}`}>
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center px-4 sm:px-6">
          <p className={`text-[20px] font-bold ${accent}`}>BazaarPK</p>
          <Link to="/buyer" className={`ml-8 text-[13px] font-medium ${sub}`}>
            &lt; Continue Shopping
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className={`ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border ${border} ${softBg} ${accent}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className={`w-[240px] border-r p-4 ${border} ${sideBg}`}>
          <div className={`rounded-xl border p-4 ${border} ${softBg}`}>
            <div className="flex items-center gap-3">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-[20px] font-bold ${accentBg} ${accentBtnText}`}>
                <span className="text-[28px] font-semibold leading-none">
                  {(user?.name?.[0] || 'S').toUpperCase()}
                </span>
              </div>
              <div>
                <p className={`text-[14px] font-semibold ${title}`}>{user?.name || 'Sara Ahmed'}</p>
                <p className={`text-[11px] ${sub}`}>{user?.email || 'sara@email.com'}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {sidebarItems.map((item) =>
              item.functional ? (
                <button
                  key={item.label}
                  type="button"
                  className={`relative h-10 w-full rounded-lg text-left text-[13px] font-semibold ${softBg} ${title}`}
                >
                  <span className={`absolute left-0 top-2 h-6 w-[3px] rounded-sm ${accentBg}`} />
                  <span className="pl-4">{item.label}</span>
                </button>
              ) : item.label === 'Log Out' ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className={`h-10 w-full rounded-lg text-left text-[13px] font-medium ${sub}`}
                >
                  <span className="pl-4">{item.label}</span>
                </button>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  className={`h-10 w-full cursor-not-allowed rounded-lg text-left text-[13px] font-medium ${sub}`}
                  title="Coming soon"
                >
                  <span className="pl-4">{item.label}</span>
                </button>
              )
            )}
          </div>
        </aside>

        <main className="w-full px-8 py-8">
          <h1 className={`text-[26px] font-bold leading-none ${title}`}>My Orders</h1>
          <p className={`mt-2 text-[13px] ${sub}`}>View and track all your orders</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab, idx) => (
              <button
                key={tab}
                type="button"
                className={`h-[34px] rounded-lg border px-4 text-[12px] font-medium ${
                  idx === 0 ? `${cardBg} ${title} ${border}` : `${border} ${sub}`
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={`mt-5 hidden h-12 grid-cols-[1.15fr_1.6fr_1fr_1fr_1fr_.7fr] items-center rounded-lg px-3 text-[10px] font-bold md:grid ${softBg} ${sub}`}>
            <span>ORDER</span>
            <span>ITEMS</span>
            <span>DATE</span>
            <span>TOTAL</span>
            <span>STATUS</span>
            <span>ACTIONS</span>
          </div>

          <div className="mt-2 space-y-2">
            {orders.map((order) => (
              <article
                key={order.id}
                className={`grid h-16 items-center rounded-lg border px-3 md:grid-cols-[1.15fr_1.6fr_1fr_1fr_1fr_.7fr] ${border} ${cardBg}`}
              >
                <p className={`text-[13px] font-semibold ${title}`}>{order.id}</p>
                <p className={`text-[12px] ${sub}`}>{order.item}</p>
                <p className={`text-[12px] ${sub}`}>{order.date}</p>
                <p className={`text-[13px] font-bold ${accent}`}>{order.total}</p>
                <div>
                  <span
                    className={`inline-flex h-6 min-w-[108px] items-center justify-center rounded border text-[10px] font-bold ${
                      order.statusType === 'transit'
                        ? `${isLight ? 'border-[#00b851] text-[#00b851]' : 'border-[#00ff7a] text-[#00ff7a]'}`
                        : order.statusType === 'cancelled'
                          ? 'border-[#ff5959] text-[#ff5959]'
                          : `${isLight ? 'border-[#6b7280] text-[#6b7280]' : 'border-[#9a9a9a] text-[#9a9a9a]'}`
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/tracking')}
                  className={`text-left text-[12px] font-medium ${accent}`}
                >
                  View & Track
                </button>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
