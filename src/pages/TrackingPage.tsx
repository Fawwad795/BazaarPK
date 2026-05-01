import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import BuyerCartShortcut from '../components/BuyerCartShortcut';
import BuyerTrackShortcut from '../components/BuyerTrackShortcut';

const timeline = [
  { label: 'Order Placed', time: 'Apr 24, 2026  -  2:34 PM', done: true },
  { label: 'Payment Confirmed', time: 'Apr 24, 2026  -  2:35 PM', done: true },
  { label: 'Order Packed', time: 'Apr 25, 2026  -  10:12 AM', done: true },
  { label: 'Shipped', time: 'Apr 26, 2026  -  9:00 AM', done: true, flag: 'IN TRANSIT' },
  { label: 'Out for Delivery', time: 'Estimated Apr 28', done: false },
  { label: 'Delivered', time: 'Estimated Apr 28 - 30', done: false },
] as const;

export default function TrackingPage() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const navBg = isLight ? 'bg-white' : 'bg-[#1a1a1a]';
  const cardBg = isLight ? 'bg-white' : 'bg-[#1a1a1a]';
  const softBg = isLight ? 'bg-[#eef0f4]' : 'bg-[#222]';
  const border = isLight ? 'border-[#d9dde5]' : 'border-[#2a2a2a]';
  const title = isLight ? 'text-[#111827]' : 'text-white';
  const sub = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const faint = isLight ? 'text-[#9ca3af]' : 'text-[#444]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const accentBg = isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]';
  const accentBtnText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <BuyerCartShortcut />
      <BuyerTrackShortcut />
      <header className={`border ${border} ${navBg}`}>
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center px-4 sm:px-6">
          <p className={`text-[20px] font-bold ${accent}`}>BazaarPK</p>
          <Link to="/" className={`ml-8 text-[13px] font-medium ${sub}`}>
            &lt; Back to Dashboard
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

      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
        <h1 className={`text-[40px] font-bold leading-none ${title}`}>Order Tracking</h1>
        <p className={`mt-2 text-[13px] ${sub}`}>Order #BPK-9912 - Placed on Apr 24, 2026</p>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,816px)_384px]">
          <section className={`rounded-xl border p-6 ${border} ${cardBg}`}>
            <div className="space-y-0">
              {timeline.map((step, idx) => (
                <div key={step.label} className="relative flex gap-5 pb-3 last:pb-0">
                  {idx < timeline.length - 1 && (
                    <div
                      className={`absolute left-[11px] top-6 h-[42px] w-[2px] ${
                        step.done ? (isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]') : (isLight ? 'bg-[#eef0f4]' : 'bg-[#222]')
                      }`}
                    />
                  )}
                  <div
                    className={`mt-[1px] h-6 w-6 rounded-full ${
                      step.done ? (isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]') : (isLight ? 'bg-[#eef0f4]' : 'bg-[#222]')
                    }`}
                  >
                    {step.done && <div className={`mx-auto mt-[7px] h-[10px] w-[10px] rounded ${isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]'}`} />}
                  </div>
                  <div className="flex flex-1 items-start justify-between">
                    <div>
                      <p className={`text-[15px] ${step.label === 'Shipped' ? 'font-bold' : 'font-semibold'} ${title}`}>
                        {step.label}
                      </p>
                      <p className={`text-[12px] ${sub}`}>{step.time}</p>
                    </div>
                    {step.flag && (
                      <span className={`mt-1 inline-flex h-[22px] items-center rounded px-3 text-[10px] font-bold ${accentBg} ${accentBtnText}`}>
                        {step.flag}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-4">
            <section className={`rounded-xl border p-6 ${border} ${cardBg}`}>
              <h2 className={`text-[16px] font-semibold ${title}`}>Shipping Details</h2>
              <div className="mt-5 space-y-3">
                {[
                  ['Carrier', 'TCS Express'],
                  ['Tracking #', 'TCS-PK-4782-9102'],
                  ['Pickup', 'Lahore, Punjab'],
                  ['Destination', 'DHA Phase 5, Lahore'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className={`text-[11px] font-medium ${sub}`}>{k}</span>
                    <span className={`text-[13px] font-medium ${title}`}>{v}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={`rounded-xl border p-6 ${border} ${cardBg}`}>
              <h2 className={`text-[16px] font-semibold ${title}`}>Need Help?</h2>
              <button type="button" className={`mt-4 h-11 w-full rounded-lg border text-[13px] font-medium ${border} ${softBg} ${title}`}>
                Message Seller
              </button>
              <button type="button" className={`mt-3 h-11 w-full rounded-lg border text-[13px] font-medium ${border} ${softBg} ${title}`}>
                Contact Support
              </button>
            </section>
          </div>
        </div>

        <section className={`mt-5 rounded-xl border ${border} ${cardBg}`}>
          <div
            className="h-[240px] rounded-xl"
            style={{
              backgroundImage:
                `linear-gradient(to right, ${isLight ? '#21212122' : '#21212155'} 1px, transparent 1px), linear-gradient(to bottom, ${isLight ? '#21212122' : '#21212155'} 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          >
            <div className={`flex h-full items-center justify-center text-[16px] font-medium ${faint}`}>
              LIVE MAP - Real-time carrier location
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
