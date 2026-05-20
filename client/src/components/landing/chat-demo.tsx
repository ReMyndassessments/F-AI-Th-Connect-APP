import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ChatDemo() {
  const [, setLocation] = useLocation();
  const [inputValue, setInputValue] = useState("");
  const { t } = useLanguage();

  const demoMessages = [
    {
      role: 'user',
      content: t.chatDemo.demoMsg1User,
    },
    {
      role: 'assistant',
      content: t.chatDemo.demoMsg1Content,
      scripture: {
        reference: t.chatDemo.demoScriptureRef,
        text: t.chatDemo.demoScriptureText,
      },
      guidance: t.chatDemo.demoGuidance,
    },
    {
      role: 'user',
      content: t.chatDemo.demoMsg2User,
    },
    {
      role: 'assistant',
      content: t.chatDemo.demoMsg2Content,
      practices: [
        t.chatDemo.demoPractice1,
        t.chatDemo.demoPractice2,
        t.chatDemo.demoPractice3,
      ],
      encouragement: t.chatDemo.demoEncouragement,
    },
  ];

  const startChat = () => {
    setLocation("/chat");
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{t.chatDemo.heading}</h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto mb-4 sm:mb-6 px-2">
            {t.chatDemo.subtext}
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {t.chatDemo.tags.map((tag) => (
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
                  <p className="text-white text-opacity-80 text-sm">{t.chatDemo.companionLabel}</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-80 sm:h-96 overflow-y-auto p-3 sm:p-6 space-y-4">
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
                      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 sm:px-4 py-3 max-w-[75vw] sm:max-w-md">
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
                  placeholder={t.chatDemo.inputPlaceholder}
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
