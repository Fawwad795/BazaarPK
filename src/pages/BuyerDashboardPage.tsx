import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Search, Sun, Star } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/helpers';
import BuyerCartShortcut from '../components/BuyerCartShortcut';
import BuyerTrackShortcut from '../components/BuyerTrackShortcut';

export default function BuyerDashboardPage() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { products } = useProductStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Clothing', 'Handicrafts', 'Electronics', 'Home Decor', 'Jewelry', 'Spices'];
  const filters = ['All', 'Verified', 'Under Rs.1000', 'Rs.1k-5k', 'Free Delivery', 'New Arrivals', 'Top Rated'];

  const displayedProducts = useMemo(() => {
    const base = (products.length ? products : []).slice(0, 8);
    if (!base.length) {
      return [
        { id: 'p1', title: 'Embroidered Kurta', seller: { storeName: 'Lahore Fashion Co.' }, rating: 4.8, reviewCount: 128, price: 2450, originalPrice: 3200 },
        { id: 'p2', title: 'Handwoven Rug', seller: { storeName: 'Multan Handicrafts' }, rating: 4.9, reviewCount: 128, price: 8900, originalPrice: 12000 },
        { id: 'p3', title: 'Wireless Earbuds', seller: { storeName: 'TechHub Karachi' }, rating: 4.6, reviewCount: 128, price: 3499, originalPrice: 4999 },
        { id: 'p4', title: 'Silver Jhumka Set', seller: { storeName: 'Lahore Jewels' }, rating: 4.7, reviewCount: 128, price: 1850, originalPrice: 2500 },
        { id: 'p5', title: 'Truck Art Mug', seller: { storeName: 'Peshawar Crafts' }, rating: 4.5, reviewCount: 128, price: 750, originalPrice: 1000 },
        { id: 'p6', title: 'Sindhi Ajrak Shawl', seller: { storeName: 'Hyderabad Weavers' }, rating: 4.9, reviewCount: 128, price: 1950, originalPrice: 2800 },
        { id: 'p7', title: 'Brass Diya Set', seller: { storeName: 'Islamabad Traditions' }, rating: 4.4, reviewCount: 128, price: 1100, originalPrice: 1500 },
        { id: 'p8', title: 'Kashmiri Dry Fruits', seller: { storeName: 'Gilgit Organics' }, rating: 4.8, reviewCount: 128, price: 2299, originalPrice: 2999 },
      ];
    }
    return base;
  }, [products]);

  const visibleProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return displayedProducts;
    return displayedProducts.filter((product) => {
      const tags = Array.isArray((product as { tags?: string[] }).tags)
        ? ((product as { tags?: string[] }).tags as string[])
        : [];
      const category =
        typeof product.category === 'string'
          ? product.category
          : (product.category?.name ?? '');
      return (
        product.title.toLowerCase().includes(query) ||
        product.seller.storeName.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query) ||
        tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [displayedProducts, searchQuery]);

  const isLight = !isDarkMode;
  const shellBg = isLight ? 'bg-[#f7f8fa]' : 'bg-[#0d0d0d]';
  const navBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const cardBg = isLight ? 'bg-white border-[#d9dde5]' : 'bg-[#1a1a1a] border-[#2a2a2a]';
  const mutedBg = isLight ? 'bg-[#eef0f4] border-[#d9dde5]' : 'bg-[#222] border-[#2a2a2a]';
  const titleColor = isLight ? 'text-[#111827]' : 'text-white';
  const subColor = isLight ? 'text-[#6b7280]' : 'text-[#9a9a9a]';
  const faintColor = isLight ? 'text-[#9ca3af]' : 'text-[#444]';
  const accentText = isLight ? 'text-[#00b851]' : 'text-[#00ff7a]';
  const accentBg = isLight ? 'bg-[#00b851]' : 'bg-[#00ff7a]';
  const accentBtnText = isLight ? 'text-[#f7f8fa]' : 'text-[#0d0d0d]';

  return (
    <div className={`min-h-screen ${shellBg}`}>
      <BuyerCartShortcut />
      <BuyerTrackShortcut />
      <header className={`border ${navBg}`}>
        <div className="mx-auto flex h-[64px] w-full max-w-[1280px] items-center gap-3 px-4 sm:px-6">
          <p className={`text-[20px] font-bold ${accentText}`}>BazaarPK</p>
          <form
            className={`hidden h-10 flex-1 items-center rounded-lg border px-3 md:flex ${mutedBg}`}
            onSubmit={(event) => {
              event.preventDefault();
              navigate(`/products?query=${encodeURIComponent(searchQuery.trim())}`);
            }}
          >
            <Search className={`mr-2 h-4 w-4 ${faintColor}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products, sellers, categories..."
              className={`w-full bg-transparent text-[13px] outline-none ${titleColor} ${isLight ? 'placeholder:text-[#9ca3af]' : 'placeholder:text-[#575757]'}`}
            />
          </form>
          <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${mutedBg} ${accentText}`}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => navigate('/account')}
            className={`h-9 min-w-[76px] rounded-lg border px-3 text-[13px] ${mutedBg} ${titleColor}`}
          >
            {user?.name?.split(' ')[0] || 'Sara'}
          </button>
          <Link
            to="/cart"
            className={`inline-flex h-9 min-w-[88px] items-center justify-center rounded-lg px-3 text-[13px] font-semibold ${accentBg} ${accentBtnText}`}
          >
            Cart ({totalItems()})
          </Link>
          <Link
            to="/account"
            className={`inline-flex h-9 min-w-[108px] items-center justify-center rounded-lg border px-3 text-[13px] font-semibold ${mutedBg} ${titleColor}`}
          >
            Track Orders
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
        <section className={`rounded-2xl border p-7 ${cardBg}`}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className={`text-[32px] font-bold leading-none ${titleColor}`}>BazaarPK Festival</h1>
              <p className={`mt-3 text-[15px] ${subColor}`}>Honouring Pakistans craftsmanship -- up to 40 percent off on hand-picked collections.</p>
              <button type="button" className={`mt-6 h-11 w-40 rounded-lg text-[14px] font-semibold ${accentBg} ${accentBtnText}`}>Shop Now</button>
            </div>
            <div className={`flex h-[140px] w-full max-w-[320px] items-center justify-center rounded-xl ${mutedBg}`}>
              <p className={`text-[32px] font-bold ${accentText}`}>40% OFF</p>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className={`text-[18px] font-semibold ${titleColor}`}>Shop by Category</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {categories.map((cat) => (
              <button key={cat} type="button" className={`h-[100px] rounded-xl border text-[13px] font-medium ${cardBg} ${titleColor}`}>
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className={`text-[28px] font-semibold leading-none ${titleColor}`}>All Products</h2>
          <p className={`mt-2 text-[13px] ${subColor}`}>248 products</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.map((filter) => {
              const active = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`h-[34px] rounded-lg border px-4 text-[12px] font-medium ${
                    active ? `${accentBg} ${accentBtnText} border-transparent` : `${mutedBg} ${titleColor}`
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <article
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className={`cursor-pointer overflow-hidden rounded-xl border transition hover:-translate-y-0.5 ${cardBg}`}
              >
                <div className={`relative h-[180px] ${mutedBg}`}>
                  <span className={`absolute left-3 top-3 inline-flex h-[22px] w-20 items-center justify-center rounded text-[10px] font-bold ${accentBg} ${accentBtnText}`}>
                    VERIFIED
                  </span>
                  <div className={`flex h-full items-center justify-center text-[22px] font-medium ${faintColor}`}>IMG</div>
                </div>
                <div className="p-3">
                  <p className={`text-[14px] font-semibold ${titleColor}`}>{product.title}</p>
                  <p className={`mt-1 text-[11px] ${subColor}`}>{product.seller.storeName}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#ffd133]">
                    <Star className="h-3 w-3 fill-current" />
                    {product.rating} - {product.reviewCount} reviews
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <p className={`text-[15px] font-bold ${accentText}`}>{formatPrice(product.price)}</p>
                    <p className={`text-[12px] ${faintColor}`}>{formatPrice(product.originalPrice)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/products/${product.id}`);
                    }}
                    className={`mt-3 h-9 w-full rounded-md text-[12px] font-semibold ${accentBg} ${accentBtnText}`}
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
          {!visibleProducts.length && (
            <div className={`mt-4 rounded-xl border p-6 text-center text-[13px] ${cardBg} ${subColor}`}>
              No products match "{searchQuery}".
            </div>
          )}
        </section>
      </main>

      <footer className={`mt-8 border-t ${navBg}`}>
        <div className={`mx-auto h-[60px] max-w-[1280px] px-6 text-center text-[12px] leading-[60px] ${faintColor}`}>
          (c) 2026 BazaarPK -- Honouring Pakistans Craftsmanship
        </div>
      </footer>
    </div>
  );
}
