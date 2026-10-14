import { useEffect, useState } from 'react';
import { Cpu, AlertCircle, Loader2, Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import type { Project } from '@/types';

export default function ProjectsPage() {
  const { t } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('display_order')
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setProjects(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="gradient-navy text-white py-12 md:py-16">
        <div className="container-page">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.projectsPage.title}</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            {t.projectsPage.subtitle}
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
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">{t.projectsPage.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div key={p.id} className="card card-hover overflow-hidden group">
                <div className="h-56 gradient-navy flex items-center justify-center relative overflow-hidden">
                  <Cpu className="w-14 h-14 text-white/20 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="badge bg-white/20 text-white border-white/30 uppercase tracking-wide text-xs">
                      {p.course_slug.replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{p.title}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">{p.student_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
