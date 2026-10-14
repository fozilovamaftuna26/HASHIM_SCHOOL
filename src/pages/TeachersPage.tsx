import { useEffect, useState } from 'react';
import { GraduationCap, AlertCircle, Loader2, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import type { Teacher } from '@/types';
import { GITHUB_TEACHERS } from '@/data/githubContent';

export default function TeachersPage() {
  const { t } = useApp();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('teachers')
      .select('*')
      .order('display_order')
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setTeachers(data?.length ? data : GITHUB_TEACHERS);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="gradient-navy text-white py-12 md:py-16">
        <div className="container-page">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.teachersPage.title}</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            {t.teachersPage.subtitle}
          </p>
        </div>
      </div>

      <div className="container-page py-10 md:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">{t.teachersPage.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((t2) => (
              <div key={t2.id} className="card card-hover p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={t2.photo_url}
                    alt={t2.full_name}
                    className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 bg-blue-100"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t2.full_name}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-0.5">{t2.specialty}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{t2.bio}</p>
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t2.experience_years} {t.teachersPage.yearsExp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
