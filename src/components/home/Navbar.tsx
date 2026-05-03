'use client';

import { useState, useEffect } from 'react';
import { t, setLang, getLang } from '@/lib/text';

export default function Navbar() {
  const [lang, setLangState] = useState<'en' | 'de'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = getLang();
    setLangState(savedLang);
    setMounted(true);
  }, []);

  const changeLang = (l: 'en' | 'de') => {
    setLang(l);
    setLangState(l);
  };

  // ❗ مهم: منع hydration mismatch
  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="text-xl font-bold tracking-wide text-white">
          Fix<span className="text-blue-500">Xpert</span>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
          <a href="#devices">{t('devices_title', lang)}</a>
          <a href="#shop">{t('nav_shop', lang)}</a>
          <a href="#contact">{t('nav_contact', lang)}</a>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Language Switch */}
          <div className="flex bg-white/5 rounded-lg overflow-hidden border border-white/10">
            <button
              onClick={() => changeLang('en')}
              className={`px-3 py-1 text-xs ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-white/60'}`}
            >
              EN
            </button>
            <button
              onClick={() => changeLang('de')}
              className={`px-3 py-1 text-xs ${lang === 'de' ? 'bg-blue-600 text-white' : 'text-white/60'}`}
            >
              DE
            </button>
          </div>

          {/* CTA */}
          <a
            href="#devices"
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:scale-105 transition"
          >
            {t('nav_cta', lang)}
          </a>
        </div>
      </div>
    </header>
  );
}