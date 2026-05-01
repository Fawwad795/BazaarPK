import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

const TRACK_SHORTCUT_FLAG_KEY = 'bazaarpk-track-shortcut-enabled';

export function enableBuyerTrackShortcut() {
  localStorage.setItem(TRACK_SHORTCUT_FLAG_KEY, 'true');
}

export default function BuyerTrackShortcut() {
  const { isDarkMode } = useThemeStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setIsEnabled(localStorage.getItem(TRACK_SHORTCUT_FLAG_KEY) === 'true');
    const handleStorage = () => {
      setIsEnabled(localStorage.getItem(TRACK_SHORTCUT_FLAG_KEY) === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 220);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isEnabled) return null;

  const isLight = !isDarkMode;

  return (
    <Link
      to="/account"
      aria-label="Track order"
      className={`fixed right-4 top-[64px] z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-all duration-300 ${
        isVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none -translate-y-2 scale-90 opacity-0'
      } ${
        isLight
          ? 'border-[#d9dde5] bg-[#111827] text-[#00ff7a]'
          : 'border-[#2a2a2a] bg-[#222] text-[#00ff7a]'
      }`}
    >
      <PackageCheck className="h-5 w-5" />
    </Link>
  );
}
