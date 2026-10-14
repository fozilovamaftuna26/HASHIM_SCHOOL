import { useState, useEffect } from 'react';
import { X, User, Phone, BookOpen, Loader2, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import type { Course } from '@/types';

interface EnrollmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  preselectedCourseId?: string | null;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function EnrollmentForm({ isOpen, onClose, courses, preselectedCourseId }: EnrollmentFormProps) {
  const { t } = useApp();
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    course_id: preselectedCourseId ?? '',
    parent_name: '',
    student_age: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (preselectedCourseId) {
      setForm((prev) => ({ ...prev, course_id: preselectedCourseId }));
    }
  }, [preselectedCourseId]);

  useEffect(() => {
    if (isOpen) {
      setState('idle');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = t.enroll.errors.nameReq;
    if (form.full_name.trim().length < 2) e.full_name = t.enroll.errors.nameShort;

    const phoneClean = form.phone.replace(/[\s\-()]/g, '');
    if (!phoneClean) e.phone = t.enroll.errors.phoneReq;
    else if (!/^\+?\d{9,13}$/.test(phoneClean)) e.phone = t.enroll.errors.phoneInvalid;

    if (!form.course_id) e.course_id = t.enroll.errors.courseReq;

    if (form.student_age && (isNaN(Number(form.student_age)) || Number(form.student_age) < 5 || Number(form.student_age) > 100)) {
      e.student_age = t.enroll.errors.ageRange;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setState('loading');
    setErrorMsg('');

    try {
      const { error } = await supabase.from('enrollment_requests').insert({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        course_id: form.course_id || null,
        parent_name: form.parent_name.trim() || '',
        student_age: form.student_age ? Number(form.student_age) : null,
        notes: form.notes.trim() || '',
      });

      if (error) throw error;

      setState('success');
      setForm({ full_name: '', phone: '', course_id: '', parent_name: '', student_age: '', notes: '' });
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error');
    }
  };

  const handleClose = () => {
    setState('idle');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        {state === 'success' ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-9 h-9 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.enroll.success}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t.enroll.successDesc}
            </p>
            <button onClick={handleClose} className="btn-primary w-full">
              {t.enroll.close}
            </button>
          </div>
        ) : (
          <>
            <div className="gradient-navy px-6 py-5 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{t.enroll.title}</h2>
                <p className="text-blue-200 text-sm mt-0.5">{t.enroll.subtitle}</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {state === 'error' && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t.enroll.studentName} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder={t.enroll.studentName}
                    className={`input-field pl-11 ${errors.full_name ? 'border-red-300 focus:ring-red-500' : ''}`}
                    disabled={state === 'loading'}
                  />
                </div>
                {errors.full_name && <p className="text-sm text-red-600 mt-1">{errors.full_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t.enroll.phone} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+998 90 123 45 67"
                    className={`input-field pl-11 ${errors.phone ? 'border-red-300 focus:ring-red-500' : ''}`}
                    disabled={state === 'loading'}
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t.enroll.selectCourse} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={form.course_id}
                    onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                    className={`input-field pl-11 appearance-none ${errors.course_id ? 'border-red-300 focus:ring-red-500' : ''}`}
                    disabled={state === 'loading'}
                  >
                    <option value="">{t.enroll.selectCoursePlaceholder}</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                {errors.course_id && <p className="text-sm text-red-600 mt-1">{errors.course_id}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t.enroll.parentName}
                  </label>
                  <input
                    type="text"
                    value={form.parent_name}
                    onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
                    placeholder={t.enroll.optional}
                    className="input-field"
                    disabled={state === 'loading'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t.enroll.age}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={form.student_age}
                      onChange={(e) => setForm({ ...form, student_age: e.target.value })}
                      placeholder={t.enroll.optional}
                      className={`input-field pl-11 ${errors.student_age ? 'border-red-300 focus:ring-red-500' : ''}`}
                      disabled={state === 'loading'}
                    />
                  </div>
                  {errors.student_age && <p className="text-sm text-red-600 mt-1">{errors.student_age}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t.enroll.notes}
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder={t.enroll.notesPlaceholder}
                  rows={3}
                  className="input-field resize-none"
                  disabled={state === 'loading'}
                />
              </div>

              <button
                type="submit"
                disabled={state === 'loading'}
                className="btn-primary w-full"
              >
                {state === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.enroll.submitting}
                  </>
                ) : (
                  t.enroll.submit
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                {t.enroll.privacy}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
