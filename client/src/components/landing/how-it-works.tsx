import { Check } from "lucide-react";

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
            <div>
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
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400" 
                alt="Bible study group in peaceful discussion" 
                className="rounded-xl shadow-lg w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
