import { useRoute, parseRoute } from '@/lib/router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import CoursesPage from '@/pages/CoursesPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import TeachersPage from '@/pages/TeachersPage';
import ProjectsPage from '@/pages/ProjectsPage';
import AboutPage from '@/pages/AboutPage';
import FaqPage from '@/pages/FaqPage';
import ContactPage from '@/pages/ContactPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import { navigate } from '@/lib/router';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

function AppRoutes() {
  const path = useRoute();
  const { page, param } = parseRoute(path);
  const { session, loading } = useAuth();

  // Admin route protection
  useEffect(() => {
    if (page === 'admin-dashboard' && !loading && !session) {
      navigate('/admin');
    }
  }, [page, loading, session]);

  // Admin pages: no public navbar/footer
  if (page === 'admin-login') {
    return <AdminLoginPage />;
  }

  if (page === 'admin-dashboard') {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      );
    }
    if (!session) return null;
    return <AdminDashboardPage />;
  }

  // Public pages with navbar + footer
  let content;
  switch (page) {
    case 'home':
      content = <HomePage />;
      break;
    case 'courses':
      content = <CoursesPage />;
      break;
    case 'course-detail':
      content = <CourseDetailPage slug={param!} />;
      break;
    case 'teachers':
      content = <TeachersPage />;
      break;
    case 'projects':
      content = <ProjectsPage />;
      break;
    case 'about':
      content = <AboutPage />;
      break;
    case 'faq':
      content = <FaqPage />;
      break;
    case 'contact':
      content = <ContactPage />;
      break;
    default:
      content = <HomePage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Navbar />
      <main className="flex-1">{content}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
