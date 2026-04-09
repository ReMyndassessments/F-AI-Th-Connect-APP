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

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Three simple steps to equip your group to study the Word, disciple one another, and reach the lost.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
      </div>
    </section>
  );
}
