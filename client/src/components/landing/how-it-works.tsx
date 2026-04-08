import { Check } from "lucide-react";
import psalmImage from '@assets/psalm-53-3-trust.png';

const steps = [
  {
    number: 1,
    title: "Load Your Study Guide",
    description: "Upload this week's CCF 4 W's PDF, paste the content directly, or pick a group type and let AI generate a complete, tailored study guide in seconds."
  },
  {
    number: 2,
    title: "Choose How to Use It",
    description: "Share the guide as-is in your meeting room, or have AI rebuild it into a themed study for your specific group — Men's, Women's, Youth, Couples, and more."
  },
  {
    number: 3,
    title: "Meet and Study Together",
    description: "Create a private room, share the link with your group, and join a free video call. Everyone reads the same guide on their screen — no downloads needed."
  }
];

const highlights = [
  "CCF 4 W's PDF upload and sharing",
  "AI study guides for 8 group types",
  "Free video meeting rooms — no sign-in required",
  "Bible games to engage your group",
  "Sermon notes and PDF upload for AI study generation",
  "Works on any phone, tablet, or computer",
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From guide upload to live group meeting — three simple steps to run your D-Group.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Built for D-Groups and Bible Study Communities</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                F-AI-TH-Connect is designed specifically for DGroups — small, intentional communities studying God's Word together. Whether you are leading a CCF cell group or an independent Bible study, every tool you need is here.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src={psalmImage}
                alt="Trust in God — Psalm 56:3"
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
