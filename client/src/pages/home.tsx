import { useEffect } from "react";
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
import { Check } from "lucide-react";
import { trackPageView } from "@/hooks/useAnalytics";

const dGroupHighlights = [
  "CCF 4 W's PDF upload and sharing",
  "Study guides for 8 D-Group types",
  "Free video meeting rooms — no sign-in required",
  "Bible games to engage your group",
  "Sermon notes and PDF upload for study guide generation",
  "Missions Partner Program — get a public profile for your mission trip",
  "Mission and outreach study resources",
  "Equip your group to share their faith",
  "Works on any phone, tablet, or computer",
];

export default function Home() {
  useEffect(() => { trackPageView('home'); }, []);
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />

        {/* D-Group Community Banner */}
        <section className="py-14 bg-indigo-50 border-y border-indigo-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xl sm:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              F-AI-TH-Connect is built for D-Groups on mission — small, intentional communities not just studying the Word together, but going out to share it. Whether you lead a CCF cell group, a Bible study, or a team reaching the lost and unreached, every tool you need is here.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-left max-w-2xl mx-auto">
              {dGroupHighlights.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Memory Verse Banner */}
        <DailyVerseCard variant="banner" />

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
