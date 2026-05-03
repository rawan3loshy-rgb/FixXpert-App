'use client';

import React, { useEffect, useRef } from 'react';
import { t } from '@/lib/text';


const pricingPlans = [
  {
        nameKey: 'pricing_screen_title',
    price: 'from €49',
    periodKey: 'pricing_per_device',
    highlight: false,
    color: '#2563EB',
    features: [
      'pricing_screen_feat1',
      'pricing_screen_feat2',
      'pricing_screen_feat3',
      'pricing_screen_feat4',
      'pricing_screen_feat5',
    ],
    ctaKey: 'pricing_screen_cta',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M9 7h6M9 11h4" />
      </svg>
    ),
  },
  {
    nameKey: 'pricing_complete_title',
    price: 'from €129',
    periodKey: 'pricing_per_device',
    highlight: true,
    color: '#38BDF8',
    features: [
      'pricing_complete_feat1',
      'pricing_complete_feat2',
      'pricing_complete_feat3',
      'pricing_complete_feat4',
      'pricing_complete_feat5',
      'pricing_complete_feat6',
    ],
    ctaKey: 'pricing_complete_cta',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    nameKey: 'pricing_motherboard_title',
    price: 'from €89',
    periodKey: 'pricing_per_device',
    highlight: false,
    color: '#818CF8',
    features: [
      'pricing_motherboard_feat1',
      'pricing_motherboard_feat2',
      'pricing_motherboard_feat3',
      'pricing_motherboard_feat4',
      'pricing_motherboard_feat5',
    ],
    ctaKey: 'pricing_motherboard_cta',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M7 7h10M7 12h10M7 17h6" />
        <circle cx="17" cy="17" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function PricingSection() {
  
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.pricing-card');
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.classList.add('scroll-reveal-visible');
              }, i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0A0B0F 0%, #0D1525 50%, #0A0B0F 100%)' }} />
      {/* Atmospheric glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full" style={{
        background: 'radial-gradient(ellipse, rgba(56,189,248,0.06) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent font-mono mb-4 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5">
            {t('pricing_eyebrow')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-3">
            {t('pricing_title')}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">{t('pricing_sub')}</p>
        </div>

        {/* BENTO GRID AUDIT — 3 cards, 3 columns */}
        {/* Row 1: [col-1: Screen cs-1] [col-2: Complete cs-1] [col-3: Motherboard cs-1] */}
        {/* Placed 3/3 ✓ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans?.map((plan, i) => (
            <div
              key={i}
              className={`pricing-card scroll-reveal-hidden relative rounded-3xl p-8 transition-all duration-400 group ${
                plan?.highlight
                  ? 'border-2' :'glass-panel'
              }`}
              style={
                plan?.highlight
                  ? {
                      background: `linear-gradient(145deg, ${plan?.color}18 0%, #111827 100%)`,
                      borderColor: `${plan?.color}50`,
                      boxShadow: `0 0 60px ${plan?.color}20, 0 0 0 1px ${plan?.color}30`,
                    }
                  : {}
              }
            >
              {plan?.highlight && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white"
                  style={{ background: `linear-gradient(135deg, ${plan?.color}, #818CF8)` }}
                >
                  Most Popular
                </div>
              )}

              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${plan?.color}15`, color: plan?.color }}
              >
                {plan?.icon}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">{t(plan.nameKey)}</h3>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-extrabold text-foreground">{plan?.price}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-8">{t(plan.periodKey)}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm text-muted-foreground">
      
                  <svg
                   width="16"
                   height="16"
                    viewBox="0 0 24 24"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="2.5"
                   style={{ color: plan.color, flexShrink: 0 }}
                    >
                   <path d="M20 6L9 17l-5-5" />
                  </svg>

                  {t(feat)}
      
                 </li>
                 ))}
              </ul>

              {/* CTA */}
              <button
                className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  plan?.highlight
                    ? 'text-white hover:scale-[1.02]'
                    : 'border border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
                }`}
                style={
                  plan?.highlight
                    ? {
                        background: `linear-gradient(135deg, ${plan?.color}, #818CF8)`,
                        boxShadow: `0 0 20px ${plan?.color}30`,
                      }
                    : {}
                }
              >
                {t(plan.ctaKey)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}