'use client';

import React, { useEffect, useRef, useState } from 'react';
import { t } from '@/lib/text';

export default function HeroSection() {

  const heroRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<'en' | 'de'>('en');

   useEffect(() => {
  const l = localStorage.getItem('lang') as 'en' | 'de' || 'en';
  setLang(l);
   }, []);
  

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      

      if (phoneRef.current) {
        phoneRef.current.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg) translateY(-8px)`;
      }
      if (tabletRef.current) {
        tabletRef.current.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
      }
      if (laptopRef.current) {
        laptopRef.current.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg)`;
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', onMouseMove);
    }
    return () => {
      if (hero) hero.removeEventListener('mousemove', onMouseMove);
    };
  }, []);
  

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A0B0F 0%, #0D1B3E 50%, #0A0B0F 100%)' }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 animate-gradient" style={{
        background: 'linear-gradient(135deg, #0A0B0F 0%, #0D1B3E 30%, #0A1628 60%, #0A0B0F 100%)',
        backgroundSize: '400% 400%',
      }} />

      {/* Atmospheric orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-orb" style={{
        background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full animate-orb-delayed" style={{
        background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)',
        filter: 'blur(50px)',
      }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{
        background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 60%)',
        filter: 'blur(60px)',
      }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-start">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8"
              style={{ animation: 'slideUpFade 0.6s cubic-bezier(0.22,1,0.36,1) forwards' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-accent font-mono">
                {t('hero_eyebrow', lang)}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.9] mb-6"
              style={{ animation: 'slideUpFade 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}
            >
              <span className="text-foreground block">{t('hero_headline_1', lang)}</span>
              <span className="text-gradient block mt-2">{t('hero_headline_2', lang)}</span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10"
              style={{ animation: 'slideUpFade 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both' }}
            >
              {t('hero_sub', lang)}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14"
              style={{ animation: 'slideUpFade 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both' }}
            >
              <a
                href="#devices"
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl text-base transition-all duration-300 hover:scale-105 overflow-hidden"
                style={{ boxShadow: '0 0 30px rgba(37,99,235,0.4), 0 0 60px rgba(37,99,235,0.2)' }}
              >
                <span className="relative z-10">{t('hero_cta_primary', lang)}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a
                href="#shop"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-border text-foreground font-semibold rounded-2xl text-base transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:scale-105"
              >
                {t('hero_cta_secondary', lang)}
              </a>
            </div>

            {/* Stats */}
            <div
              className="flex flex-wrap gap-6 justify-center lg:justify-start"
              style={{ animation: 'slideUpFade 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s both' }}
            >
              {[
                { value: t('hero_stat_1', lang), label: t('hero_stat_1_label', lang) },
                { value: t('hero_stat_2', lang), label: t('hero_stat_2_label', lang) },
                { value: t('hero_stat_3', lang), label: t('hero_stat_3_label', lang) },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-start">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Device Mockups */}
          <div
            className="relative h-[400px] sm:h-[500px] lg:h-[600px]"
            style={{ animation: 'fadeIn 1s ease 0.3s both' }}
          >
            {/* Laptop */}
            <div
              ref={laptopRef}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 sm:w-80 device-float-slow"
              style={{ transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d' }}
            >
              {/* Laptop body */}
              <div className="relative">
                {/* Screen */}
                <div
                  className="w-full h-44 sm:h-52 rounded-t-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                    boxShadow: '0 0 40px rgba(37,99,235,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                    border: '1px solid rgba(56,189,248,0.2)',
                  }}
                >
                  {/* Screen content */}
                  <div className="absolute inset-2 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
                    <div className="p-3">
                      <div className="flex gap-1.5 mb-3">
                        <div className="w-2 h-2 rounded-full bg-red-500/70" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                        <div className="w-2 h-2 rounded-full bg-green-500/70" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-1.5 w-3/4 rounded bg-primary/40" />
                        <div className="h-1.5 w-1/2 rounded bg-accent/30" />
                        <div className="h-1.5 w-2/3 rounded bg-primary/20" />
                        <div className="h-1.5 w-4/5 rounded bg-accent/20" />
                        <div className="h-1.5 w-1/3 rounded bg-primary/30" />
                      </div>
                    </div>
                    {/* Glow on screen */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
                  </div>
                  {/* Camera */}
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                </div>
                {/* Base */}
                <div
                  className="w-full h-4 rounded-b-sm"
                  style={{
                    background: 'linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 100%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  }}
                />
                <div
                  className="w-full h-3 rounded-sm mx-auto"
                  style={{
                    background: 'linear-gradient(180deg, #1a1a2e 0%, #141424 100%)',
                    width: '110%',
                    marginLeft: '-5%',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                  }}
                />
              </div>
            </div>

            {/* Tablet */}
            <div
              ref={tabletRef}
              className="absolute top-8 right-4 sm:right-8 w-32 sm:w-40 device-float-delayed"
              style={{ transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d' }}
            >
              <div
                className="w-full rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                  boxShadow: '0 20px 60px rgba(37,99,235,0.25), 0 0 0 1px rgba(56,189,248,0.15)',
                  aspectRatio: '3/4',
                }}
              >
                <div className="w-full h-full p-2 relative">
                  <div className="w-full h-full rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
                    <div className="p-2">
                      <div className="w-full h-16 rounded-lg bg-primary/20 mb-2 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-primary/40" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded bg-muted-foreground/20" />
                        <div className="h-1 w-3/4 rounded bg-muted-foreground/15" />
                        <div className="h-1 w-1/2 rounded bg-muted-foreground/10" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
                  </div>
                  {/* Home button */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-muted-foreground/30" />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div
              ref={phoneRef}
              className="absolute top-12 left-4 sm:left-8 w-20 sm:w-24 device-float"
              style={{ transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d' }}
            >
              <div
                className="w-full rounded-3xl overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #1e1e2e 0%, #16213e 100%)',
                  boxShadow: '0 20px 60px rgba(56,189,248,0.2), 0 0 0 1px rgba(56,189,248,0.2)',
                  aspectRatio: '9/19',
                }}
              >
                <div className="w-full h-full p-1.5 relative">
                  <div className="w-full h-full rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
                    {/* Dynamic island */}
                    <div className="flex justify-center pt-2 mb-2">
                      <div className="w-12 h-3 rounded-full bg-black" />
                    </div>
                    <div className="px-2 space-y-1.5">
                      <div className="h-8 w-full rounded-xl bg-primary/20" />
                      <div className="grid grid-cols-2 gap-1">
                        <div className="h-8 rounded-lg bg-accent/15" />
                        <div className="h-8 rounded-lg bg-primary/15" />
                      </div>
                      <div className="h-6 w-full rounded-lg bg-muted/30" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10" />
                  </div>
                  {/* Side buttons */}
                </div>
              </div>
            </div>

            {/* Glow beneath devices */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-8 rounded-full" style={{
              background: 'radial-gradient(ellipse, rgba(37,99,235,0.4) 0%, transparent 70%)',
              filter: 'blur(10px)',
            }} />

            {/* Floating badge */}
            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-full text-xs font-semibold text-accent font-mono"
              style={{ animation: 'slideUpFade 1s cubic-bezier(0.22,1,0.36,1) 0.6s both' }}
            >
              ✦ {t('hero_stat_4', lang)}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
        <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent" />
      </div>
    </section>
  );
}