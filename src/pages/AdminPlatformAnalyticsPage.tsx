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

type Period = '7D' | '30D' | '90D' | 'YTD';

const barsGreen = [176, 167, 92, 87, 147, 42, 157, 69, 41, 115, 153, 96];
const barsBlue = [108, 106, 80, 64, 130, 79, 106, 31, 54, 68, 62, 38];

const leaderboard = [
  ['#1', 'L', 'Lahore Fashion Co.', 'Clothing', '842', 'Rs. 2.1M', '* 4.9', 'TOP'],
  ['#2', 'M', 'Multan Handicrafts', 'Handicrafts', '412', 'Rs. 1.8M', '* 4.8', 'TOP'],
  ['#3', 'K', 'Karachi TechHub', 'Electronics', '628', 'Rs. 1.5M', '* 4.6', 'ACTIVE'],
  ['#4', 'H', 'Hyderabad Weavers', 'Clothing', '322', 'Rs. 980K', '* 4.9', 'TOP'],
];

export default function AdminPlatformAnalyticsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [activeNav, setActiveNav] = useState<AdminNav>('Analytics');
  const [period, setPeriod] = useState<Period>('30D');

  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const topBarBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const cardBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const mutedPanel = isLight ? 'bg-[#eef0f4] border-[#d9dde5]' : 'bg-[#222] border-[#2a2a2a]';
  const titleColor = isLight ? 'text-[#111827]' : 'text-white';
  const subColor = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const weakColor = isLight ? 'text-[#9ca3af]' : 'text-[#444]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const accentBg = isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]';
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
    if (item === 'Dashboard') navigate('/admin');
    if (item === 'Seller Verification') navigate('/admin/seller-verification');
    if (item === 'Disputes') navigate('/admin/disputes');
    if (item === 'Analytics') navigate('/admin/analytics');
    if (item === 'Log Out') {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div className={`min-h-screen overflow-x-hidden ${shellBg}`}>
      <header className={`border ${topBarBg}`}>
        <div className="flex h-[64px] w-full items-center px-[31px]">
          <p className={`text-[20px] font-bold ${accent}`}>BazaarPK Admin</p>
          <p className={`ml-6 text-[14px] font-medium ${titleColor}`}>Platform Analytics</p>
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

        <main className="w-full overflow-x-hidden px-4 py-8 lg:flex-1 lg:px-8">
          <div className="mx-auto w-full max-w-[980px]">
            <div className="grid grid-cols-1 items-start gap-4 min-[980px]:grid-cols-[minmax(0,1fr)_288px]">
              <div>
                <h1 className={`text-[26px] font-bold leading-none ${titleColor}`}>Platform Analytics</h1>
                <p className={`mt-2 text-[13px] ${subColor}`}>Deep performance analysis across the entire BazaarPK marketplace</p>
              </div>
              <div className={`flex h-9 w-full max-w-[288px] justify-self-end rounded-lg border ${isLight ? 'border-[#d9dde5] bg-[#eef0f4]' : 'border-[#2a2a2a] bg-[#222]'}`}>
                {(['7D', '30D', '90D', 'YTD'] as Period[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`h-9 flex-1 rounded-[6px] text-[12px] font-semibold ${
                      period === p ? `${accentBg} ${accentText}` : `${subColor}`
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <section className="mt-8 grid grid-cols-1 gap-3 min-[900px]:grid-cols-4">
              <KpiCard label="GMV" value="Rs. 12.4M" delta="+18.2%" valueClass={titleColor} deltaClass={accent} cardBg={cardBg} subColor={subColor} />
              <KpiCard label="Orders" value="24,891" delta="+5.4%" valueClass={titleColor} deltaClass={accent} cardBg={cardBg} subColor={subColor} />
              <KpiCard label="Take Rate" value="6.0%" delta="+0.2%" valueClass={titleColor} deltaClass={accent} cardBg={cardBg} subColor={subColor} />
              <KpiCard label="Disputes" value="0.8%" delta="-0.4%" valueClass={titleColor} deltaClass={accent} cardBg={cardBg} subColor={subColor} />
            </section>

            <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[672px_292px]">
              <article className={`h-[320px] rounded-xl border px-[23px] py-[23px] ${cardBg}`}>
                <p className={`text-[17px] font-semibold ${titleColor}`}>GMV Trend</p>
                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className={`h-[10px] w-[10px] rounded-[2px] ${accentBg}`} />
                    <span className={`text-[11px] ${subColor}`}>GMV (Rs. millions)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-[10px] w-[10px] rounded-[2px] bg-[#4d99ff]" />
                    <span className={`text-[11px] ${subColor}`}>Orders (thousands)</span>
                  </div>
                </div>
                <div className="mt-2 flex h-[220px] items-end gap-[20px]">
                  {barsGreen.map((h, idx) => (
                    <div key={`g-${idx}`} className="flex w-[34px] items-end justify-between">
                      <div className={`w-4 rounded-[4px] ${accentBg}`} style={{ height: `${h}px` }} />
                      <div className="w-4 rounded-[4px] bg-[#4d99ff]" style={{ height: `${barsBlue[idx]}px` }} />
                    </div>
                  ))}
                </div>
              </article>

              <article className={`h-[320px] rounded-xl border px-[23px] py-[23px] ${cardBg}`}>
                <p className={`text-[17px] font-semibold ${titleColor}`}>Category Breakdown</p>
                <div className={`relative mx-auto mt-3 h-[128px] w-[128px] rounded-full border-[20px] ${isLight ? 'border-[#00b851]' : 'border-[#00ff7a]'}`}>
                  <div
                    className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full ${
                      isLight ? 'h-[72px] w-[72px] bg-[#f7f8fa]' : 'h-[85px] w-[85px] bg-[#0d0d0d]'
                    }`}
                  >
                    <p className={`text-[14px] font-bold ${titleColor}`}>Rs. 12.4M</p>
                    <p className={`text-[10px] ${subColor}`}>Total GMV</p>
                  </div>
                </div>
                <div className="mt-3 space-y-[4px]">
                  {[
                    ['Clothing', '38%', isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]'],
                    ['Home Decor', '22%', 'bg-[#ffd133]'],
                    ['Electronics', '18%', 'bg-[#4d99ff]'],
                    ['Handicrafts', '12%', 'bg-[#9966ff]'],
                    ['Other', '10%', isLight ? 'bg-[#6b7280]' : 'bg-[#9a9a9a]'],
                  ].map(([label, pct, c]) => (
                    <div key={label} className="flex items-center">
                      <span className={`h-[10px] w-[10px] rounded-[2px] ${c}`} />
                      <span className={`ml-2 text-[11px] font-medium ${titleColor}`}>{label}</span>
                      <span className={`ml-auto text-[11px] font-semibold ${subColor}`}>{pct}</span>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className={`mt-6 h-[320px] rounded-xl border px-[23px] py-[23px] ${cardBg}`}>
              <p className={`text-[17px] font-semibold ${titleColor}`}>Top Seller Leaderboard</p>
              <p className={`mt-1 text-[12px] ${subColor}`}>Ranked by monthly GMV</p>
              <div className={`mt-5 grid h-10 grid-cols-[60px_260px_160px_110px_140px_95px_85px] items-center rounded-[6px] px-3 text-[10px] font-bold ${subColor} ${isLight ? 'bg-[#eef0f4]' : 'bg-[#222]'}`}>
                <span>RANK</span><span>SELLER</span><span>CATEGORY</span><span>ORDERS</span><span>GMV</span><span>RATING</span><span>STATUS</span>
              </div>
              <div className="mt-2 space-y-1">
                {leaderboard.map((r, index) => (
                  <div key={r[0]} className={`grid h-10 grid-cols-[60px_260px_160px_110px_140px_95px_85px] items-center rounded-[6px] px-3 ${index % 2 === 1 ? (isLight ? 'bg-[#f3f5f8]' : 'bg-[#131313]') : ''}`}>
                    <span className={`text-[12px] font-bold ${accent}`}>{r[0]}</span>
                    <span className="flex items-center gap-2 min-w-0">
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#9966ff] text-[11px] font-bold ${isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]'}`}>{r[1]}</span>
                      <span className={`truncate text-[12px] font-semibold ${titleColor}`}>{r[2]}</span>
                    </span>
                    <span className={`text-[11px] ${subColor}`}>{r[3]}</span>
                    <span className={`text-[12px] ${titleColor}`}>{r[4]}</span>
                    <span className={`text-[12px] font-semibold ${accent}`}>{r[5]}</span>
                    <span className="text-[11px] font-semibold text-[#ffd133]">{r[6]}</span>
                    <span className={`inline-flex h-5 w-full items-center justify-center rounded border text-[9px] font-bold ${
                      r[7] === 'TOP'
                        ? `${isLight ? 'border-[#00b851] text-[#00b851]' : 'border-[#00ff7a] text-[#00ff7a]'}`
                        : 'border-[#4d99ff] text-[#4d99ff]'
                    }`}>
                      {r[7]}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[504px_460px]">
              <article className={`h-[192px] rounded-xl border px-[23px] py-[19px] ${cardBg}`}>
                <p className={`text-[15px] font-semibold ${titleColor}`}>Orders by City</p>
                <div className="mt-4 space-y-[9px]">
                  {[
                    ['Karachi', '4280', isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]', 'w-[304px]'],
                    ['Lahore', '3840', isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]', 'w-[273px]'],
                    ['Islamabad', '2100', 'bg-[#4d99ff]', 'w-[149px]'],
                    ['Faisalabad', '1280', 'bg-[#ffd133]', 'w-[91px]'],
                    ['Multan', '940', 'bg-[#9966ff]', 'w-[67px]'],
                  ].map(([city, count, c, w]) => (
                    <div key={city} className="grid grid-cols-[86px_1fr_42px] items-center gap-0">
                      <span className={`text-[11px] font-medium ${titleColor}`}>{city}</span>
                      <span className={`h-4 rounded-[8px] ${c} ${w}`} />
                      <span className={`text-right text-[11px] ${subColor}`}>{count}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className={`h-[192px] rounded-xl border px-[23px] py-[19px] ${cardBg}`}>
                <p className={`text-[15px] font-semibold ${titleColor}`}>Payment Methods</p>
                <div className="mt-4 space-y-[9px]">
                  {[
                    ['JazzCash', '38%', isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]', 'w-[304px]'],
                    ['COD', '29%', 'bg-[#ffd133]', 'w-[232px]'],
                    ['EasyPaisa', '18%', isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]', 'w-[144px]'],
                    ['Raast', '9%', 'bg-[#4d99ff]', 'w-[72px]'],
                    ['Card', '6%', 'bg-[#9966ff]', 'w-[48px]'],
                  ].map(([method, pct, c, w]) => (
                    <div key={method} className="grid grid-cols-[86px_1fr_42px] items-center gap-0">
                      <span className={`text-[11px] font-medium ${titleColor}`}>{method}</span>
                      <span className={`h-4 rounded-[8px] ${c} ${w}`} />
                      <span className={`text-right text-[11px] font-semibold ${subColor}`}>{pct}</span>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  valueClass,
  deltaClass,
  cardBg,
  subColor,
}: {
  label: string;
  value: string;
  delta: string;
  valueClass: string;
  deltaClass: string;
  cardBg: string;
  subColor: string;
}) {
  return (
    <div className={`min-w-0 h-[112px] rounded-xl border px-[19px] py-[17px] ${cardBg}`}>
      <p className={`text-[11px] font-medium ${subColor}`}>{label}</p>
      <p className={`mt-1 text-[36px] font-bold leading-none ${valueClass}`}>{value}</p>
      <p className={`mt-2 text-[11px] font-semibold ${deltaClass}`}>{delta}</p>
    </div>
  );
}
