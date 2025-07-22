import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import ChatDemo from "@/components/landing/chat-demo";
import HowItWorks from "@/components/landing/how-it-works";
import Testimonials from "@/components/landing/testimonials";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";
import AdvertisementDisplay from "@/components/ads/advertisement-display";
import DailyVerseCard from "@/components/daily-verse/daily-verse-card";
import SeasonalHero from "@/components/seasonal/seasonal-hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        
        {/* Daily Memory Verse Banner */}
        <DailyVerseCard variant="banner" />
        
        {/* Seasonal Hero Section */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Celebrating the Season</h2>
              <p className="text-gray-600">Experience the Christian calendar through beautiful, rotating seasonal themes</p>
            </div>
            <SeasonalHero className="h-64 md:h-80" />
          </div>
        </section>
        
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <AdvertisementDisplay placement="home_banner" />
        </div>
        
        <Features />
        <ChatDemo />
        <HowItWorks />
        
        {/* Daily Verse Card in Content */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Daily Spiritual Nourishment</h2>
              <p className="text-gray-600">Start each day with God's Word to guide your spiritual journey</p>
            </div>
            <DailyVerseCard />
          </div>
        </section>
        
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
