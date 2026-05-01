import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { formatPrice } from '../utils/helpers';

export default function ProductListingPage() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const { products, isLoading, fetchProducts } = useProductStore();
  const navigate = useNavigate();
  const location = useLocation();
  const sellerId = user?.id || 'seller-1';

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const inventoryProducts = useMemo(() => {
    const sellerProducts = products.filter((product) => product.seller.id === sellerId);
    const base = sellerProducts.length > 0 ? sellerProducts : products.slice(0, 8);

    return base
      .filter((product) => product.title.toLowerCase().includes(query.toLowerCase()))
      .filter((product) => {
        if (statusFilter === 'all') return true;
        const stock = product.stock;
        if (statusFilter === 'active') return stock > 10;
        if (statusFilter === 'draft') return stock > 0 && stock <= 10;
        return stock === 0;
      });
  }, [products, sellerId, query, statusFilter]);

  const stats = useMemo(() => {
    const sellerProducts = products.filter((product) => product.seller.id === sellerId);
    const source = sellerProducts.length > 0 ? sellerProducts : products.slice(0, 8);

    return {
      total: source.length,
      inStock: source.filter((p) => p.stock > 10).length,
      lowStock: source.filter((p) => p.stock > 0 && p.stock <= 10).length,
      outOfStock: source.filter((p) => p.stock === 0).length,
    };
  }, [products, sellerId]);

  const activeSidebar = useMemo(() => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/products') return 'Inventory';
    if (location.pathname.startsWith('/dashboard/orders')) return 'Orders';
    if (location.pathname === '/dashboard/analytics') return 'Analytics';
    if (location.pathname === '/dashboard/payments' || location.pathname === '/checkout') return 'Payments';
    if (location.pathname === '/chat') return 'Support';
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
  const surfaceBg = isLight ? 'bg-[#f3f5f8] border-[#d9dde5]' : 'bg-[#131313] border-[#2a2a2a]';
  const titleColor = isLight ? 'text-[#111827]' : 'text-white';
  const subColor = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const accent = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const avatarText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';

  const statusBadge = (stock: number) => {
    if (stock === 0) return 'border-[#ff5959] text-[#ff5959]';
    if (stock <= 10) return 'border-[#ffd133] text-[#ffd133]';
    return isLight ? 'border-[#00b851] text-[#00b851]' : 'border-[#00ff7a] text-[#00ff7a]';
  };

  const statusLabel = (stock: number) => {
    if (stock === 0) return 'OUT';
    if (stock <= 10) return 'LOW STOCK';
    return 'ACTIVE';
  };

  const categoryLabel = (category: unknown) => {
    if (typeof category === 'string') return category;
    if (category && typeof category === 'object' && 'name' in category) {
      const name = (category as { name?: unknown }).name;
      return typeof name === 'string' ? name : 'Uncategorized';
    }
    return 'Uncategorized';
  };

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <header className={`border ${topBarBg}`}>
        <div className="flex h-[64px] w-full items-center px-4 sm:px-6 lg:px-8">
          <p className={`text-[20px] font-bold ${accent}`}>BazaarPK</p>
          <p className={`ml-6 text-[14px] font-medium ${titleColor}`}>Inventory Management</p>
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
          <Link
            to="/products/new"
            className={`mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg text-[13px] font-semibold lg:mt-auto ${isLight ? 'bg-[#00b851] text-[#f7f8fa]' : 'bg-[#00ff7a] text-[#0d0d0d]'}`}
          >
            + Add New Product
          </Link>
        </aside>

        <main className="w-full px-4 py-8 sm:px-6 lg:flex-1 lg:px-8">
          <h1 className={`text-3xl font-bold leading-none lg:text-[38px] ${titleColor}`}>Inventory</h1>
          <p className={`mt-2 text-[13px] ${subColor}`}>Manage your product listings and stock levels</p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className={`rounded-xl border p-5 ${cardBg}`}>
              <p className={`text-[11px] font-medium ${subColor}`}>Total Products</p>
              <p className={`mt-2 text-[34px] font-bold leading-none ${accent}`}>{stats.total}</p>
            </div>
            <div className={`rounded-xl border p-5 ${cardBg}`}>
              <p className={`text-[11px] font-medium ${subColor}`}>In Stock</p>
              <p className={`mt-2 text-[34px] font-bold leading-none ${accent}`}>{stats.inStock}</p>
            </div>
            <div className={`rounded-xl border p-5 ${cardBg}`}>
              <p className={`text-[11px] font-medium ${subColor}`}>Low Stock</p>
              <p className="mt-2 text-[34px] font-bold leading-none text-[#ffd133]">{stats.lowStock}</p>
            </div>
            <div className={`rounded-xl border p-5 ${cardBg}`}>
              <p className={`text-[11px] font-medium ${subColor}`}>Out of Stock</p>
              <p className="mt-2 text-[34px] font-bold leading-none text-[#ff5959]">{stats.outOfStock}</p>
            </div>
          </div>

          <div className={`mt-4 flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center ${cardBg}`}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              className={`h-9 w-full rounded-md border px-3 text-xs outline-none sm:max-w-[280px] ${surfaceBg}`}
            />
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'active', label: 'Active' },
                { key: 'draft', label: 'Draft' },
                { key: 'archived', label: 'Archived' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key as 'all' | 'active' | 'draft' | 'archived')}
                  className={`h-[34px] rounded-md px-4 text-xs font-medium ${
                    statusFilter === tab.key
                      ? `${surfaceBg} ${titleColor}`
                      : `border ${isLight ? 'border-[#d9dde5] text-[#6b7280]' : 'border-[#2a2a2a] text-[#9a9a9a]'}`
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Link
              to="/products/new"
              className={`ml-auto inline-flex h-9 w-40 items-center justify-center rounded-md text-[13px] font-semibold ${isLight ? 'bg-[#00b851] text-[#f7f8fa]' : 'bg-[#00ff7a] text-[#0d0d0d]'}`}
            >
              + Add Product
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner message="Loading products..." />
          ) : inventoryProducts.length === 0 ? (
            <div className={`mt-4 rounded-xl border p-8 text-center ${cardBg}`}>
              <p className={`${titleColor}`}>No inventory items found for this filter.</p>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <div className={`hidden min-w-[980px] grid-cols-[300px_120px_140px_120px_80px_92px_100px] rounded-lg px-4 py-4 text-[10px] font-bold md:grid ${isLight ? 'bg-[#eef0f4] text-[#6b7280]' : 'bg-[#222] text-[#9a9a9a]'}`}>
                {['PRODUCT', 'SKU', 'CATEGORY', 'PRICE', 'STOCK', 'STATUS', ''].map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>
              <div className="mt-2 min-w-[980px] space-y-2">
                {inventoryProducts.map((product) => (
                  <div key={product.id} className={`grid grid-cols-[300px_120px_140px_120px_80px_92px_100px] items-center rounded-lg border px-4 py-2 ${cardBg}`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-md text-[9px] ${surfaceBg} ${subColor}`}>IMG</div>
                      <span className={`truncate text-[13px] font-semibold ${titleColor}`}>{product.title}</span>
                    </div>
                    <span className={`text-xs ${subColor}`}>{product.id.slice(0, 10).toUpperCase()}</span>
                    <span className={`text-xs ${subColor}`}>{categoryLabel(product.category)}</span>
                    <span className={`text-[13px] font-semibold ${accent}`}>{formatPrice(product.price)}</span>
                    <span className={`text-[13px] font-semibold ${product.stock === 0 ? 'text-[#ff5959]' : titleColor}`}>{product.stock}</span>
                    <span className={`inline-flex h-[22px] w-[88px] items-center justify-center rounded border text-[9px] font-bold ${statusBadge(product.stock)}`}>
                      {statusLabel(product.stock)}
                    </span>
                    <span className={`pl-8 text-[16px] font-bold ${subColor}`}>...</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
