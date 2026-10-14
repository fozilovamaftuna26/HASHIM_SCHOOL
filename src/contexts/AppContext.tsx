import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Lang, type TranslationKeys } from '@/i18n/translations';

type Theme = 'light' | 'dark';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslationKeys;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem('hashim-theme') as Theme) || 'light';
  });

  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'uz';
    return (localStorage.getItem('hashim-lang') as Lang) || 'uz';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('hashim-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('hashim-lang', lang);
  }, [lang]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const setLang = (l: Lang) => setLangState(l);

  const t = translations[lang] as TranslationKeys;

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, setLang, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
