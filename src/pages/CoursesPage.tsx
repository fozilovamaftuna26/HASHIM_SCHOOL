import { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronRight, Cpu, Code2, Bot, Wrench, Wifi, Box, Rocket, Monitor, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { navigate } from '@/lib/router';
import { useApp } from '@/contexts/AppContext';
import type { Course } from '@/types';
import { DIFFICULTY_COLORS } from '@/types';
import EnrollmentForm from '@/components/EnrollmentForm';

const iconMap: Record<string, typeof Cpu> = {
  Monitor, Code2, Cpu, Bot, Wrench, Wifi, Box, Rocket,
};

export default function CoursesPage() {
  const { t } = useApp();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        setCourses(data ?? []);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(courses.map((c) => c.category)));
    return ['all', ...cats];
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || c.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [courses, search, category]);

  const handleEnroll = (courseId: string) => {
    setSelectedCourse(courseId);
    setEnrollOpen(true);
  };

  const catLabel = (cat: string) => cat === 'all' ? t.coursesPage.all : (t.common.categoryLabels[cat] ?? cat);
  const diffLabel = (diff: string) => t.common.difficultyLabels[diff] ?? diff;

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="gradient-navy text-white py-12 md:py-16">
        <div className="container-page">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.coursesPage.title}</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            {t.coursesPage.subtitle}
          </p>
        </div>
      </div>

      <div className="container-page py-8 md:py-10">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.coursesPage.searchPlaceholder}
              className="input-field pl-11"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <SlidersHorizontal className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {catLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 h-72 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t.coursesPage.notFound}</h3>
            <p className="text-gray-500 dark:text-gray-400">{t.coursesPage.notFoundDesc}</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{filtered.length} {t.coursesPage.results}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => {
                const Icon = iconMap[course.icon_name] ?? Cpu;
                return (
                  <div key={course.id} className="card card-hover overflow-hidden flex flex-col">
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className={`badge ${DIFFICULTY_COLORS[course.difficulty] ?? 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}>
                          {diffLabel(course.difficulty)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{course.description}</p>

                      <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 dark:text-gray-500">{t.coursesPage.age}</span>
                          <span className="font-medium">{course.age_min}-{course.age_max}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 dark:text-gray-500">{t.coursesPage.duration}</span>
                          <span className="font-medium">{course.duration_weeks} {t.coursesPage.weeks}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 dark:text-gray-500">{t.coursesPage.category}</span>
                          <span className="font-medium">{t.common.categoryLabels[course.category] ?? course.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6">
                      <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {course.price_per_month.toLocaleString('uz-UZ')}
                        </span>
                        <span className="text-sm text-gray-400 dark:text-gray-500">{t.home.perMonth}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/kurslar/${course.slug}`)}
                          className="btn-secondary flex-1 text-sm py-2.5"
                        >
                          {t.coursesPage.detail}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEnroll(course.id)}
                          className="btn-primary flex-1 text-sm py-2.5"
                        >
                          {t.coursesPage.enroll}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <EnrollmentForm
        isOpen={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        courses={courses}
        preselectedCourseId={selectedCourse}
      />
    </div>
  );
}
