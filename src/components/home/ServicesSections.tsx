'use client';

import React, { useEffect, useRef } from 'react';
import { t } from '@/lib/text';

const services = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </svg>
    ),
     titleKey: 'service_screen_title',
    descKey: 'service_screen_desc',
    price: 'from €49',
    tag: 'service_tag_popular',
    color: '#2563EB',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="11" rx="2" />
        <path d="M22 11h1v3h-1" />
        <path d="M7 11h10" />
        <circle cx="12" cy="12.5" r="1" fill="currentColor" />
      </svg>
    ),
  titleKey: 'service_battery_title',
    descKey: 'service_battery_desc',
    price: 'from €39',
    tag: null,
    color: '#38BDF8',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    titleKey: 'service_motherboard_title',
    descKey: 'service_motherboard_desc',
    price: 'from €89',
    tag: 'service_tag_advanced',
    color: '#818CF8',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
    titleKey: 'service_water_title',
    descKey: 'service_water_desc',
    price: 'from €69',
    tag: 'service_tag_emergency',
    color: '#34D399',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    titleKey: 'service_charging_port_title',
    descKey: 'service_charging_port_desc',
    price: 'from €29',
    tag: null,
    color: '#F59E0B',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
    titleKey: 'service_camera_title',
    descKey: 'service_camera_desc',
    price: 'from €45',
    tag: null,
    color: '#EC4899',
  },
];

export default function ServicesSection() {
  
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.service-card');
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.classList.add('scroll-reveal-visible');
              }, i * 80);
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
    <section id="services" className="py-24 relative" ref={sectionRef}>
      <div className="absolute inset-0 bg-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent font-mono mb-4 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5">
            {t('services_eyebrow')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-3">
            {t('services_title')}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">{t('services_sub')}</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <div
              key={i}
              className="service-card scroll-reveal-hidden group relative glass-panel rounded-2xl p-6 cursor-pointer transition-all duration-400 hover:-translate-y-1"
              style={{
                transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${service.color}20, 0 0 0 1px ${service.color}30`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '';
              }}
            >
              {/* Tag */}
              {service.tag && (
                <span
                  className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: `${service.color}20`, color: service.color }}
                >
                  {t(service.tag)}
                </span>
              )}

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${service.color}15`, color: service.color }}
              >
                {service.icon}
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">{t(service.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{t(service.descKey)}</p>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold" style={{ color: service.color }}>
                  {service.price}
                </span>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group/btn">
                  Details
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${service.color}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Pricing Note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            All repairs include a{' '}
            <span className="text-accent font-semibold">free diagnostic</span> and{' '}
            <span className="text-accent font-semibold">90-day warranty</span>.
            Final price confirmed before any work begins.
          </p>
        </div>
      </div>
    </section>
  );
}