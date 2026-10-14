import { Target, Eye, Heart, Zap, Users, Award, BookOpen, Rocket, Lightbulb, Shield } from 'lucide-react';
import { navigate } from '@/lib/router';
import { useApp } from '@/contexts/AppContext';
import { GITHUB_GRADUATE_IMAGES } from '@/data/githubContent';

export default function AboutPage() {
  const { t } = useApp();

  const missionVision = [
    { icon: Target, title: t.aboutPage.missionTitle, desc: t.aboutPage.missionDesc },
    { icon: Eye, title: t.aboutPage.visionTitle, desc: t.aboutPage.visionDesc },
    { icon: Heart, title: t.aboutPage.valuesTitle, desc: t.aboutPage.valuesDesc },
  ];

  const stats = [
    { icon: Users, value: '500+', label: t.aboutPage.stats.graduates },
    { icon: BookOpen, value: '8', label: t.aboutPage.stats.courses },
    { icon: Award, value: '5+', label: t.aboutPage.stats.teachers },
    { icon: Rocket, value: '100+', label: t.aboutPage.stats.projects },
  ];

  const whyUs = [
    { icon: Zap, title: t.aboutPage.whyUs.equipment.title, desc: t.aboutPage.whyUs.equipment.desc },
    { icon: Lightbulb, title: t.aboutPage.whyUs.practical.title, desc: t.aboutPage.whyUs.practical.desc },
    { icon: Users, title: t.aboutPage.whyUs.smallGroups.title, desc: t.aboutPage.whyUs.smallGroups.desc },
    { icon: Shield, title: t.aboutPage.whyUs.safe.title, desc: t.aboutPage.whyUs.safe.desc },
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="gradient-navy text-white py-12 md:py-16">
        <div className="container-page">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.aboutPage.title}</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            {t.aboutPage.subtitle}
          </p>
        </div>
      </div>

      <div className="container-page py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title mb-6">{t.aboutPage.storyTitle}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            {t.aboutPage.storyP1}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mt-4">
            {t.aboutPage.storyP2}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {missionVision.map((item) => (
            <div key={item.title} className="card p-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <item.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="gradient-navy rounded-3xl p-8 md:p-12 text-white mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <s.icon className="w-5 h-5 text-amber-300" />
                  <span className="text-3xl md:text-4xl font-bold">{s.value}</span>
                </div>
                <div className="text-sm text-blue-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="section-title text-center mb-10">{t.aboutPage.whyUsTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyUs.map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-5 card card-hover">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="section-title">Bizning bitiruvchilarimiz</h2>
            <p className="section-subtitle mx-auto">Hashim School bitiruvchilarining yorqin lahzalari va natijalari</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {GITHUB_GRADUATE_IMAGES.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`Hashim School bitiruvchisi ${index + 1}`}
                className="aspect-square w-full rounded-xl object-cover shadow-sm hover:scale-[1.03] transition-transform"
                loading="lazy"
              />
            ))}
          </div>
        </section>

        <div className="text-center">
          <h2 className="section-title mb-4">{t.aboutPage.joinTitle}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-6 max-w-xl mx-auto">
            {t.aboutPage.joinDesc}
          </p>
          <button onClick={() => navigate('/boglanish')} className="btn-primary">
            {t.aboutPage.contactBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
