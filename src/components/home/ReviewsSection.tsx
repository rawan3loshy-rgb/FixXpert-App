'use client';

import React, { useState, useEffect, useRef } from 'react';
import { t } from '@/lib/text';
import AppImage from 'src/components/ui/AppImage';

const reviews = [
{
  name:  'review_1_name',
  location: 'review_1_location',
  rating: 5,
  date: 'review_1_date',
  device: 'review_1_device',
  quote: 'review_1_quote',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1bc179e3e-1763292482225.png",
  avatarAlt: 'Professional German man in his 30s with short brown hair, neutral background'
},
{
  name: 'review_2_name',
  location: 'review_2_location',
  rating: 5,
  date: 'review_2_date',
  device: 'review_2_device',
  quote: 'review_2_quote',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18dcf7862-1772562312913.png",
  avatarAlt: 'Young professional German woman smiling, light background'
},
{
  name:  'review_3_name',
  location: 'review_3_location',
  rating: 5,
  date: 'review_3_date',
  device: 'review_3_device',
  quote: 'review_3_quote',

  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_184e5f4b2-1763294080263.png",
  avatarAlt: 'Middle Eastern man in his 40s with dark hair, confident expression, neutral background'
},
{
  name: 'Sofia Kravchenko',
  location: 'Frankfurt, Germany',
  rating: 5,
  date: '01.05.2026',
  device: 'iPad Pro — Cracked Screen',
  quote: 'The bento-style online booking was so intuitive. Picked my iPad model, selected the issue, got a quote in minutes. Repair took one day. Incredibly professional team.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1532e4bc9-1772092408306.png",
  avatarAlt: 'Eastern European woman in her late 20s, professional attire, soft lighting'
},
{
  name: 'Thomas Richter',
  location: 'Cologne, Germany',
  rating: 4,
  date: '22.04.2026',
  device: 'Lenovo ThinkPad — Charging Port',
  quote: 'Quick turnaround and fair pricing. The charging port on my work laptop was completely dead. Fixed in under 2 hours while I waited. Highly recommend for professionals.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_158881ea8-1763293273803.png",
  avatarAlt: 'German man in his 50s, professional appearance, light background'
},
{
  name: 'Yuki Tanaka',
  location: 'Düsseldorf, Germany',
  rating: 5,
  date: '18.04.2026',
  device: 'Google Pixel 8 Pro — Motherboard Repair',
  quote: 'I was told by another shop my phone was beyond repair. RepairElite fixed a motherboard issue that seemed impossible. They called me before every step to explain costs. Transparent and brilliant.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1df1ce5d2-1763299752843.png",
  avatarAlt: 'Japanese woman in her early 30s, friendly expression, neutral background'
}];


function StarRating({ rating, size = 16 }: {rating: number;size?: number;}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) =>
      <svg
        key={star}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={star <= rating ? '#F59E0B' : 'none'}
        stroke="#F59E0B"
        strokeWidth="2">
        
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z" />
        </svg>
      )}
    </div>);

}

export default function ReviewsSection() {
  
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.review-card');
            items.forEach((item, i) => {
              setTimeout(() => item.classList.add('scroll-reveal-visible'), i * 80);
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
    <section id="reviews" className="py-24 relative overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0A0B0F 0%, #0A1020 50%, #0A0B0F 100%)' }} />

      {/* Glow */}
      <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full" style={{
        background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
        filter: 'blur(60px)'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent font-mono mb-4 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5">
            {t('reviews_eyebrow')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-3">
            {t('reviews_title')}
          </h2>

          {/* Aggregate stats */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <StarRating rating={5} size={20} />
            <span className="text-2xl font-extrabold text-foreground">4.9</span>
            <span className="text-muted-foreground text-sm">from 2,847 reviews</span>
          </div>
        </div>

        {/* Featured Review (large) */}
        <div className="glass-panel rounded-3xl p-8 sm:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }} />

          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
              {/* Quote mark */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="text-primary/20 mb-6">
                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
              </svg>

              <p className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed mb-8">
                &ldquo;{t(reviews[activeIndex].quote)}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/20 flex-shrink-0">
                  <AppImage
                    src={reviews[activeIndex].avatar}
                    alt={reviews[activeIndex].avatarAlt}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover" />
                  
                </div>
                <div>
                  <p className="font-bold text-foreground">{t(reviews[activeIndex].name)}</p>
                  <p className="text-xs text-muted-foreground">{t(reviews[activeIndex].location)}</p>
                  <p className="text-xs text-accent font-mono mt-0.5">{t(reviews[activeIndex].device)}</p>
                </div>
                <div className="ml-auto text-right">
                  <StarRating rating={reviews[activeIndex].rating} />
                  <p className="text-xs text-muted-foreground mt-1">{t(reviews[activeIndex].date)}</p>
                </div>
              </div>
            </div>

            {/* Review selector thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {reviews.map((review, i) =>
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`p-3 rounded-2xl text-left transition-all duration-300 ${
                i === activeIndex ?
                'bg-primary/15 border border-primary/30' : 'bg-muted/20 border border-transparent hover:bg-muted/40'}`
                }>
                
                  <div className="w-10 h-10 rounded-xl overflow-hidden mb-2">
                    <AppImage
                    src={review.avatar}
                    alt={review.avatarAlt}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover" />
                  
                  </div>
                  <p className="text-xs font-semibold text-foreground truncate">{t(review.name).split(' ')[0]}</p>
                  <StarRating rating={review.rating} size={10} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Review cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.slice(0, 3).map((review, i) =>
          <div
            key={i}
            className="review-card scroll-reveal-hidden glass-panel rounded-2xl p-6 group transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => setActiveIndex(i)}>
            
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <AppImage
                  src={review.avatar}
                  alt={review.avatarAlt}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover" />
                
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{t(review.name)}</p>
                  <p className="text-xs text-muted-foreground truncate">{t(review.location)}</p>
                </div>
                <StarRating rating={review.rating} size={12} />
              </div>
              <p className="text-xs font-mono text-accent mb-3 truncate">{t(review.device)}</p>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                &ldquo;{t(review.quote)}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground/60 mt-4 font-mono">{t(review.date)}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}