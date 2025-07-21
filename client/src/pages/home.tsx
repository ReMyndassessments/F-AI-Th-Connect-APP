import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import ChatDemo from "@/components/landing/chat-demo";
import HowItWorks from "@/components/landing/how-it-works";
import Testimonials from "@/components/landing/testimonials";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";
import AdvertisementDisplay from "@/components/ads/advertisement-display";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <AdvertisementDisplay placement="home_banner" />
        </div>
        <Features />
        <ChatDemo />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
