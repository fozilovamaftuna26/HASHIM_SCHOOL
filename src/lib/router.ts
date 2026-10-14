import { useEffect, useState, useCallback } from 'react';

export function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}

export function useRoute() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => {
      setPath(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return path;
}

export function useNavigate() {
  return useCallback((path: string) => {
    navigate(path);
  }, []);
}

export function parseRoute(path: string): { page: string; param: string | null } {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const parts = clean.split('/').filter(Boolean);

  if (parts.length === 0) return { page: 'home', param: null };
  if (parts[0] === 'kurslar' && parts.length === 1) return { page: 'courses', param: null };
  if (parts[0] === 'kurslar' && parts.length === 2) return { page: 'course-detail', param: parts[1] };
  if (parts[0] === 'oqituvchilar') return { page: 'teachers', param: null };
  if (parts[0] === 'loyihalar') return { page: 'projects', param: null };
  if (parts[0] === 'biz-haqimizda') return { page: 'about', param: null };
  if (parts[0] === 'savol-javob') return { page: 'faq', param: null };
  if (parts[0] === 'boglanish') return { page: 'contact', param: null };
  if (parts[0] === 'admin' && parts.length === 1) return { page: 'admin-login', param: null };
  if (parts[0] === 'admin' && parts[1] === 'dashboard') return { page: 'admin-dashboard', param: null };

  return { page: 'home', param: null };
}
