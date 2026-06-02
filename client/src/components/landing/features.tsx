import { Upload, Video, Users, Gamepad2, FileText, MessageCircle, Globe, Clapperboard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const icons = [MessageCircle, FileText, Video, Upload, Users, Gamepad2, Globe, Clapperboard];
const bgColors = ["bg-blue-50", "bg-indigo-50", "bg-emerald-50", "bg-amber-50", "bg-purple-50", "bg-rose-50", "bg-teal-50", "bg-cyan-50"];
const iconColors = ["text-blue-500", "text-indigo-500", "text-emerald-500", "text-amber-500", "text-purple-500", "text-rose-500", "text-teal-500", "text-cyan-500"];

export default function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.features.heading}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.features.subtext}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {t.features.items.map((feature, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 touch-target mobile-tap flex flex-col"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 ${bgColors[index]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${iconColors[index]}`} />
                  </div>
                  {feature.badge && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${bgColors[index]} ${iconColors[index]}`}>
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed flex-1">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
