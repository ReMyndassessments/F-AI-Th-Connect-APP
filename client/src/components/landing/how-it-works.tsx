import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { MonthlyPhoto } from "@shared/schema";

const steps = [
  {
    number: 1,
    title: "Share Your Heart",
    description: "Open up about your spiritual questions, prayer requests, or life challenges. F-AI-TH-Connect listens with understanding and compassion."
  },
  {
    number: 2,
    title: "Receive Biblical Wisdom",
    description: "Get thoughtful responses grounded in Scripture, theological understanding, and Christian tradition, powered by advanced AI."
  },
  {
    number: 3,
    title: "Grow in Faith",
    description: "Apply the guidance to your life, deepen your relationship with God, and continue the conversation as your spiritual journey evolves."
  }
];

const features = [
  "Theologically accurate responses",
  "Contextual Scripture references",
  "Personalized spiritual guidance",
  "Secure and private conversations"
];

export default function HowItWorks() {
  // Fetch current month's secondary photo automatically
  const { data: monthlySecondaryPhoto, isLoading: secondaryPhotoLoading } = useQuery<MonthlyPhoto>({
    queryKey: ["/api/monthly-photos/current-secondary"],
    retry: false,
  });

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How F-AI-TH-Connect Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of AI combined with biblical wisdom in three simple steps.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Powered by Advanced AI Technology</h3>
              <p className="text-gray-600 mb-6">
                F-AI-TH-Connect utilizes Deepseek AI's sophisticated language models, specifically trained on Christian theological knowledge, biblical studies, and pastoral care principles.
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              {/* Monthly Themed Secondary Photo Display */}
              {secondaryPhotoLoading ? (
                <div className="rounded-xl shadow-lg w-full h-80 bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-pulse bg-blue-200 w-12 h-12 rounded-full mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm">Loading ministry photo...</p>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <img 
                    src={monthlySecondaryPhoto?.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop"} 
                    alt={monthlySecondaryPhoto?.altText || "Bible study group in peaceful discussion"} 
                    className="rounded-xl shadow-lg w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  
                  {/* Monthly Theme Overlay for Secondary Photo */}
                  {monthlySecondaryPhoto && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                      <div className="text-center text-white p-6">
                        <h4 className="font-bold text-lg mb-2">{monthlySecondaryPhoto.title}</h4>
                        <p className="text-sm mb-3 opacity-90">{monthlySecondaryPhoto.description}</p>
                        <div className="flex items-center justify-center space-x-3">
                          <span className="text-xs font-medium px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                            {monthlySecondaryPhoto.theme}
                          </span>
                          <span className="text-xs opacity-75">
                            {new Date().toLocaleDateString('en-US', { month: 'long' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
