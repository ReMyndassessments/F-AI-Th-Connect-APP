import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "College Student",
    initials: "SM",
    text: "F-AI-TH-Connect helped me through a difficult season of doubt. The Scripture-based responses and gentle guidance reminded me of God's faithfulness. It's like having a wise Christian friend available 24/7.",
    bgColor: "bg-blue-500"
  },
  {
    name: "Michael J.",
    role: "Father & Engineer",
    initials: "MJ",
    text: "As a busy father, I don't always have time for long Bible studies. F-AI-TH-Connect gives me quick, meaningful insights that help me apply God's word to my daily challenges with work and family.",
    bgColor: "bg-amber-500"
  },
  {
    name: "Emily R.",
    role: "Seminary Student",
    initials: "ER",
    text: "The theological accuracy and depth of responses amazes me. As a seminary student, I appreciate how F-AI-TH-Connect provides both accessible guidance and deeper theological insights when I need them.",
    bgColor: "bg-blue-500"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Stories of Faith and Growth</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how F-AI-TH-Connect is helping believers deepen their faith and find biblical guidance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5" fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 italic mb-6">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className={`w-10 h-10 ${testimonial.bgColor} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-semibold text-sm">{testimonial.initials}</span>
                </div>
                <div className="ml-3">
                  <p className="text-gray-900 font-semibold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
