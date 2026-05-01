import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

type DisputeCard = {
  id: string;
  severity: 'HIGH' | 'MED' | 'LOW';
  title: string;
  parties: string;
};

const openDisputes: DisputeCard[] = [
  { id: '#BPK-9876', severity: 'HIGH', title: 'Wrong Item', parties: 'Omar K. vs Lahore Fashion' },
  { id: '#BPK-9854', severity: 'MED', title: 'Damaged Product', parties: 'Ayesha vs Multan Crafts' },
  { id: '#BPK-9841', severity: 'HIGH', title: 'Not Received', parties: 'Hamza R. vs TechHub' },
  { id: '#BPK-9828', severity: 'HIGH', title: 'Counterfeit', parties: 'Fatima vs Silk Road' },
  { id: '#BPK-9815', severity: 'LOW', title: 'Wrong Size', parties: 'Bilal vs Lahore Fashion' },
];

export default function AdminDisputeManagementPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [activeNav, setActiveNav] = useState<AdminNav>('Disputes');

  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const topBarBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const cardBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const surfaceBg = isLight ? 'bg-[#f3f5f8] border-[#d9dde5]' : 'bg-[#131313] border-[#2a2a2a]';
  const mutedPanel = isLight ? 'bg-[#eef0f4] border-[#d9dde5]' : 'bg-[#222] border-[#2a2a2a]';
  const titleColor = isLight ? 'text-[#111827]' : 'text-white';
  const subColor = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const weakColor = isLight ? 'text-[#9ca3af]' : 'text-[#444]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const accentBg = isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]';
  const accentBorder = isLight ? 'border-[#00b851]' : 'border-[#00ff7a]';
  const accentText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';

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

  const handleNav = async (item: AdminNav) => {
    setActiveNav(item);
    if (item === 'Dashboard') {
      navigate('/admin');
      return;
    }
    if (item === 'Seller Verification') {
      navigate('/admin/seller-verification');
      return;
    }
    if (item === 'Disputes') {
      navigate('/admin/disputes');
      return;
    }
    if (item === 'Analytics') {
      navigate('/admin/analytics');
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
          <p className={`ml-6 text-[14px] font-medium ${titleColor}`}>Dispute Management</p>
          <div className="ml-auto flex items-center gap-2">
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
            <p className={`text-[10px] font-medium ${weakColor}`}>ADMIN</p>
            <p className={`mt-1 text-[14px] font-semibold ${titleColor}`}>Platform Admin</p>
            <p className={`mt-1 text-[11px] ${accent}`}>Super Admin</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {navItems.map((item) => {
              const active = activeNav === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => void handleNav(item)}
                  className={`relative h-10 rounded-lg px-4 text-left text-[13px] font-medium leading-10 ${
                    active ? `${isLight ? 'bg-[#eef0f4] text-[#111827]' : 'bg-[#222] text-white'}` : `${subColor}`
                  }`}
                >
                  {active && <span className={`absolute left-0 top-2 h-6 w-[3px] rounded-sm ${accentBg}`} />}
                  {item}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="w-full px-4 py-8 lg:flex-1 lg:px-8">
          <div className="mx-auto w-full max-w-[1040px]">
            <h1 className={`text-[26px] font-bold leading-none ${titleColor}`}>Dispute Management</h1>
            <p className={`mt-2 text-[13px] ${subColor}`}>12 open disputes  -  Rule in favour of buyer or seller, or request more evidence</p>

            <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Open" value="12" valueClass="text-[#ff5959]" cardBg={cardBg} subColor={subColor} />
              <MetricCard label="Pending Evidence" value="5" valueClass="text-[#ffd133]" cardBg={cardBg} subColor={subColor} />
              <MetricCard label="Resolved (Month)" value="48" valueClass={isLight ? 'text-[#00b851]' : 'text-[#00ff7a]'} cardBg={cardBg} subColor={subColor} />
              <MetricCard label="Avg. Resolution" value="32h" valueClass="text-[#4d99ff]" cardBg={cardBg} subColor={subColor} />
            </section>

            <section className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[440px_524px]">
              <article className={`min-h-[624px] rounded-xl border p-[15px] ${cardBg}`}>
                <p className={`ml-1 mt-1 text-[15px] font-semibold ${titleColor}`}>Open Disputes</p>
                <div className="mt-3 space-y-2">
                  {openDisputes.map((dispute, index) => (
                    <button
                      key={dispute.id}
                      type="button"
                      className={`flex min-h-[96px] w-full items-start rounded-[10px] border px-3 py-[10px] text-left ${
                        index === 0 ? `${mutedPanel} border-2 ${accentBorder}` : `${surfaceBg}`
                      }`}
                    >
                      <span className="min-w-0">
                        <span className={`block text-[13px] font-semibold ${titleColor}`}>
                          {dispute.id}
                          <span className={`ml-2 inline-flex h-5 min-w-[56px] items-center justify-center rounded border text-[9px] font-bold ${
                            dispute.severity === 'HIGH'
                              ? 'border-[#ff5959] text-[#ff5959]'
                              : dispute.severity === 'MED'
                              ? 'border-[#ffd133] text-[#ffd133]'
                              : `${accentBorder} ${accent}`
                          }`}>
                            {dispute.severity}
                          </span>
                        </span>
                        <span className={`mt-1 block text-[12px] font-semibold ${accent}`}>{dispute.title}</span>
                        <span className={`block text-[11px] ${subColor}`}>{dispute.parties}</span>
                        <span className={`mt-1 inline-flex h-[18px] items-center rounded border px-1 text-[8px] font-bold ${isLight ? 'border-[#d9dde5] text-[#6b7280]' : 'border-[#2a2a2a] text-[#9a9a9a]'}`}>
                          UNDER REVIEW
                        </span>
                      </span>
                      <span className={`ml-auto mt-[72px] text-[10px] ${weakColor}`}>2h ago</span>
                    </button>
                  ))}
                </div>
              </article>

              <article className={`min-h-[624px] rounded-xl border px-[23px] py-[23px] ${cardBg}`}>
                <div className="flex items-center gap-3">
                  <p className={`text-[17px] font-semibold leading-none ${titleColor}`}>Dispute #BPK-9876</p>
                  <span className="inline-flex h-[22px] min-w-[64px] items-center justify-center rounded border border-[#ff5959] text-[10px] font-bold text-[#ff5959]">
                    HIGH
                  </span>
                </div>
                <p className={`mt-2 text-[13px] ${subColor}`}>Wrong Item Received  -  Filed Apr 23, 2026</p>

                <div className={`mt-3 h-[88px] rounded-lg border px-[15px] py-[11px] ${surfaceBg}`}>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div>
                      <p className={`text-[10px] font-bold ${subColor}`}>BUYER</p>
                      <p className={`text-[14px] font-semibold ${titleColor}`}>Omar Khan</p>
                      <p className={`text-[11px] ${subColor}`}>omar.k@email.com</p>
                    </div>
                    <p className={`text-[14px] font-bold ${weakColor}`}>VS</p>
                    <div>
                      <p className={`text-[10px] font-bold ${subColor}`}>SELLER</p>
                      <p className={`text-[14px] font-semibold ${titleColor}`}>Lahore Fashion Co.</p>
                      <p className={`text-[11px] ${accent}`}>Verified  -  482 orders</p>
                    </div>
                  </div>
                </div>

                <p className={`mt-6 text-[11px] font-bold ${subColor}`}>BUYER CLAIM</p>
                <div className={`mt-2 h-[76px] rounded-lg border px-[15px] py-[13px] text-[12px] ${titleColor} ${surfaceBg}`}>
                  Received a red kurta instead of the blue one I ordered (Order #BPK-9876, size M). Would like a full refund.
                </div>

                <p className={`mt-4 text-[11px] font-bold ${subColor}`}>EVIDENCE (3 photos)</p>
                <div className="mt-2 grid grid-cols-3 gap-[15px]">
                  {['PHOTO 1', 'PHOTO 2', 'PHOTO 3'].map((label) => (
                    <div key={label} className={`h-[96px] rounded-lg border ${surfaceBg} flex items-center justify-center text-[11px] font-medium ${weakColor}`}>
                      {label}
                    </div>
                  ))}
                </div>

                <p className={`mt-4 text-[11px] font-bold ${subColor}`}>SELLER RESPONSE</p>
                <div className={`mt-2 h-[64px] rounded-lg border px-[15px] py-[13px] text-[12px] ${titleColor} ${surfaceBg}`}>
                  Packing error confirmed. Ready to process refund or send replacement.
                </div>

                <p className={`mt-4 text-[11px] font-bold ${subColor}`}>ADMIN RULING</p>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <button type="button" className={`h-10 rounded-lg ${accentBg} text-[12px] font-semibold ${accentText}`}>
                    Refund Buyer
                  </button>
                  <button type="button" className={`h-10 rounded-lg border border-[#4d99ff] text-[12px] font-semibold text-[#4d99ff] ${isLight ? 'bg-[#eef0f4]' : 'bg-[#222]'}`}>
                    Release to Seller
                  </button>
                  <button type="button" className={`h-10 rounded-lg border border-[#ffd133] text-[12px] font-semibold text-[#ffd133] ${isLight ? 'bg-[#eef0f4]' : 'bg-[#222]'}`}>
                    Request Evidence
                  </button>
                </div>
              </article>
            </section>
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
    <div className={`h-[96px] rounded-xl border px-[19px] py-[19px] ${cardBg}`}>
      <p className={`text-[11px] font-medium ${subColor}`}>{label}</p>
      <p className={`mt-1 text-[28px] font-bold leading-none ${valueClass}`}>{value}</p>
    </div>
  );
}
