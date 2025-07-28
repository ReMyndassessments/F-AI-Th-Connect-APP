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
  },
  {
    question: "How do I look up Bible verses within F-AI-TH-Connect?",
    answer: "F-AI-TH-Connect has a comprehensive Bible lookup system! Click any blue Bible reference link in AI responses to view verses instantly. You can also visit the dedicated Bible page by clicking 'Quick Bible Lookup' in the navigation menu for advanced searching with multiple translation comparison."
  },
  {
    question: "Can I compare different Bible translations?",
    answer: "Yes! Our Bible lookup system supports multiple translations including King James Version (KJV), World English Bible (WEB), and American Standard Version (ASV). When viewing any verse, you can switch between translations to compare interpretations side-by-side."
  },
  {
    question: "What's the dropdown system for Bible verses about?",
    answer: "We've designed a mobile-friendly four-part dropdown system (Version, Book, Chapter, Verse) to help users who struggle with typing long Bible book names. This eliminates typing errors and makes Bible lookup accessible for everyone, especially during Bible study sessions."
  },
  {
    question: "Can I save favorite Bible verses?",
    answer: "Absolutely! The Bible lookup page includes a favorites system where you can bookmark up to 20 verses for quick access. Your recent searches (last 10) are also automatically saved for easy reference during Bible study."
  },
  {
    question: "How do the popular verses work?",
    answer: "Popular verses are available as a dropdown menu on the Bible lookup page, featuring commonly referenced scriptures like John 3:16, Psalm 23:1, and Romans 8:28. Simply select from the dropdown to instantly view these beloved passages."
  },
  {
    question: "Is F-AI-TH-Connect available as a mobile app?",
    answer: "Yes! F-AI-TH-Connect is a Progressive Web App (PWA) that can be installed on your phone or tablet like a native app. Look for the 'Install' prompt in your browser, or use the share icon on our landing page to access QR codes and installation instructions for offline spiritual access."
  },
  {
    question: "How do I install F-AI-TH-Connect on my device?",
    answer: "Installation is easy! Visit our QR code sharing page (share icon in header) for step-by-step instructions for all major browsers. Once installed, you'll have offline access to your spiritual conversations and can use F-AI-TH-Connect like any other app on your home screen."
  },
  {
    question: "What are the changing photos on the homepage?",
    answer: "F-AI-TH-Connect features an automated monthly photo rotation system with 24 high-resolution Christian-themed images that change every month. Each month displays unique inspirational landscapes and Bible study scenes - January shows 'New Beginnings,' April features 'Easter Hope,' December displays 'Christmas Hope,' etc."
  },
  {
    question: "Do the daily verses change automatically?",
    answer: "Yes! The 'Today's Memory Verse' rotates through 365 carefully selected scriptures, displaying a different verse each day of the year. Each verse includes its theme and provides spiritual encouragement for daily meditation and reflection."
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

            {/* New Features Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Prompt Library */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span>Prompt Library</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">30+ pre-written questions organized by ministry categories for users new to AI.</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 px-2 py-1 rounded">Leadership</div>
                    <div className="bg-gray-50 px-2 py-1 rounded">Men's Ministry</div>
                    <div className="bg-gray-50 px-2 py-1 rounded">Women's Ministry</div>
                    <div className="bg-gray-50 px-2 py-1 rounded">Youth Ministry</div>
                  </div>
                </CardContent>
              </Card>

              {/* Bible Lookup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Book className="w-5 h-5 text-green-500" />
                    <span>Bible Lookup System</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Comprehensive Bible study with authentic translations, favorites, and mobile-friendly search.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• KJV, WEB, ASV translations</li>
                    <li>• Side-by-side comparison</li>
                    <li>• Favorites & history</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Highlighting System */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Highlighter className="w-5 h-5 text-amber-500" />
                    <span>Study Highlighting</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">5-category highlighting system for Bible study preparation with export functionality.</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-yellow-200 px-2 py-1 rounded">Key Verse</span>
                    <span className="bg-blue-200 px-2 py-1 rounded">Prayer Point</span>
                    <span className="bg-green-200 px-2 py-1 rounded">Study Note</span>
                  </div>
                </CardContent>
              </Card>

              {/* PWA Installation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-purple-500" />
                    <span>Mobile App (PWA)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Install as a native app on any device for offline access to spiritual conversations.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Home screen installation</li>
                    <li>• Offline capability</li>
                    <li>• Native app experience</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

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