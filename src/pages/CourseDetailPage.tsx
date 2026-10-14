import { useEffect, useState } from 'react';
import {
  ArrowLeft, ChevronRight, Clock, Users, Wallet, BookOpen,
  Cpu, Code2, Bot, Wrench, Wifi, Box, Rocket, Monitor,
  CheckCircle, AlertCircle, Loader2, Zap, Target, Award
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { navigate } from '@/lib/router';
import { useApp } from '@/contexts/AppContext';
import type { Course } from '@/types';
import { DIFFICULTY_COLORS } from '@/types';
import EnrollmentForm from '@/components/EnrollmentForm';

const iconMap: Record<string, typeof Cpu> = {
  Monitor, Code2, Cpu, Bot, Wrench, Wifi, Box, Rocket,
};

export default function CourseDetailPage({ slug }: { slug: string }) {
  const { t } = useApp();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollOpen, setEnrollOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        setCourse(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="container-page py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container-page py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle className="w-9 h-9 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.courseDetail.notFound}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {error || t.courseDetail.notFoundDesc}
          </p>
          <button onClick={() => navigate('/kurslar')} className="btn-primary">
            <ArrowLeft className="w-5 h-5" />
            {t.courseDetail.back}
          </button>
        </div>
      </div>
    );
  }

  const Icon = iconMap[course.icon_name] ?? Cpu;
  const diffLabel = t.common.difficultyLabels[course.difficulty] ?? course.difficulty;
  const catLabel = t.common.categoryLabels[course.category] ?? course.category;

  const infoCards = [
    { icon: Target, label: t.courseDetail.ageRange, value: `${course.age_min} - ${course.age_max}` },
    { icon: Clock, label: t.courseDetail.durationLabel, value: `${course.duration_weeks} ${t.coursesPage.weeks}` },
    { icon: Award, label: t.courseDetail.certificate, value: t.courseDetail.atEnd },
  ];

  const sidebarInfo = [
    { icon: BookOpen, label: t.coursesPage.category, value: catLabel },
    { icon: Clock, label: t.courseDetail.durationLabel, value: `${course.duration_weeks} ${t.coursesPage.weeks}` },
    { icon: Users, label: t.courseDetail.group, value: t.courseDetail.groupSize },
    { icon: Wallet, label: t.courseDetail.payment, value: t.courseDetail.monthly },
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="gradient-navy text-white py-12 md:py-16">
        <div className="container-page">
          <button
            onClick={() => navigate('/kurslar')}
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.courseDetail.backToCourses}
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="badge bg-white/10 text-white border-white/20">
                  {catLabel}
                </span>
                <span className="badge bg-white/10 text-white border-white/20">
                  {diffLabel}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
              <p className="text-blue-100 text-lg max-w-2xl">{course.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.courseDetail.about}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {course.long_description}
              </p>
            </div>

            <div className="card p-6 md:p-8 mt-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.courseDetail.learn}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.courseDetail.learnItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {infoCards.map((item) => (
                <div key={item.label} className="card p-5 text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">{item.label}</div>
                  <div className="font-bold text-gray-900 dark:text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 lg:sticky lg:top-24">
              <div className="text-center pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {course.price_per_month.toLocaleString('uz-UZ')}
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">{t.courseDetail.perMonthLabel}</div>
              </div>

              <div className="space-y-3 py-6">
                {sidebarInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    <item.icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setEnrollOpen(true)}
                className="btn-primary w-full"
              >
                <Zap className="w-5 h-5" />
                {t.courseDetail.enrollBtn}
              </button>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
                {t.courseDetail.freeTrial}
              </p>
            </div>
          </div>
        </div>
      </div>

      <EnrollmentForm
        isOpen={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        courses={[course]}
        preselectedCourseId={course.id}
      />
    </div>
  );
}
