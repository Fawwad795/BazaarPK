import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useThemeStore } from '../store/themeStore';

export default function BuyerCartShortcut() {
  const { totalItems } = useCartStore();
  const { isDarkMode } = useThemeStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 220);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLight = !isDarkMode;

  return (
    <Link
      to="/cart"
      aria-label="Open cart"
      className={`fixed right-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-all duration-300 ${
        isVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none -translate-y-2 scale-90 opacity-0'
      } ${
        isLight
          ? 'border-[#d9dde5] bg-[#00b851] text-[#f7f8fa]'
          : 'border-[#2a2a2a] bg-[#00ff7a] text-[#0d0d0d]'
      }`}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems() > 0 && (
        <span
          className={`absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
            isLight ? 'bg-[#111827] text-white' : 'bg-[#111827] text-[#00ff7a]'
          }`}
        >
          {totalItems()}
        </span>
      )}
    </Link>
  );
}
