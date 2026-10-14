import { Phone, MapPin, Mail, Clock, Facebook, Instagram, Youtube, Send } from 'lucide-react';
import { navigate } from '@/lib/router';
import { useApp } from '@/contexts/AppContext';
import { LogoMark } from '@/components/LogoMark';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20 dark:bg-black">
      <div className="container-page py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <LogoMark className="w-10 h-10 text-white" />
              <div>
                <div className="text-lg font-extrabold tracking-tight text-white">{t.brand.name.toUpperCase()}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t.footer.desc}
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors" aria-label="Youtube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors" aria-label="Telegram">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.pages}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => navigate('/')} className="hover:text-blue-400 transition-colors">{t.nav.home}</button></li>
              <li><button onClick={() => navigate('/kurslar')} className="hover:text-blue-400 transition-colors">{t.nav.courses}</button></li>
              <li><button onClick={() => navigate('/oqituvchilar')} className="hover:text-blue-400 transition-colors">{t.nav.teachers}</button></li>
              <li><button onClick={() => navigate('/biz-haqimizda')} className="hover:text-blue-400 transition-colors">{t.nav.about}</button></li>
              <li><button onClick={() => navigate('/savol-javob')} className="hover:text-blue-400 transition-colors">{t.nav.faq}</button></li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.courses}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => navigate('/kurslar/kompyuter-savodxonligi')} className="hover:text-blue-400 transition-colors">Kompyuter Savodxonligi</button></li>
              <li><button onClick={() => navigate('/kurslar/python')} className="hover:text-blue-400 transition-colors">Python Dasturlash</button></li>
              <li><button onClick={() => navigate('/kurslar/arduino')} className="hover:text-blue-400 transition-colors">Arduino Robototexnika</button></li>
              <li><button onClick={() => navigate('/kurslar/wedo')} className="hover:text-blue-400 transition-colors">WeDo Robotics</button></li>
              <li><button onClick={() => navigate('/kurslar/mbot2')} className="hover:text-blue-400 transition-colors">mBot 2</button></li>
              <li><button onClick={() => navigate('/kurslar/3d-dizayn')} className="hover:text-blue-400 transition-colors">3D Dizayn</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.contact}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.contactPage.values.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.contactPage.values.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.contactPage.values.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.contactPage.values.hoursShort}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            (c) 2026 {t.brand.name}. {t.footer.rights}
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="text-sm text-gray-600 hover:text-blue-400 transition-colors"
          >
            {t.footer.adminLogin}
          </button>
        </div>
      </div>
    </footer>
  );
}
