import { Book, Heart, Zap, Users, Lightbulb, Clock } from "lucide-react";

const features = [
  {
    icon: Book,
    title: "Biblical Wisdom",
    description: "Get Scripture-based answers to life's questions with relevant biblical passages and thoughtful interpretation.",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    icon: Heart,
    title: "Prayer Support",
    description: "Share your prayer requests and receive encouragement, guidance, and biblical prayers tailored to your needs.",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    icon: Zap,
    title: "Spiritual Growth",
    description: "Receive personalized guidance for deepening your faith and growing in your relationship with God.",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    icon: Users,
    title: "Christian Living",
    description: "Get practical advice for living out your faith in daily life, relationships, and challenging situations.",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    icon: Lightbulb,
    title: "Theological Insights",
    description: "Explore deeper theological questions with AI that understands Christian doctrine and biblical interpretation.",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access spiritual guidance anytime, day or night, whenever you need encouragement or biblical wisdom.",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Spiritual Guidance at Your Fingertips</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience AI-powered Christian wisdom that understands your journey and provides biblical insight for every question.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 touch-target mobile-tap"
            >
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
