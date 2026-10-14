import { useState, useEffect } from 'react';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { navigate } from '@/lib/router';
import { LogoMark } from '@/components/LogoMark';

export default function AdminLoginPage() {
  const { t } = useApp();
  const { signIn, session, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      navigate('/admin/dashboard');
    }
  }, [session, loading]);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitting(true);
    setError('');

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.admin.backHome}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
        <div className="text-center mb-8">
          <LogoMark className="w-16 h-16 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.admin.loginTitle}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t.admin.loginSubtitle}</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-5 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.email}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hashimschool.uz"
                required
                className="input-field pl-11"
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.password}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-field pl-11"
                disabled={submitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.admin.loggingIn}
              </>
            ) : (
              t.admin.loginBtn
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
