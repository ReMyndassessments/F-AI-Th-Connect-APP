import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Book, 
  Upload, 
  Settings, 
  Heart, 
  Phone, 
  Mail, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import DailyVerseCard from "@/components/daily-verse/daily-verse-card";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I start a conversation with the AI?",
    answer: "Simply type your question or concern in the chat box and press Send. You can ask about biblical guidance, prayer requests, spiritual questions, or seek encouragement in your faith journey."
  },
  {
    question: "Can I upload documents for Bible study creation?",
    answer: "Yes! Click the 'Attach File' button to upload text files, PDFs, or Word documents. The AI will create comprehensive Bible studies with discussion questions and practical applications based on your content."
  },
  {
    question: "What types of questions can I ask?",
    answer: "You can ask about Scripture interpretation, prayer guidance, spiritual growth, relationship advice from a Christian perspective, dealing with life challenges through faith, and seeking biblical wisdom for daily situations."
  },
  {
    question: "How accurate are the biblical references?",
    answer: "Our AI is trained on biblical content and provides scripture references with citations. However, we always recommend verifying important spiritual matters with your pastor, Bible study group, or trusted Christian resources."
  },
  {
    question: "Is my conversation private?",
    answer: "Yes, your conversations are private and secure. We don't share your personal spiritual discussions with others. See our Privacy Policy for complete details about data handling."
  },
  {
    question: "Can I save or share my conversations?",
    answer: "Yes! Each message has copy, download, and share buttons. You can save meaningful conversations for later reflection or share encouraging messages with fellow believers."
  },
  {
    question: "What if the AI provides guidance I'm unsure about?",
    answer: "While our AI provides biblically-grounded responses, always seek confirmation from your pastor, trusted Christian mentors, or established Christian resources for important spiritual decisions."
  },
  {
    question: "How can I support this ministry?",
    answer: "F-AI-TH-Connect is supported through faithful partnerships. You can contribute through our GiveSendGo campaign linked in the navigation. Your support helps us serve more believers with biblical guidance."
  }
];

export default function Help() {
  const [, setLocation] = useLocation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold faith-gradient-text">F-AI-TH-Connect</span>
              </Button>
            </div>
            <Button
              onClick={() => setLocation("/")}
              className="faith-button-primary"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold faith-gradient-text mb-4">Help Center</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find answers to your questions and learn how to make the most of your spiritual journey with F-AI-TH-Connect.
              </p>
            </div>

            {/* Getting Started */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Book className="w-5 h-5 text-blue-500" />
                  <span>Getting Started</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Start a Conversation</h4>
                      <p className="text-sm text-gray-600">Type your spiritual questions or concerns in the chat interface for biblical guidance.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Upload className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Upload Documents</h4>
                      <p className="text-sm text-gray-600">Upload files to create comprehensive Bible studies and spiritual content.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Heart className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Share & Save</h4>
                      <p className="text-sm text-gray-600">Copy, download, or share meaningful conversations with fellow believers.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Settings className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Personalized Experience</h4>
                      <p className="text-sm text-gray-600">Each conversation is tailored to provide relevant biblical wisdom for your situation.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="flex justify-between items-center w-full text-left hover:text-blue-600 transition-colors"
                      >
                        <h4 className="font-semibold pr-4">{faq.question}</h4>
                        {expandedFAQ === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {expandedFAQ === index && (
                        <p className="text-gray-600 mt-2 leading-relaxed">{faq.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  If you can't find the answer you're looking for, we're here to help! Reach out to our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => setLocation("/contact")}
                    className="faith-button-primary flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact Support</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("mailto:info@f-ai-th-connect.online", "_blank")}
                    className="flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Us Directly</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <DailyVerseCard />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setLocation("/chat")}
                  className="w-full faith-button-primary justify-start"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start New Chat
                </Button>
                <Button
                  onClick={() => setLocation("/contact")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
                <Button
                  onClick={() => window.open("https://www.givesendgo.com/CodeandCoffeeforChrist", "_blank")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Support Ministry
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}