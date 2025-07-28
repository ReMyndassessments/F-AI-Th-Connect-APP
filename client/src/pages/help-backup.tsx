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
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">How to Use:</h4>
                    <ol className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">1</span>
                        <span>Click the book icon (📖) next to the send button in the chat</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">2</span>
                        <span>Browse prompts by ministry category or use the search bar</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">3</span>
                        <span>Click any prompt to automatically fill your message box</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">4</span>
                        <span>Customize the prompt for your specific needs before sending</span>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Ministry Categories:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 px-3 py-2 rounded">Leadership</div>
                      <div className="bg-gray-50 px-3 py-2 rounded">Men's Ministry</div>
                      <div className="bg-gray-50 px-3 py-2 rounded">Women's Ministry</div>
                      <div className="bg-gray-50 px-3 py-2 rounded">Youth Ministry</div>
                      <div className="bg-gray-50 px-3 py-2 rounded">Missions</div>
                      <div className="bg-gray-50 px-3 py-2 rounded">Church Planting</div>
                      <div className="bg-gray-50 px-3 py-2 rounded">Health & Wellness</div>
                      <div className="bg-gray-50 px-3 py-2 rounded">Personal Growth</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bible Lookup System */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <span>Advanced Bible Lookup System</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  F-AI-TH-Connect features a comprehensive Bible study system with authentic translations, 
                  favorites management, and mobile-optimized search designed for Bible study participants.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Key Features:</span>
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500">•</span>
                        <span>Authentic KJV, WEB, and ASV translations using official API.Bible service</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500">•</span>
                        <span>Side-by-side translation comparison for deeper study</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500">•</span>
                        <span>Mobile-friendly dropdown selection (no typing required)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500">•</span>
                        <span>Clickable verse links in all AI responses</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500">•</span>
                        <span>Favorites system (bookmark up to 20 verses)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-500">•</span>
                        <span>Recent searches history (last 10)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Popular Verses Available:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• John 3:16 - God's love for the world</div>
                      <div>• Psalm 23:1 - The Lord is my shepherd</div>
                      <div>• Romans 8:28 - All things work together</div>
                      <div>• Jeremiah 29:11 - Plans to prosper you</div>
                      <div>• Philippians 4:13 - I can do all things</div>
                      <div>• Plus many more instant-access verses</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Text Highlighting System */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Highlighter className="w-5 h-5 text-amber-500" />
                  <span>Bible Study Highlighting System</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Transform AI responses into organized Bible study notes with our 5-category highlighting system, 
                  perfect for small group preparation and personal study.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Highlight Categories:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                        <span className="text-sm font-medium">Key Verse</span>
                        <span className="text-xs text-gray-500">- Important scriptures</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-300 rounded"></div>
                        <span className="text-sm font-medium">Prayer Point</span>
                        <span className="text-xs text-gray-500">- Topics for prayer</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-300 rounded"></div>
                        <span className="text-sm font-medium">Study Note</span>
                        <span className="text-xs text-gray-500">- Important insights</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-orange-300 rounded"></div>
                        <span className="text-sm font-medium">Action Item</span>
                        <span className="text-xs text-gray-500">- Practical applications</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-purple-300 rounded"></div>
                        <span className="text-sm font-medium">Discussion</span>
                        <span className="text-xs text-gray-500">- Group talking points</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">How to Use:</h4>
                    <ol className="text-sm text-gray-600 space-y-2">
                      <li>1. Select any text in an AI response with your mouse</li>
                      <li>2. Choose a highlight category from the popup toolbar</li>
                      <li>3. Your highlights are automatically saved per conversation</li>
                      <li>4. Click highlighted text again to remove highlights</li>
                      <li>5. Export your study notes for sharing with your group</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progressive Web App */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-purple-500" />
                  <span>Mobile App Installation (PWA)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Install F-AI-TH-Connect as a native app on your phone, tablet, or computer for offline access 
                  to your spiritual conversations and resources.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Installation Benefits:</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-500">•</span>
                        <span>Home screen icon like any other app</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-500">•</span>
                        <span>Offline access to previous conversations</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-500">•</span>
                        <span>Faster loading and native app feel</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-500">•</span>
                        <span>Works on phones, tablets, and computers</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">How to Install:</h4>
                    <ol className="text-sm text-gray-600 space-y-2">
                      <li>1. Look for browser installation prompts</li>
                      <li>2. Use the share icon in our header for QR codes</li>
                      <li>3. Follow browser-specific installation guides</li>
                      <li>4. Access step-by-step instructions on our sharing page</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">4</span>
                        <span>Edit the prompt if needed, then send your message</span>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Available Categories:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-blue-50 p-2 rounded">
                        <span className="font-medium text-blue-800">👥 Ministry Leadership</span>
                        <p className="text-blue-600 text-xs">Sermon prep, team guidance</p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded">
                        <span className="font-medium text-purple-800">💪 Men's Ministry</span>
                        <p className="text-purple-600 text-xs">Biblical manhood, fatherhood</p>
                      </div>
                      <div className="bg-pink-50 p-2 rounded">
                        <span className="font-medium text-pink-800">🌸 Women's Ministry</span>
                        <p className="text-pink-600 text-xs">Godly womanhood, mentoring</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <span className="font-medium text-green-800">🌍 Missions & Outreach</span>
                        <p className="text-green-600 text-xs">Evangelism, community service</p>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded">
                        <span className="font-medium text-yellow-800">🏛️ Church Planting</span>
                        <p className="text-yellow-600 text-xs">Biblical foundation, leadership</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded">
                        <span className="font-medium text-red-800">🙏 Health & Wellness</span>
                        <p className="text-red-600 text-xs">Biblical perspective on health</p>
                      </div>
                      <div className="bg-indigo-50 p-2 rounded">
                        <span className="font-medium text-indigo-800">📖 Personal Growth</span>
                        <p className="text-indigo-600 text-xs">Prayer, Bible study, stewardship</p>
                      </div>
                      <div className="bg-orange-50 p-2 rounded">
                        <span className="font-medium text-orange-800">🎯 Youth Ministry</span>
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