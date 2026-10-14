import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, ClipboardList, BookOpen, Users, LogOut,
  Search, Eye, Trash2, Edit3, X, Loader2, AlertCircle, Phone,
  Calendar, TrendingUp, CheckCircle, Clock, Plus, Save
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { navigate } from '@/lib/router';
import { LogoMark } from '@/components/LogoMark';
import type { EnrollmentRequest, Course, Teacher, EnrollmentStatus } from '@/types';
import { STATUS_COLORS, DIFFICULTY_COLORS } from '@/types';

type Tab = 'overview' | 'enrollments' | 'courses' | 'teachers';

export default function AdminDashboardPage() {
  const { t } = useApp();
  const { session, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    if (!loading && !session) {
      navigate('/admin');
    }
  }, [session, loading]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: t.admin.overview, icon: LayoutDashboard },
    { id: 'enrollments', label: t.admin.enrollments, icon: ClipboardList },
    { id: 'courses', label: t.admin.courses, icon: BookOpen },
    { id: 'teachers', label: t.admin.teachers, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col lg:flex-row">
      <aside className="lg:w-64 gradient-navy text-white flex-shrink-0 lg:min-h-screen">
        <div className="p-5 flex items-center gap-2.5 border-b border-white/10">
          <LogoMark className="w-10 h-10" />
          <div>
            <div className="font-bold text-sm">Hashim School</div>
            <div className="text-xs text-blue-200">Admin panel</div>
          </div>
        </div>

        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                tab === tabItem.id
                  ? 'bg-white/15 text-white'
                  : 'text-blue-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tabItem.icon className="w-5 h-5 flex-shrink-0" />
              {tabItem.label}
            </button>
          ))}
        </nav>

        <div className="p-3 mt-auto border-t border-white/10 lg:absolute lg:bottom-0 lg:w-64">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-white/5 hover:text-white transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            {t.admin.logout}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        {tab === 'overview' && <OverviewTab />}
        {tab === 'enrollments' && <EnrollmentsTab />}
        {tab === 'courses' && <CoursesTab />}
        {tab === 'teachers' && <TeachersTab />}
      </main>
    </div>
  );
}

function OverviewTab() {
  const { t } = useApp();
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    newEnrollments: 0,
    confirmedEnrollments: 0,
    totalCourses: 0,
    totalTeachers: 0,
  });
  const [recent, setRecent] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('enrollment_requests').select('*'),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('teachers').select('*', { count: 'exact', head: true }),
    ]).then(([enrollments, courses, teachers]) => {
      const enrollData = enrollments.data ?? [];
      setStats({
        totalEnrollments: enrollData.length,
        newEnrollments: enrollData.filter((e) => e.status === 'yangi').length,
        confirmedEnrollments: enrollData.filter((e) => e.status === 'tasdiqlangan').length,
        totalCourses: courses.count ?? 0,
        totalTeachers: teachers.count ?? 0,
      });
      setRecent(enrollData.slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: t.admin.stats.total, value: stats.totalEnrollments, icon: ClipboardList, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
    { label: t.admin.stats.new, value: stats.newEnrollments, icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400' },
    { label: t.admin.stats.confirmed, value: stats.confirmedEnrollments, icon: CheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' },
    { label: t.admin.stats.courses, value: stats.totalCourses, icon: BookOpen, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400' },
    { label: t.admin.stats.teachers, value: stats.totalTeachers, icon: Users, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 dark:text-cyan-400' },
  ];

  const statusLabel = (s: EnrollmentStatus) => t.common.statusLabels[s];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.admin.dashboard}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white">{t.admin.recent}</h2>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        {recent.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">{t.admin.noEnrollments}</p>
        ) : (
          <div className="space-y-3">
            {recent.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">{e.full_name}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{new Date(e.created_at).toLocaleDateString('uz-UZ')}</div>
                </div>
                <span className={`badge ${STATUS_COLORS[e.status]}`}>
                  {statusLabel(e.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EnrollmentsTab() {
  const { t } = useApp();
  const [enrollments, setEnrollments] = useState<EnrollmentRequest[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<EnrollmentRequest | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      supabase.from('enrollment_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('courses').select('*'),
    ]).then(([enr, crs]) => {
      if (enr.error) setError(enr.error.message);
      setEnrollments(enr.data ?? []);
      setCourses(crs.data ?? []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const courseTitle = (id: string | null) => {
    if (!id) return '—';
    const c = courses.find((c) => c.id === id);
    return c?.title ?? '—';
  };

  const filtered = enrollments.filter((e) => {
    const matchesSearch =
      e.full_name.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, status: EnrollmentStatus) => {
    const { error } = await supabase.from('enrollment_requests').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) {
      setError(error.message);
      return;
    }
    loadData();
    setSelected((prev) => prev ? { ...prev, status } : null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.confirmDelete)) return;
    const { error } = await supabase.from('enrollment_requests').delete().eq('id', id);
    if (error) {
      setError(error.message);
      return;
    }
    setSelected(null);
    loadData();
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    const { error } = await supabase.from('enrollment_requests').update({ admin_notes: notes, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) {
      setError(error.message);
      return;
    }
    loadData();
    setSelected((prev) => prev ? { ...prev, admin_notes: notes } : null);
  };

  const statusLabel = (s: EnrollmentStatus) => t.common.statusLabels[s];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.admin.enrollmentsTitle}</h1>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.admin.searchPlaceholder}
            className="input-field pl-11"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'yangi', 'tasdiqlangan', 'boglanilgan', 'rad_etilgan'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
              }`}
            >
              {s === 'all' ? t.admin.all : t.common.statusLabels[s as EnrollmentStatus]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <ClipboardList className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">{t.admin.noResults}</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">{t.admin.tableHeaders.name}</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">{t.admin.tableHeaders.phone}</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">{t.admin.tableHeaders.course}</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">{t.admin.tableHeaders.date}</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">{t.admin.tableHeaders.status}</th>
                  <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">{t.admin.tableHeaders.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white text-sm">{e.full_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{e.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{courseTitle(e.course_id)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{new Date(e.created_at).toLocaleDateString('uz-UZ')}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLORS[e.status]}`}>
                        {statusLabel(e.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelected(e)} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(e.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filtered.map((e) => (
              <div key={e.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900 dark:text-white">{e.full_name}</div>
                  <span className={`badge ${STATUS_COLORS[e.status]}`}>
                    {statusLabel(e.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{e.phone}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mb-3">{courseTitle(e.course_id)} - {new Date(e.created_at).toLocaleDateString('uz-UZ')}</div>
                <div className="flex gap-2">
                  <button onClick={() => setSelected(e)} className="btn-secondary text-sm py-2 flex-1">
                    <Eye className="w-4 h-4" /> {t.admin.view}
                  </button>
                  <button onClick={() => handleDelete(e.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selected && (
        <EnrollmentDetail
          enrollment={selected}
          courseTitle={courseTitle(selected.course_id)}
          onClose={() => setSelected(null)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
          onSaveNotes={handleSaveNotes}
        />
      )}
    </div>
  );
}

function EnrollmentDetail({
  enrollment, courseTitle, onClose, onUpdateStatus, onDelete, onSaveNotes
}: {
  enrollment: EnrollmentRequest;
  courseTitle: string;
  onClose: () => void;
  onUpdateStatus: (id: string, status: EnrollmentStatus) => void;
  onDelete: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => void;
}) {
  const { t } = useApp();
  const [notes, setNotes] = useState(enrollment.admin_notes);

  const statuses: EnrollmentStatus[] = ['yangi', 'tasdiqlangan', 'boglanilgan', 'rad_etilgan'];
  const statusLabel = (s: EnrollmentStatus) => t.common.statusLabels[s];

  const detailItems = [
    { icon: Users, label: t.admin.student, value: enrollment.full_name },
    { icon: Phone, label: t.admin.phone, value: enrollment.phone },
    { icon: BookOpen, label: t.admin.course, value: courseTitle },
    { icon: Calendar, label: t.admin.date, value: new Date(enrollment.created_at).toLocaleString('uz-UZ') },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="gradient-navy px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{t.admin.detailTitle}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {detailItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{item.label}</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {enrollment.parent_name && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="text-gray-400 dark:text-gray-500">{t.admin.parent}</span> {enrollment.parent_name}
            </div>
          )}
          {enrollment.student_age && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="text-gray-400 dark:text-gray-500">{t.admin.age}</span> {enrollment.student_age}
            </div>
          )}
          {enrollment.notes && (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-gray-400 dark:text-gray-500 block mb-1">{t.admin.notesLabel}</span>
              {enrollment.notes}
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.admin.statusLabel}</label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdateStatus(enrollment.id, s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    enrollment.status === s
                      ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-blue-300 dark:ring-offset-gray-900'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                >
                  {statusLabel(s)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.admin.adminNotes}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={t.admin.adminNotesPlaceholder}
              className="input-field resize-none"
            />
            <button
              onClick={() => onSaveNotes(enrollment.id, notes)}
              className="btn-secondary text-sm mt-2 py-2"
            >
              <Save className="w-4 h-4" />
              {t.admin.save}
            </button>
          </div>

          <button
            onClick={() => onDelete(enrollment.id)}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-medium flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {t.admin.deleteRequest}
          </button>
        </div>
      </div>
    </div>
  );
}

function CoursesTab() {
  const { t } = useApp();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Course | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    supabase.from('courses').select('*').order('display_order').then(({ data, error }) => {
      if (error) setError(error.message);
      setCourses(data ?? []);
      setLoading(false);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.confirmDeleteCourse)) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) { setError(error.message); return; }
    load();
  };

  const handleToggleActive = async (course: Course) => {
    const { error } = await supabase.from('courses').update({ is_active: !course.is_active }).eq('id', course.id);
    if (error) { setError(error.message); return; }
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.admin.coursesTitle}</h1>
        <button onClick={() => setCreating(true)} className="btn-primary text-sm py-2.5">
          <Plus className="w-4 h-4" />
          {t.admin.newCourse}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <div key={c.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{c.title}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{c.slug}</p>
              </div>
              <button
                onClick={() => handleToggleActive(c)}
                className={`badge ${c.is_active ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}
              >
                {c.is_active ? t.admin.active : t.admin.inactive}
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{c.description}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
              <span>{t.common.categoryLabels[c.category] ?? c.category}</span>
              <span>{t.common.difficultyLabels[c.difficulty] ?? c.difficulty}</span>
              <span>{c.price_per_month.toLocaleString('uz-UZ')}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(c)} className="btn-secondary text-sm py-2 flex-1">
                <Edit3 className="w-4 h-4" /> {t.admin.edit}
              </button>
              <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(editing || creating) && (
        <CourseForm
          course={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); load(); }}
        />
      )}
    </div>
  );
}

function CourseForm({ course, onClose, onSaved }: { course: Course | null; onClose: () => void; onSaved: () => void }) {
  const { t } = useApp();
  const [form, setForm] = useState({
    slug: course?.slug ?? '',
    title: course?.title ?? '',
    description: course?.description ?? '',
    long_description: course?.long_description ?? '',
    icon_name: course?.icon_name ?? 'Code2',
    age_min: course?.age_min ?? 7,
    age_max: course?.age_max ?? 18,
    duration_weeks: course?.duration_weeks ?? 12,
    price_per_month: course?.price_per_month ?? 350000,
    category: course?.category ?? 'dasturlash',
    difficulty: course?.difficulty ?? 'boshlangich',
    display_order: course?.display_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSaving(true);
    setError('');

    const data = {
      ...form,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    };

    const result = course
      ? await supabase.from('courses').update(data).eq('id', course.id)
      : await supabase.from('courses').insert(data);

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }
    onSaved();
  };

  const categoryOptions = Object.entries(t.common.categoryLabels);
  const difficultyOptions = Object.entries(t.common.difficultyLabels);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="gradient-navy px-6 py-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">{course ? t.admin.courseForm.editTitle : t.admin.courseForm.newTitle}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.courseForm.title}</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.courseForm.slug}</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.courseForm.desc}</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.courseForm.longDesc}</label>
            <textarea value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} rows={4} className="input-field resize-none" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.courseForm.ageMin}</label>
              <input type="number" value={form.age_min} onChange={(e) => setForm({ ...form, age_min: Number(e.target.value) })} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.courseForm.ageMax}</label>
              <input type="number" value={form.age_max} onChange={(e) => setForm({ ...form, age_max: Number(e.target.value) })} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.courseForm.weeks}</label>
              <input type="number" value={form.duration_weeks} onChange={(e) => setForm({ ...form, duration_weeks: Number(e.target.value) })} required className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.courseForm.price}</label>
              <input type="number" value={form.price_per_month} onChange={(e) => setForm({ ...form, price_per_month: Number(e.target.value) })} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.courseForm.category}</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                {categoryOptions.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.courseForm.difficulty}</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="input-field">
                {difficultyOptions.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.courseForm.icon}</label>
              <input type="text" value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.courseForm.order}</label>
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="input-field" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">{t.admin.cancel}</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {t.admin.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TeachersTab() {
  const { t } = useApp();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    supabase.from('teachers').select('*').order('display_order').then(({ data, error }) => {
      if (error) setError(error.message);
      setTeachers(data ?? []);
      setLoading(false);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.confirmDeleteTeacher)) return;
    const { error } = await supabase.from('teachers').delete().eq('id', id);
    if (error) { setError(error.message); return; }
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.admin.teachersTitle}</h1>
        <button onClick={() => setCreating(true)} className="btn-primary text-sm py-2.5">
          <Plus className="w-4 h-4" />
          {t.admin.newTeacher}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((t2) => (
          <div key={t2.id} className="card p-5">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl gradient-navy flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-white">{t2.full_name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white">{t2.full_name}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">{t2.specialty}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t2.experience_years} {t.teachersPage.yearsExp}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{t2.bio}</p>
            <div className="flex gap-2">
              <button onClick={() => setEditing(t2)} className="btn-secondary text-sm py-2 flex-1">
                <Edit3 className="w-4 h-4" /> {t.admin.edit}
              </button>
              <button onClick={() => handleDelete(t2.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(editing || creating) && (
        <TeacherForm
          teacher={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); load(); }}
        />
      )}
    </div>
  );
}

function TeacherForm({ teacher, onClose, onSaved }: { teacher: Teacher | null; onClose: () => void; onSaved: () => void }) {
  const { t } = useApp();
  const [form, setForm] = useState({
    full_name: teacher?.full_name ?? '',
    specialty: teacher?.specialty ?? '',
    bio: teacher?.bio ?? '',
    photo_url: teacher?.photo_url ?? '',
    experience_years: teacher?.experience_years ?? 1,
    display_order: teacher?.display_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSaving(true);
    setError('');

    const result = teacher
      ? await supabase.from('teachers').update(form).eq('id', teacher.id)
      : await supabase.from('teachers').insert(form);

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="gradient-navy px-6 py-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">{teacher ? t.admin.teacherForm.editTitle : t.admin.teacherForm.newTitle}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.teacherForm.fullName}</label>
            <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.teacherForm.specialty}</label>
            <input type="text" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} required className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.teacherForm.bio}</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} className="input-field resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.teacherForm.experience}</label>
              <input type="number" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.admin.teacherForm.order}</label>
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="input-field" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">{t.admin.cancel}</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {t.admin.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
