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
  ChevronUp,
  Highlighter,
  Star,
  Bookmark,
  BookOpen
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
    question: "How do I highlight text for Bible study preparation?",
    answer: "F-AI-TH-Connect includes a powerful highlighting system perfect for Bible study preparation. Simply select any text in an AI response with your mouse, and a toolbar will appear with 5 color-coded categories: Key Verse (yellow), Prayer Point (blue), Study Note (green), Action Item (orange), and Discussion (purple). Your highlights are saved automatically and you can export them as study notes."
  },
  {
    question: "Can I remove highlights or export my study notes?",
    answer: "Yes! Click any highlighted text to remove the highlight. When you have multiple highlights in a message, you'll see a summary showing counts by category. Use the 'Export Notes' button to download your highlighted study materials as a JSON file for use in other Bible study tools or sharing with your study group."
  },
  {
    question: "What if the AI provides guidance I'm unsure about?",
    answer: "While our AI provides biblically-grounded responses, always seek confirmation from your pastor, trusted Christian mentors, or established Christian resources for important spiritual decisions."
  },
  {
    question: "How can I support this ministry?",
    answer: "F-AI-TH-Connect is supported through faithful partnerships. You can contribute through our GiveSendGo campaign linked in the navigation. Your support helps us serve more believers with biblical guidance."
  },
  {
    question: "Where is the prompt library and how do I use it?",
    answer: "Click the book icon (📖) next to the send button in any chat session to open the prompt library with 30+ pre-written questions organized by ministry categories. Browse categories like 'Ministry Leadership' or 'Personal Growth', then click any prompt to automatically fill your message box."
  },
  {
    question: "I'm new to AI - what should I ask?",
    answer: "Perfect! The prompt library is designed exactly for this. Browse categories like 'Ministry Leadership' or 'Personal Growth' to see professionally written examples. Simply click any prompt to use it, then customize it for your specific needs."
  },
  {
    question: "Can I modify the pre-written prompts?",
    answer: "Absolutely! When you click a prompt, it fills your message box where you can edit it before sending. Add specific details, change the topic, or customize it for your ministry context."
  },
  {
    question: "How do I search for specific ministry topics in the prompt library?",
    answer: "Use the search bar at the top of the prompt library. Type keywords like 'prayer,' 'evangelism,' 'youth,' or 'Bible study' to find relevant prompts across all categories."
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
      {/* Header - Mobile Optimized */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold faith-gradient-text hidden xs:inline">F-AI-TH-Connect</span>
                <span className="text-sm font-bold faith-gradient-text xs:hidden">F-AI-TH</span>
              </Button>
            </div>
            <Button
              onClick={() => setLocation("/")}
              className="faith-button-primary text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
            >
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Hero Section - Mobile Optimized */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold faith-gradient-text mb-3 sm:mb-4">Help Center</h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
                Find answers to your questions and learn how to make the most of your spiritual journey with F-AI-TH-Connect.
              </p>
            </div>

            {/* Getting Started - Mobile Optimized */}
            <Card className="mb-4 sm:mb-6 lg:mb-8">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Book className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <span>Getting Started</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm sm:text-base">Start a Conversation</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Type your spiritual questions or concerns in the chat interface for biblical guidance.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm sm:text-base">Upload Documents</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Upload files to create comprehensive Bible studies and spiritual content.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm sm:text-base">Share & Save</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Copy, download, or share meaningful conversations with fellow believers.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm sm:text-base">Personalized Experience</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Each conversation is tailored to provide relevant biblical wisdom for your situation.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prompt Library Feature */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span>Prompt Library - Your AI Guide</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  New to AI? The Prompt Library provides 30+ professionally written questions organized by ministry areas, 
                  making it easy to discover what you can ask F-AI-TH-Connect.
                </p>
                
                <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">How to Use:</h4>
                    <ol className="text-xs sm:text-sm text-gray-600 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full mt-0.5 flex-shrink-0">1</span>
                        <span>Click the book icon (📖) next to the send button in the chat</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full mt-0.5 flex-shrink-0">2</span>
                        <span>Browse prompts by ministry category or use the search bar</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full mt-0.5 flex-shrink-0">3</span>
                        <span>Click any prompt to automatically fill your message box</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full mt-0.5 flex-shrink-0">4</span>
                        <span>Edit the prompt if needed, then send your message</span>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Available Categories:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div className="bg-blue-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-blue-800 block">👥 Ministry Leadership</span>
                        <p className="text-blue-600 text-xs">Sermon prep, team guidance</p>
                      </div>
                      <div className="bg-purple-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-purple-800 block">💪 Men's Ministry</span>
                        <p className="text-purple-600 text-xs">Biblical manhood, fatherhood</p>
                      </div>
                      <div className="bg-pink-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-pink-800 block">🌸 Women's Ministry</span>
                        <p className="text-pink-600 text-xs">Godly womanhood, mentoring</p>
                      </div>
                      <div className="bg-green-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-green-800 block">🌍 Missions & Outreach</span>
                        <p className="text-green-600 text-xs">Evangelism, community service</p>
                      </div>
                      <div className="bg-yellow-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-yellow-800 block">🏛️ Church Planting</span>
                        <p className="text-yellow-600 text-xs">Biblical foundation, leadership</p>
                      </div>
                      <div className="bg-red-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-red-800 block">🙏 Health & Wellness</span>
                        <p className="text-red-600 text-xs">Biblical perspective on health</p>
                      </div>
                      <div className="bg-indigo-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-indigo-800 block">📖 Personal Growth</span>
                        <p className="text-indigo-600 text-xs">Prayer, Bible study, stewardship</p>
                      </div>
                      <div className="bg-orange-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-orange-800 block">🎯 Youth Ministry</span>
                        <p className="text-orange-600 text-xs">Discipling young people</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-900 mb-2">Perfect for Beginners:</h5>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• No need to think of questions - we've prepared them for you</li>
                    <li>• See examples of what the AI can help with in your ministry area</li>
                    <li>• All prompts are written by ministry professionals</li>
                    <li>• Search by topic to find exactly what you need</li>
                    <li>• Save favorites for quick access to your most-used prompts</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Bible Study Highlighting Feature */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Highlighter className="w-5 h-5 text-amber-500" />
                  <span>Bible Study Highlighting</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  F-AI-TH-Connect includes a powerful highlighting system designed specifically for Bible study preparation, 
                  sermon writing, and group discussion planning.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">How to Use:</h4>
                    <ol className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">1</span>
                        <span>Ask the AI a biblical question or request spiritual guidance</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">2</span>
                        <span>Select any text in the AI response with your mouse</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">3</span>
                        <span>Choose from 5 study categories in the toolbar that appears</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">4</span>
                        <span>Your highlights save automatically for future reference</span>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Highlight Categories:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="bg-yellow-200 px-2 py-1 rounded text-xs font-medium">Key Verse</span>
                        <span className="text-gray-600">Important Scripture passages</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-blue-600" />
                        <span className="bg-blue-200 px-2 py-1 rounded text-xs font-medium">Prayer Point</span>
                        <span className="text-gray-600">Prayer requests & topics</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bookmark className="w-4 h-4 text-green-600" />
                        <span className="bg-green-200 px-2 py-1 rounded text-xs font-medium">Study Note</span>
                        <span className="text-gray-600">Study insights & observations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-orange-600" />
                        <span className="bg-orange-200 px-2 py-1 rounded text-xs font-medium">Action Item</span>
                        <span className="text-gray-600">Things to do or apply</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-purple-600" />
                        <span className="bg-purple-200 px-2 py-1 rounded text-xs font-medium">Discussion</span>
                        <span className="text-gray-600">Group discussion points</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Advanced Features:</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Click any highlighted text to remove the highlight</li>
                    <li>• View highlight summary with counts by category</li>
                    <li>• Export all highlights as study notes for sharing or printing</li>
                    <li>• Highlights persist across sessions for long-term study projects</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section - Mobile Optimized */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0 pb-3 sm:pb-4 last:pb-0">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="flex justify-between items-center w-full text-left p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <h4 className="font-semibold pr-3 sm:pr-4 text-sm sm:text-base leading-tight">{faq.question}</h4>
                        {expandedFAQ === index ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFAQ === index && (
                        <div className="mt-2 sm:mt-3 ml-2 sm:ml-3">
                          <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support - Mobile Optimized */}
            <Card className="mt-4 sm:mt-6 lg:mt-8">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Need More Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  If you can't find the answer you're looking for, we're here to help! Reach out to our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={() => setLocation("/contact")}
                    className="faith-button-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact Support</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("mailto:info@f-ai-th-connect.online", "_blank")}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Us Directly</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Mobile Optimized */}
          <div className="w-full lg:w-80 space-y-4 sm:space-y-6">
            <DailyVerseCard />
            
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button
                  onClick={() => setLocation("/chat")}
                  className="w-full faith-button-primary justify-center sm:justify-start text-sm sm:text-base py-2 sm:py-3"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start New Chat
                </Button>
                <Button
                  onClick={() => setLocation("/contact")}
                  variant="outline"
                  className="w-full justify-center sm:justify-start text-sm sm:text-base py-2 sm:py-3"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
                <Button
                  onClick={() => window.open("https://www.givesendgo.com/CodeandCoffeeforChrist", "_blank")}
                  variant="outline"
                  className="w-full justify-center sm:justify-start text-sm sm:text-base py-2 sm:py-3"
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