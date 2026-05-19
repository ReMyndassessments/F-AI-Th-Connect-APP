import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CTA() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-500 via-blue-600 to-amber-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">{t.cta.heading}</h2>
        <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
          {t.cta.body}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={() => setLocation("/chat")}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all font-semibold text-lg shadow-lg"
          >
            {t.cta.btn1}
          </Button>
          <Button
            onClick={() => setLocation("/missions/register")}
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg"
          >
            {t.cta.btn2}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-blue-100 text-sm">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span>{t.cta.badge1}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span>{t.cta.badge2}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span>{t.cta.badge3}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
