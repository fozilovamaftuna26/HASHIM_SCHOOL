import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { navigate, useRoute, parseRoute } from '@/lib/router';
import { useApp } from '@/contexts/AppContext';
import { LogoMark } from '@/components/LogoMark';
import type { Lang } from '@/i18n/translations';

export default function Navbar() {
  const path = useRoute();
  const { page } = parseRoute(path);
  const { t, theme, toggleTheme, lang, setLang } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.courses, path: '/kurslar' },
    { label: t.nav.teachers, path: '/oqituvchilar' },
    { label: t.nav.about, path: '/biz-haqimizda' },
    { label: t.nav.faq, path: '/savol-javob' },
    { label: t.nav.contact, path: '/boglanish' },
  ];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  const isActive = (itemPath: string) => {
    if (itemPath === '/') return page === 'home';
    return path.startsWith(itemPath);
  };

  const languages: { code: Lang; label: string }[] = [
    { code: 'uz', label: 'UZ' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-950/95 glass shadow-sm border-b border-gray-100 dark:border-gray-800'
            : 'bg-white dark:bg-gray-950'
        }`}
      >
        <div className="container-page">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 group"
            >
              <div className="group-hover:scale-105 transition-transform">
                <LogoMark className="w-10 h-10 text-[#102f58] dark:text-white" />
              </div>
              <div className="text-left">
                <div className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                  {t.brand.name.toUpperCase()}
                </div>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Language selector */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{lang.toUpperCase()}</span>
                </button>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                    <div className="absolute right-0 mt-2 z-20 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 min-w-[100px] animate-scale-in">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLang(l.code);
                            setLangOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                            lang === l.code
                              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              {/* CTA */}
              <button
                onClick={() => navigate('/boglanish')}
                className="hidden lg:flex btn-primary text-sm px-5 py-2.5"
              >
                {t.nav.enroll}
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 animate-fade-in">
            <nav className="container-page py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-gray-800'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => navigate('/boglanish')}
                className="btn-primary mt-3 w-full"
              >
                {t.nav.enroll}
              </button>
            </nav>
          </div>
        )}
      </header>
      <div className="h-16 md:h-18" />
    </>
  );
}
