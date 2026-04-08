import { Upload, Video, Users, Gamepad2, FileText, MessageCircle } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "AI Biblical Chat",
    description: "Ask any spiritual question and receive Scripture-grounded answers with relevant Bible passages, theological insight, and pastoral encouragement — available 24/7.",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
    badge: null,
  },
  {
    icon: FileText,
    title: "D-Group Study Generator",
    description: "Generate complete, tailored Bible study guides for 8 group types — Men's, Women's, Youth, Couples, Senior Adults, Sunday School, Business, and Mixed Groups.",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-500",
    badge: "8 Study Types",
  },
  {
    icon: Video,
    title: "Virtual Meeting Rooms",
    description: "Create a private D-Group room with one tap. Share a link with your group, join a live video call, and follow the study guide together — all in one place.",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-500",
    badge: "Free Video Calls",
  },
  {
    icon: Upload,
    title: "Sermon & Notes Upload",
    description: "Upload your pastor's sermon notes, a PDF study resource, or any document — the AI reads it and uses it to generate a fully grounded Bible study for your group.",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-500",
    badge: "PDF & DOCX",
  },
  {
    icon: Users,
    title: "CCF 4 W's Integration",
    description: "Upload this week's CCF Weekly Guide PDF and share it instantly in your meeting room — or have AI generate a fully themed study guide built on the 4 W's content.",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
    badge: "CCF Ready",
  },
  {
    icon: Gamepad2,
    title: "Bible Games",
    description: "Engage your group with 4 interactive game types — Scripture Scramble, Fill-in-the-Blank, Character Guessing, and Memory Challenge — across multiple difficulty levels.",
    bgColor: "bg-rose-50",
    iconColor: "text-rose-500",
    badge: "4 Game Types",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything Your D-Group Needs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From uploading your CCF guide to running a live video study — F-AI-TH-Connect brings your group together with the right tools for every step.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 touch-target mobile-tap flex flex-col"
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                {feature.badge && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${feature.bgColor} ${feature.iconColor}`}>
                    {feature.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed flex-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
