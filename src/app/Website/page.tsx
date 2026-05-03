import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import DeviceSelectorSection from '@/components/home/DeviceSelectorSection';
import ServicesSection from '@/components/home/ServicesSections';
import PricingSection from '@/components/home/PricingSection';
import MailInSection from '@/components/home/MailInSection';
import ReviewSection from '@/components/home/ReviewsSection';

export default function WebsitePage() {
  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground pt-24">
        <HeroSection />
        <DeviceSelectorSection />
        <ServicesSection />
        <PricingSection />
        <MailInSection />
        <ReviewSection />
      </main>
    </>
  );
}