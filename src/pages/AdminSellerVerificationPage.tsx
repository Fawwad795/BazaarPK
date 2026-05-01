import { useMemo, useState } from 'react';
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

type QueueItem = {
  initial: string;
  name: string;
  subtitle: string;
  age: string;
};

const queue: QueueItem[] = [
  { initial: 'Z', name: 'Zainab Crafts', subtitle: 'Faisalabad  -  Handicrafts', age: '48h ago' },
  { initial: 'K', name: 'Karachi Tech Shop', subtitle: 'Karachi  -  Electronics', age: '32h ago' },
  { initial: 'P', name: 'Peshawar Fabrics', subtitle: 'Peshawar  -  Clothing', age: '18h ago' },
  { initial: 'M', name: 'Multan Honey Co.', subtitle: 'Multan  -  Food', age: '6h ago' },
  { initial: 'L', name: 'Lahore Ceramics', subtitle: 'Lahore  -  Home Decor', age: '2h ago' },
];

export default function AdminSellerVerificationPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [activeNav, setActiveNav] = useState<AdminNav>('Seller Verification');

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

  const tabs = useMemo(
    () => [
      { label: 'Pending (5)', active: true },
      { label: 'Approved (487)', active: false },
      { label: 'Resubmission (12)', active: false },
      { label: 'Rejected (24)', active: false },
    ],
    []
  );

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
          <p className={`ml-6 text-[14px] font-medium ${titleColor}`}>Seller Verification</p>
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
            <h1 className={`text-[26px] font-bold leading-none ${titleColor}`}>Seller Verification Queue</h1>
            <p className={`mt-2 text-[13px] ${subColor}`}>5 applications pending  -  Review CNIC, business details and payment methods</p>

            <section className="mt-6 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  className={`h-[34px] rounded-[6px] px-4 text-[12px] font-medium ${
                    tab.active
                      ? `${isLight ? 'bg-[#eef0f4] text-[#111827]' : 'bg-[#222] text-white'}`
                      : `border ${isLight ? 'border-[#d9dde5] text-[#6b7280]' : 'border-[#2a2a2a] text-[#9a9a9a]'}`
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </section>

            <section className="mt-[18px] grid grid-cols-1 gap-4 xl:grid-cols-[400px_566px]">
              <article className={`h-[760px] rounded-xl border p-[15px] ${cardBg}`}>
                <p className={`ml-1 mt-1 text-[15px] font-semibold ${titleColor}`}>Pending Applications</p>
                <div className="mt-3 space-y-3">
                  {queue.map((item, index) => {
                    const selected = index === 0;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        className={`flex h-[96px] w-full items-start rounded-[10px] border px-[10px] py-[10px] text-left ${
                          selected
                            ? `${mutedPanel} border-2 ${accentBorder}`
                            : `${surfaceBg}`
                        }`}
                      >
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#9966ff] text-[18px] font-bold text-[#f7f8fa] dark:text-[#0d0d0d]">
                          {item.initial}
                        </span>
                        <span className="ml-3 min-w-0">
                          <span className={`block text-[13px] font-semibold ${titleColor}`}>{item.name}</span>
                          <span className={`block text-[11px] ${subColor}`}>{item.subtitle}</span>
                          <span className={`mt-2 inline-flex h-5 items-center rounded border px-[10px] text-[9px] font-bold ${accent} ${accentBorder}`}>
                            PENDING
                          </span>
                        </span>
                        <span className={`ml-auto mt-[42px] text-[11px] ${weakColor}`}>{item.age}</span>
                      </button>
                    );
                  })}
                </div>
              </article>

              <article className={`h-[760px] rounded-xl border px-[23px] py-[23px] ${cardBg}`}>
                <p className={`text-[17px] font-semibold ${titleColor}`}>Application Review</p>
                <p className={`mt-1 text-[13px] ${subColor}`}>Zainab Crafts  -  Applied 48 hours ago</p>

                <p className={`mt-7 text-[11px] font-bold ${subColor}`}>CNIC DOCUMENTS</p>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {['CNIC FRONT', 'CNIC BACK'].map((label) => (
                    <div key={label} className={`h-[160px] rounded-[10px] border px-[9px] py-[9px] ${surfaceBg}`}>
                      <p className={`text-[10px] font-bold ${weakColor}`}>{label}</p>
                      <div className={`mt-12 text-center text-[15px] font-medium ${weakColor}`}>[ CNIC IMAGE ]</div>
                    </div>
                  ))}
                </div>

                <p className={`mt-6 text-[11px] font-bold ${subColor}`}>APPLICANT DETAILS</p>
                <div className="mt-2 grid grid-cols-1 gap-x-10 gap-y-[2px] sm:grid-cols-2">
                  <Detail title="Full Name" value="Zainab Fatima Hussain" titleColor={subColor} valueColor={titleColor} />
                  <Detail title="CNIC Number" value="34201-XXXXXXX-8" titleColor={subColor} valueColor={titleColor} />
                  <Detail title="Business Name" value="Zainab Crafts" titleColor={subColor} valueColor={titleColor} />
                  <Detail title="Category" value="Handicrafts" titleColor={subColor} valueColor={titleColor} />
                  <Detail title="Phone" value="+92 300 1234567" titleColor={subColor} valueColor={titleColor} />
                  <Detail title="City" value="Faisalabad, Punjab" titleColor={subColor} valueColor={titleColor} />
                  <Detail title="Payment Method" value="JazzCash: +92 300 ***67" titleColor={subColor} valueColor={titleColor} />
                  <Detail title="Experience" value="3 years of Instagram sales" titleColor={subColor} valueColor={titleColor} />
                </div>

                <div className={`mt-4 flex h-12 items-center rounded-lg border px-[15px] text-[13px] font-semibold ${accent} ${accentBorder} ${isLight ? 'bg-[#e6f9ee]' : 'bg-[#0c1f14]'}`}>
                  NADRA API check passed  -  CNIC matches applicant name
                </div>

                <p className={`mt-4 text-[11px] font-bold ${subColor}`}>ADMIN NOTES</p>
                <div className={`mt-2 h-20 rounded-lg border px-[13px] py-3 text-[12px] ${titleColor} ${surfaceBg}`}>
                  Verified business exists on Instagram under same name. Payment account matches.
                </div>

                <div className="mt-[22px] grid grid-cols-[176px_176px_132px] gap-4">
                  <button type="button" className={`h-11 rounded-lg ${accentBg} text-[13px] font-semibold ${accentText}`}>
                    Approve
                  </button>
                  <button
                    type="button"
                    className={`h-11 rounded-lg border border-[#ffd133] text-[13px] font-semibold ${
                      isLight ? 'bg-[#eef0f4] text-[#444]' : 'bg-[#222] text-[#ffd133]'
                    }`}
                  >
                    Request Resubmit
                  </button>
                  <button
                    type="button"
                    className={`h-11 rounded-lg border border-[#ff5959] text-[13px] font-semibold ${
                      isLight ? 'bg-[#eef0f4] text-[#ff5959]' : 'bg-[#222] text-[#ff5959]'
                    }`}
                  >
                    Reject
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

function Detail({ title, value, titleColor, valueColor }: { title: string; value: string; titleColor: string; valueColor: string }) {
  return (
    <div>
      <p className={`text-[11px] font-medium ${titleColor}`}>{title}</p>
      <p className={`text-[13px] font-medium ${valueColor}`}>{value}</p>
    </div>
  );
}
