import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";
import { useLocation } from "wouter";

const demoMessages = [
  {
    role: 'user',
    content: "I'm struggling with anxiety about my future. What does the Bible say about worry?"
  },
  {
    role: 'assistant',
    content: "I understand that anxiety about the future can feel overwhelming. Jesus directly addresses this concern in Matthew 6:26-27:",
    scripture: {
      reference: "Matthew 6:26-27 (NIV)",
      text: "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they? Can any one of you by worrying add a single hour to your life?"
    },
    guidance: "God knows your needs and cares for you deeply. Consider also Philippians 4:19 and 1 Peter 5:7. Would you like to explore specific prayer practices for managing anxiety?"
  },
  {
    role: 'user',
    content: "Yes, please share some prayer practices that might help."
  },
  {
    role: 'assistant',
    content: "Here are some biblical prayer practices for anxiety:",
    practices: [
      "Surrender Prayer: Cast your anxieties on God (1 Peter 5:7)",
      "Gratitude Prayer: Thank God for His provision (1 Thessalonians 5:18)",
      "Scripture Meditation: Meditate on God's promises"
    ],
    encouragement: "Remember, God's peace surpasses understanding. Would you like me to guide you through a specific prayer?"
  }
];

export default function ChatDemo() {
  const [, setLocation] = useLocation();
  const [inputValue, setInputValue] = useState("");

  const startChat = () => {
    setLocation("/chat");
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">More Than a Chat — Your Ministry AI Companion</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Ask biblical questions, prepare sermons, get ministry guidance, and access 35 ready-made prompts across Missions, Men's, Women's, Youth, Church, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {["Sermon Preparation", "Missions & Outreach", "Men's Ministry", "Women's Ministry", "Youth Group", "Church Leadership", "Prayer Guidance", "Bible Study"].map((tag) => (
              <span key={tag} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full font-medium">{tag}</span>
            ))}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-500 to-amber-500 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">F-AI-TH-Connect</h3>
                  <p className="text-white text-opacity-80 text-sm">Your Christian AI Companion</p>
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {demoMessages.map((message, index) => (
                <div key={index}>
                  {message.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-xs">
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-md">
                        <p className="text-sm text-gray-900 mb-2">{message.content}</p>
                        
                        {message.scripture && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-2">
                            <p className="text-sm italic text-blue-600 mb-1">"{message.scripture.text}"</p>
                            <p className="text-xs text-blue-600">- {message.scripture.reference}</p>
                          </div>
                        )}
                        
                        {message.practices && (
                          <ul className="text-sm text-gray-900 space-y-1 list-disc list-inside mb-2">
                            {message.practices.map((practice, i) => (
                              <li key={i}><strong>{practice.split(':')[0]}:</strong> {practice.split(':')[1]}</li>
                            ))}
                          </ul>
                        )}
                        
                        {message.guidance && (
                          <p className="text-sm text-gray-900">{message.guidance}</p>
                        )}
                        
                        {message.encouragement && (
                          <p className="text-sm text-gray-900">{message.encouragement}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Input
                  type="text"
                  placeholder="Ask about faith, prayer, or biblical guidance..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
                />
                <Button
                  onClick={startChat}
                  className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
