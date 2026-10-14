import { useEffect, useState } from 'react';
import { ChevronDown, AlertCircle, Loader2, HelpCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import type { FaqEntry } from '@/types';

export default function FaqPage() {
  const { t } = useApp();
  const [faqs, setFaqs] = useState<FaqEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    supabase
      .from('faq_entries')
      .select('*')
      .order('display_order')
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setFaqs(data ?? []);
        setLoading(false);
      });
  }, []);

  const categories = Array.from(new Set(faqs.map((f) => f.category)));
  const filtered = category === 'all' ? faqs : faqs.filter((f) => f.category === category);

  const categoryLabel = (cat: string) => t.faqPage.categories[cat as keyof typeof t.faqPage.categories] ?? cat;

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="gradient-navy text-white py-12 md:py-16">
        <div className="container-page">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.faqPage.title}</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            {t.faqPage.subtitle}
          </p>
        </div>
      </div>

      <div className="container-page py-10 md:py-12">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          ) : (
            <>
              {categories.length > 1 && (
                <div className="flex items-center gap-2 mb-8 justify-center">
                  <button
                    onClick={() => setCategory('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      category === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {t.faqPage.all}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        category === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {categoryLabel(cat)}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {filtered.map((faq) => (
                  <div
                    key={faq.id}
                    className={`card overflow-hidden transition-all duration-200 ${
                      openId === faq.id ? 'shadow-md border-blue-100 dark:border-blue-900' : ''
                    }`}
                  >
                    <button
                      onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                      className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white flex items-start gap-3">
                        <HelpCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${openId === faq.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                          openId === faq.id ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openId === faq.id ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="px-5 pb-4 pl-13">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-8">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">{t.faqPage.empty}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
