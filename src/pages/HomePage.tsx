import { useEffect, useState } from 'react';
import {
  Cpu, Code2, Bot, Wrench, Trophy, Users, ArrowRight, Star,
  Sparkles, Zap, Target, Award, BookOpen, ChevronRight, Rocket,
  Monitor, Wifi, Box
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { navigate } from '@/lib/router';
import { useApp } from '@/contexts/AppContext';
import type { Course, Teacher } from '@/types';
import { GITHUB_TEACHERS, GITHUB_GRADUATE_ROWS } from '@/data/githubContent';
import EnrollmentForm from '@/components/EnrollmentForm';

export default function HomePage() {
  const { t } = useApp();
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollOpen, setEnrollOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('courses').select('*').eq('is_active', true).order('display_order'),
      supabase.from('teachers').select('*').order('display_order').limit(4),
    ]).then(([c, t]) => {
      setCourses(c.data ?? []);
      setTeachers(t.data?.length ? t.data : GITHUB_TEACHERS.slice(0, 4));
      setLoading(false);
    });
  }, []);

  const iconMap: Record<string, typeof Cpu> = {
    Monitor, Code2, Cpu, Bot, Wrench, Wifi, Box, Rocket,
  };

  const features = [
    { icon: Target, title: t.home.features.practical.title, desc: t.home.features.practical.desc },
    { icon: Users, title: t.home.features.smallGroups.title, desc: t.home.features.smallGroups.desc },
    { icon: Award, title: t.home.features.certificates.title, desc: t.home.features.certificates.desc },
    { icon: Zap, title: t.home.features.equipment.title, desc: t.home.features.equipment.desc },
    { icon: Star, title: t.home.features.experienced.title, desc: t.home.features.experienced.desc },
    { icon: Rocket, title: t.home.features.innovative.title, desc: t.home.features.innovative.desc },
  ];

  const stats = [
    { icon: Users, value: '500+', label: t.home.stats.students },
    { icon: BookOpen, value: '8', label: t.home.stats.courses },
    { icon: Award, value: '5+', label: t.home.stats.teachers },
    { icon: Trophy, value: '100+', label: t.home.stats.projects },
  ];

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-cyan-400 blur-3xl" />
        </div>
        <div className="container-page relative py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.home.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance animate-slide-up">
              {t.home.heroTitle}{' '}
              <span className="text-blue-300">{t.home.heroTitleAccent}</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mt-6 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {t.home.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <button onClick={() => setEnrollOpen(true)} className="btn-gold text-base px-8 py-3.5">
                <Zap className="w-5 h-5" />
                {t.home.enrollNow}
              </button>
              <button onClick={() => navigate('/kurslar')} className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40">
                {t.home.viewCourses}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                    <stat.icon className="w-5 h-5 text-amber-300" />
                    <span className="text-2xl md:text-3xl font-bold">{stat.value}</span>
                  </div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-12 md:h-20" preserveAspectRatio="none">
            <path d="M0,30 C320,60 720,0 1440,30 L1440,60 L0,60 Z" className="fill-white dark:fill-gray-950" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="section-title">{t.home.whyUsTitle}</h2>
          <p className="section-subtitle mx-auto">
            {t.home.whyUsSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card card-hover p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="section-title">{t.home.coursesTitle}</h2>
              <p className="section-subtitle">
                {t.home.coursesSubtitle}
              </p>
            </div>
            <button onClick={() => navigate('/kurslar')} className="btn-secondary">
              {t.home.allCourses}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-6 h-64 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => {
                const Icon = iconMap[course.icon_name] ?? Cpu;
                return (
                  <button
                    key={course.id}
                    onClick={() => navigate(`/kurslar/${course.slug}`)}
                    className="card card-hover p-6 text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">{course.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{course.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 dark:text-gray-500">{course.age_min}-{course.age_max}</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {course.price_per_month.toLocaleString('uz-UZ')} {t.home.perMonth}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                      {t.home.more} <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Teachers preview */}
      <section className="container-page py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="section-title">{t.home.teachersTitle}</h2>
          <p className="section-subtitle mx-auto">
            {t.home.teachersSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((t2) => (
            <div key={t2.id} className="card card-hover p-6 text-center">
              <img
                src={t2.photo_url}
                alt={t2.full_name}
                className="w-20 h-20 mx-auto rounded-full object-cover bg-blue-100 mb-4"
                loading="lazy"
              />
              <h3 className="font-bold text-gray-900 dark:text-white">{t2.full_name}</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">{t2.specialty}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t2.experience_years} {t.home.yearsExp}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => navigate('/oqituvchilar')} className="btn-secondary">
            {t.home.allTeachers}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Graduates marquee */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 md:py-20 overflow-hidden">
        <div className="container-page mb-10">
          <div className="text-center">
            <h2 className="section-title">Bizning bitiruvchilarimiz</h2>
            <p className="section-subtitle mx-auto">
              Hashim School bitiruvchilarining yorqin lahzalari va natijalari
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {GITHUB_GRADUATE_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="marquee-container overflow-hidden">
              <div className={`marquee-track ${rowIndex % 2 === 1 ? 'reverse' : ''}`}>
                {[...row, ...row].map((src, i) => (
                  <img
                    key={`${rowIndex}-${i}`}
                    src={src}
                    alt={`Hashim School bitiruvchisi ${i + 1}`}
                    className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover flex-shrink-0 shadow-md"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16 md:py-20">
        <div className="gradient-navy rounded-3xl p-8 md:p-12 lg:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">{t.home.ctaTitle}</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
              {t.home.ctaDesc}
            </p>
            <button onClick={() => setEnrollOpen(true)} className="btn-gold text-base px-8 py-3.5">
              <Zap className="w-5 h-5" />
              {t.home.ctaButton}
            </button>
          </div>
        </div>
      </section>

      <EnrollmentForm
        isOpen={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        courses={courses}
      />
    </div>
  );
}
