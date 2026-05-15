import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const logoColors = [
  '#F1F1F1', '#2E2F32', '#F01820', '#3370C0',
  '#ECD800', '#1C753E', '#ED6120', '#604089', '#F6B3DD',
];

function LogoMark({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-3 gap-[2px] ${className}`}>
      {logoColors.map((color, i) => (
        <div
          key={i}
          className="w-[6px] h-[6px] rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: '工具首页' },
    { to: '/gallery', label: '示例画廊' },
    { to: '/guide', label: '颜色指南' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(255,248,240,0.95)] backdrop-blur-md border-b border-border-custom'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto w-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-bold text-text-primary tracking-tight">
            拼豆工坊
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative text-sm font-medium text-text-secondary hover:text-text-primary transition-colors group"
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-[2px] bg-brand-primary transition-all duration-200 ${
                  location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-bg-cream/98 backdrop-blur-md border-b border-border-custom md:hidden">
          <div className="px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-text-secondary hover:text-text-primary py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
