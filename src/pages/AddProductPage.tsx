import { useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'] as const;
const availableColors = ['#111827', '#262626', '#801a1a', '#1a408c'] as const;

export default function AddProductPage() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L']);
  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0]);
  const navigate = useNavigate();
  const location = useLocation();

  const activeSidebar = useMemo(() => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/products') return 'Inventory';
    if (location.pathname.startsWith('/dashboard/orders')) return 'Orders';
    if (location.pathname === '/dashboard/analytics') return 'Analytics';
    if (location.pathname === '/dashboard/payments' || location.pathname === '/checkout') return 'Payments';
    if (location.pathname === '/chat') return 'Support';
    if (location.pathname === '/products/new') return 'Inventory';
    return 'Inventory';
  }, [location.pathname]);

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

  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const topBarBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const cardBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const inputBg = isLight ? 'bg-[#f3f5f8] border-[#d9dde5] text-[#111827] placeholder:text-[#9ca3af]' : 'bg-[#131313] border-[#2a2a2a] text-white placeholder:text-[#444]';
  const titleColor = isLight ? 'text-[#111827]' : 'text-white';
  const subColor = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const avatarText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((entry) => entry !== size) : [...prev, size]
    );
  };

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <header className={`border ${topBarBg}`}>
        <div className="flex h-[64px] w-full items-center px-4 sm:px-6 lg:px-8">
          <p className={`text-[20px] font-bold ${accent}`}>BazaarPK</p>
          <p className={`ml-6 text-[14px] font-medium ${titleColor}`}>Add New Product</p>
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
          <div className={`mb-6 rounded-xl border p-4 ${inputBg}`}>
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
                  onClick={() => void item.action()}
                  className={`relative h-10 rounded-lg px-4 text-left text-[13px] font-medium leading-10 transition ${
                    active
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
          <h1 className={`text-3xl font-bold leading-none lg:text-[38px] ${titleColor}`}>Add New Product</h1>
          <p className={`mt-2 text-[13px] ${subColor}`}>Create a new listing for your store</p>

          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,640px)_336px]">
            <section className={`rounded-xl border p-6 ${cardBg}`}>
              <h2 className={`text-[17px] font-semibold ${titleColor}`}>Basic Information</h2>
              <div className="mt-5 space-y-4">
                <Field label="PRODUCT TITLE">
                  <input className={`h-11 w-full rounded-lg border px-3 text-sm outline-none ${inputBg}`} placeholder="e.g. Hand-embroidered Cotton Kurta" />
                </Field>
                <Field label="DESCRIPTION">
                  <textarea className={`h-[120px] w-full rounded-lg border px-3 py-3 text-sm outline-none ${inputBg}`} placeholder="Describe your product in detail..." />
                </Field>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="CATEGORY">
                    <select className={`h-11 w-full rounded-lg border px-3 text-sm outline-none ${inputBg}`}>
                      <option>Clothing</option>
                      <option>Home</option>
                      <option>Electronics</option>
                    </select>
                  </Field>
                  <Field label="BRAND / LABEL">
                    <input className={`h-11 w-full rounded-lg border px-3 text-sm outline-none ${inputBg}`} placeholder="Optional" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="PRICE (Rs.)">
                    <input className={`h-11 w-full rounded-lg border px-3 text-sm outline-none ${inputBg}`} defaultValue="2450" />
                  </Field>
                  <Field label="ORIGINAL PRICE">
                    <input className={`h-11 w-full rounded-lg border px-3 text-sm outline-none ${inputBg}`} defaultValue="3200" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="STOCK QUANTITY">
                    <input className={`h-11 w-full rounded-lg border px-3 text-sm outline-none ${inputBg}`} defaultValue="48" />
                  </Field>
                  <Field label="SKU CODE">
                    <input className={`h-11 w-full rounded-lg border px-3 text-sm outline-none ${inputBg}`} defaultValue="BPK-KR-001" />
                  </Field>
                </div>
              </div>

              <div className="mt-6">
                <h3 className={`text-[15px] font-semibold ${titleColor}`}>Variants</h3>
                <p className={`mt-1 text-xs ${subColor}`}>Add size, color or material options</p>
                <p className={`mt-4 text-[11px] font-medium ${subColor}`}>SIZES</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const active = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`h-9 min-w-[48px] rounded-md px-3 text-xs font-semibold ${
                          active
                            ? `${isLight ? 'bg-[#00b851] text-[#f7f8fa]' : 'bg-[#00ff7a] text-[#0d0d0d]'}`
                            : `${inputBg}`
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <p className={`mt-4 text-[11px] font-medium ${subColor}`}>COLORS</p>
                <div className="mt-2 flex items-center gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-8 w-8 rounded-full border ${selectedColor === color ? `${isLight ? 'border-[#00b851]' : 'border-[#00ff7a]'} border-2` : isLight ? 'border-[#d9dde5]' : 'border-[#2a2a2a]'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <button
                    type="button"
                    className={`h-8 w-8 rounded-full border border-dashed text-sm ${isLight ? 'border-[#d9dde5] text-[#6b7280]' : 'border-[#2a2a2a] text-[#9a9a9a]'}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </section>

            <div className="space-y-4">
              <section className={`rounded-xl border p-6 ${cardBg}`}>
                <h2 className={`text-[17px] font-semibold ${titleColor}`}>Product Images</h2>
                <p className={`text-xs ${subColor}`}>Up to 8 images</p>
                <div className={`mt-4 h-[180px] rounded-[10px] border border-dashed text-center ${inputBg}`}>
                  <p className={`pt-12 text-4xl font-bold ${isLight ? 'text-[#d9dde5]' : 'text-[#2a2a2a]'}`}>[+]</p>
                  <p className={`mt-2 text-[13px] ${subColor}`}>Upload Cover Image</p>
                  <p className={`text-[11px] ${isLight ? 'text-[#9ca3af]' : 'text-[#444]'}`}>Drag & drop or click to browse</p>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {['1', '2', '+', '+'].map((item, index) => (
                    <div key={`${item}-${index}`} className={`flex h-16 items-center justify-center rounded-md border ${index > 1 ? 'border-dashed' : ''} ${inputBg}`}>
                      <span className={`text-sm ${subColor}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className={`rounded-xl border p-6 ${cardBg}`}>
                <h2 className={`text-[17px] font-semibold ${titleColor}`}>Publish Settings</h2>
                <Field label="STATUS">
                  <select className={`h-10 w-full rounded-lg border px-3 text-sm outline-none ${inputBg}`}>
                    <option>Active</option>
                    <option>Draft</option>
                  </select>
                </Field>
                <Field label="VISIBILITY">
                  <select className={`h-10 w-full rounded-lg border px-3 text-sm outline-none ${inputBg}`}>
                    <option>Public (all buyers)</option>
                    <option>Private</option>
                  </select>
                </Field>
              </section>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[640px_336px]">
            <button
              type="button"
              className={`h-[52px] rounded-lg text-[15px] font-semibold ${isLight ? 'bg-[#00b851] text-[#f7f8fa]' : 'bg-[#00ff7a] text-[#0d0d0d]'}`}
            >
              Publish Product
            </button>
            <button
              type="button"
              className={`h-[52px] rounded-lg border text-[15px] font-semibold ${inputBg}`}
            >
              Save as Draft
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-medium text-[#6b7280] dark:text-[#9a9a9a]">{label}</p>
      {children}
    </div>
  );
}
