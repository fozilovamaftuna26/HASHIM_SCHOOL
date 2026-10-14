import { useState } from 'react';
import { Phone, MapPin, Mail, Clock, Send, Loader2, CheckCircle, AlertCircle, User, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';

export default function ContactPage() {
  const { t } = useApp();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t.contactPage.errors.nameReq;
    if (form.name.trim().length < 2) e.name = t.contactPage.errors.nameShort;
    const phoneClean = form.phone.replace(/[\s\-()]/g, '');
    if (!phoneClean) e.phone = t.contactPage.errors.phoneReq;
    else if (!/^\+?\d{9,13}$/.test(phoneClean)) e.phone = t.contactPage.errors.phoneInvalid;
    if (!form.message.trim()) e.message = t.contactPage.errors.messageReq;
    if (form.message.trim().length < 10) e.message = t.contactPage.errors.messageShort;
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
        full_name: form.name.trim(),
        phone: form.phone.trim(),
        notes: form.message.trim(),
      });
      if (error) throw error;
      setState('success');
      setForm({ name: '', phone: '', message: '' });
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error');
    }
  };

  const contactInfo = [
    { icon: Phone, label: t.contactPage.labels.phone, value: t.contactPage.values.phone, href: 'tel:+998901234567' },
    { icon: Mail, label: t.contactPage.labels.email, value: t.contactPage.values.email, href: 'mailto:info@hashimschool.uz' },
    { icon: MapPin, label: t.contactPage.labels.address, value: t.contactPage.values.address, href: null },
    { icon: Clock, label: t.contactPage.labels.hours, value: t.contactPage.values.hours, href: null },
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="gradient-navy text-white py-12 md:py-16">
        <div className="container-page">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.contactPage.title}</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            {t.contactPage.subtitle}
          </p>
        </div>
      </div>

      <div className="container-page py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact info */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t.contactPage.infoTitle}</h2>
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <div key={item.label} className="card p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <div className="font-semibold text-gray-900 dark:text-white">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="card mt-6 h-64 gradient-navy rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-blue-400 blur-3xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-cyan-400 blur-3xl" />
              </div>
              <div className="text-center relative">
                <MapPin className="w-12 h-12 text-white/40 mx-auto mb-2" />
                <p className="text-white/60 text-sm">{t.contactPage.values.address}</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.contactPage.formTitle}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t.contactPage.formDesc}</p>

              {state === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="w-9 h-9 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t.contactPage.success}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {t.contactPage.successDesc}
                  </p>
                  <button
                    onClick={() => setState('idle')}
                    className="btn-secondary"
                  >
                    {t.contactPage.newMessage}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {state === 'error' && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {t.contactPage.name} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t.contactPage.namePlaceholder}
                        className={`input-field pl-11 ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                        disabled={state === 'loading'}
                      />
                    </div>
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {t.contactPage.phone} <span className="text-red-500">*</span>
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
                      {t.contactPage.message} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={t.contactPage.messagePlaceholder}
                        rows={5}
                        className={`input-field pl-11 resize-none ${errors.message ? 'border-red-300 focus:ring-red-500' : ''}`}
                        disabled={state === 'loading'}
                      />
                    </div>
                    {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={state === 'loading'}
                    className="btn-primary w-full"
                  >
                    {state === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t.contactPage.sending}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t.contactPage.send}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
