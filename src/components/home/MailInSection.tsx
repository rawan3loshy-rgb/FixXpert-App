'use client';

import React, { useEffect, useRef } from 'react';
import { t } from '@/lib/text';

const mailInSteps = [
  {
    number: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Request a Quote',
    desc: 'Fill out our online form with your device details. Get a transparent price estimate within 2 hours — no obligations.',
    color: '#2563EB',
  },
  {
    number: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 7.2A2.2 2.2 0 0 1 7.2 5h13.6A2.2 2.2 0 0 1 23 7.2v9.6A2.2 2.2 0 0 1 20.8 19H7.2A2.2 2.2 0 0 1 5 16.8z" />
        <path d="M1 9h4M1 15h4" />
        <path d="M5 12h18" />
      </svg>
    ),
    title: 'Pack & Ship',
    desc: 'Download our prepaid DHL shipping label. Pack your device securely and drop it at any DHL point — shipping is on us.',
    color: '#38BDF8',
  },
  {
    number: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: 'We Repair It',
    desc: 'Our certified technicians diagnose and repair your device. You receive real-time status updates via SMS and email.',
    color: '#818CF8',
  },
  {
    number: '04',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: 'Returned to You',
    desc: 'Device shipped back within 2–5 business days with 90-day warranty. Insured and tracked delivery to your door.',
    color: '#34D399',
  },
];

export default function MailInSection() {
  
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.mailin-card');
            items.forEach((item, i) => {
              setTimeout(() => item.classList.add('scroll-reveal-visible'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="mailin" className="py-24 relative overflow-hidden" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0A0B0F 0%, #0A1020 50%, #0A0B0F 100%)' }} />

      {/* Left glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full" style={{
        background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent font-mono mb-4 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5">
              {t('mailin_eyebrow')}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-3 mb-6">
              {t('mailin_title')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t('mailin_sub')}
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: '🔒', label: 'Insured Shipping' },
                { icon: '⚡', label: '2–5 Day Turnaround' },
                { icon: '✅', label: '90-Day Warranty' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl text-sm font-medium text-foreground"
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full" style={{
                background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
                filter: 'blur(30px)',
              }} />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-primary">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5" y="2" width="14" height="20" rx="2" />
                      <circle cx="12" cy="17" r="1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">iPhone 14 Pro Max</p>
                    <p className="text-xs text-muted-foreground">Screen Repair — Cracked display</p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-accent px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
                    In Transit
                  </span>
                </div>

                {/* Tracking steps */}
                <div className="space-y-4">
                  {[
                    { label: 'Quote Approved', time: '09:15', done: true },
                    { label: 'Shipped via DHL', time: '14:32', done: true },
                    { label: 'Received at Lab', time: '10:08', done: true },
                    { label: 'Repair in Progress', time: 'Now', done: false, active: true },
                    { label: 'Return Shipping', time: 'Pending', done: false },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.done
                          ? 'bg-primary'
                          : step.active
                          ? 'bg-accent/20 border-2 border-accent' :'bg-muted/40 border border-border'
                      }`}>
                        {step.done && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                        {step.active && (
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${step.done || step.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                      </div>
                      <span className={`text-xs font-mono ${step.active ? 'text-accent' : 'text-muted-foreground'}`}>
                        {step.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated completion</p>
                    <p className="text-sm font-bold text-foreground">Tomorrow, 06 May 2026</p>
                  </div>
                  <button className="text-xs font-semibold text-primary hover:text-accent transition-colors">
                    Track Order →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mailInSteps.map((step, i) => (
            <div
              key={i}
              className="mailin-card scroll-reveal-hidden relative glass-panel rounded-2xl p-6 group transition-all duration-300 hover:-translate-y-1"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 50px ${step.color}20, 0 0 0 1px ${step.color}25`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '';
              }}
            >
              {/* Step number */}
              <span
                className="text-5xl font-black opacity-10 absolute top-4 right-4 font-mono leading-none"
                style={{ color: step.color }}
              >
                {step.number}
              </span>

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${step.color}15`, color: step.color }}
              >
                {step.icon}
              </div>

              <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>

              {/* Connector line (not on last) */}
              {i < mailInSteps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-1/2 -right-2.5 w-5 h-px"
                  style={{ background: `linear-gradient(90deg, ${step.color}50, transparent)` }}
                />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#devices"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-2xl text-base transition-all duration-300 hover:scale-105"
            style={{ boxShadow: '0 0 30px rgba(37,99,235,0.35)' }}
          >
            {t('hero_cta_primary')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}