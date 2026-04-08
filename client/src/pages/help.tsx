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
  BookOpen,
  Gamepad2,
  Shuffle,
  Users,
  Volume2,
  RefreshCw,
  Clock,
  Headphones,
  Coffee,
  Zap,
  UserCheck
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import DailyVerseCard from "@/components/daily-verse/daily-verse-card";

interface FAQItem {
  question: string;
  answer: string;
  requiresTTS?: boolean;
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
    answer: "F-AI-TH-Connect is supported through faithful partnerships. You can contribute through the Support link in the navigation. Your support helps us serve more believers with biblical guidance."
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
    question: "What are Bible Games and how do I play them?",
    answer: "Bible Games are interactive challenges to test your biblical knowledge! Navigate to 'Bible Games' in the menu, choose a category (Characters, Places, Verses, Books, Events) and difficulty level, then click any game card to start. You'll find 4 game types: Scripture Scramble, Fill-in-the-Blank, Character Guessing, and Memory Challenge. The system includes enhanced spell check with biblical terms dictionary and real-time suggestions to help you learn."
  },
  {
    question: "What are the different Bible Games modes available?",
    answer: "F-AI-TH-Connect offers four distinct game modes: 1) Individual Play - Classic quiz system with enhanced spell check for personal study, 2) Bible Study Icebreaker - Customizable group challenges for 3-15 people with 10-30 minute sessions, perfect for Bible study meetings, 3) Quick Fire - Rapid-fire questions (10-20 questions) for energizing groups and building momentum, 4) Team Building - Structured challenges with warm-up, collaboration, and discussion phases for deeper group engagement."
  },
  {
    question: "How does the Bible Study Icebreaker mode work?",
    answer: "The Icebreaker mode is designed specifically for Bible study groups and small group meetings. You can customize the number of participants (3-15 people) and time limit (10-30 minutes). The system generates balanced questions appropriate for group interaction, with clear instructions for facilitators. It's perfect for starting meetings, breaking the ice with new members, or adding interactive elements to your Bible study sessions."
  },
  {
    question: "What is Quick Fire mode and when should I use it?",
    answer: "Quick Fire mode provides rapid-fire Bible questions (10-20 questions) designed to energize groups and create excitement. It's perfect for youth groups, church events, or when you want to add high-energy interaction to your gathering. Questions are delivered quickly with immediate feedback, making it ideal for competitive group settings or as an energizing activity during longer meetings."
  },
  {
    question: "How does Team Building mode enhance group activities?",
    answer: "Team Building mode provides a structured three-phase approach: Warm-up questions to get everyone comfortable, Collaboration challenges that require teamwork to solve, and Discussion prompts that encourage deeper spiritual conversation. This mode is designed for church groups, ministry teams, or any Christian community wanting to combine fun Bible knowledge with meaningful relationship building."
  },
  {
    question: "What is the enhanced spell check system in Bible Games?",
    answer: "The enhanced spell check system includes a comprehensive biblical terms dictionary with thousands of names, places, events, and concepts from Scripture. As you type answers, the system provides real-time suggestions for biblical terms, helping you learn correct spellings while playing. It recognizes variant spellings and offers intelligent corrections, making the games both educational and accessible for all knowledge levels."
  },
  {
    question: "Can I play multiple questions in a session?",
    answer: "Yes! F-AI-TH-Connect supports multi-question quiz sessions with score tracking and progress indicators. You can set up sessions with 5, 10, or 15 questions, and the system tracks your correct answers, total score, and time completion. You can also skip questions if needed and see your overall performance at the end of each session."
  },
  {
    question: "What are the premium voices and how do I use them?",
    answer: "F-AI-TH-Connect features three premium ElevenLabs AI voices (Adam, Bella, Grace) specifically chosen for spiritual content. You'll find voice playback buttons on Bible verses and AI responses. Just click the play button to hear Scripture or spiritual guidance read aloud - perfect for meditation or accessibility.",
    requiresTTS: true
  }
];

export default function Help() {
  const [, setLocation] = useLocation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Fetch feature flags to conditionally show TTS section
  const { data: featureFlags } = useQuery({
    queryKey: ['/api/feature-flags/public'],
    retry: false,
  });

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  // Check if TTS features are enabled
  const isTTSEnabled = featureFlags?.flags?.some((flag: any) => 
    (flag.name === 'tts_ai_responses' || flag.name === 'tts_bible_verses') && flag.enabled
  );

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

            {/* Bible Word Games Feature - Updated with Four Modes */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gamepad2 className="w-5 h-5 text-purple-500" />
                  <span>Bible Games - Four Modes for Every Setting!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Test your biblical knowledge with 24+ engaging games across 4 different types and 4 distinct play modes. 
                  Features enhanced spell check with biblical terms dictionary, perfect for individual study, group activities, 
                  Bible study icebreakers, and ministry team building.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Four Play Modes:</h4>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Individual Play</span>
                        </div>
                        <p className="text-blue-600 text-xs">Classic quiz system with enhanced spell check for personal study</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Coffee className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-800">Icebreaker</span>
                        </div>
                        <p className="text-green-600 text-xs">Customizable group challenges (3-15 people, 10-30 min) for Bible studies</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Zap className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-orange-800">Quick Fire</span>
                        </div>
                        <p className="text-orange-600 text-xs">Rapid-fire questions (10-20) for energizing youth groups and events</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <UserCheck className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-purple-800">Team Building</span>
                        </div>
                        <p className="text-purple-600 text-xs">Warm-up, collaboration, and discussion phases for ministry teams</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Game Types:</h4>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <Shuffle className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Scripture Scramble</span>
                        <span className="text-gray-600">- Unscramble Bible words</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Fill-in-the-Blank</span>
                        <span className="text-gray-600">- Complete Bible verses</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">Character Guessing</span>
                        <span className="text-gray-600">- Identify Bible figures</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-amber-600" />
                        <span className="font-medium">Memory Challenge</span>
                        <span className="text-gray-600">- Memorize key verses</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-gray-800 mb-2">Enhanced Features:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Biblical spell check with intelligent suggestions</li>
                        <li>• Multi-question sessions with progress tracking</li>
                        <li>• Question skipping and hint system</li>
                        <li>• Score tracking and performance statistics</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-blue-50 p-3 rounded text-center">
                    <div className="font-semibold text-blue-800">Easy Games</div>
                    <div className="text-blue-600">10 Points Each</div>
                  </div>
                  <div className="bg-amber-50 p-3 rounded text-center">
                    <div className="font-semibold text-amber-800">Medium Games</div>
                    <div className="text-amber-600">20 Points Each</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded text-center">
                    <div className="font-semibold text-red-800">Hard Games</div>
                    <div className="text-red-600">30 Points Each</div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-900 mb-2">Perfect for Ministry Settings:</h5>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>Bible Studies:</strong> Use Icebreaker mode to start meetings with engaging activities</li>
                    <li>• <strong>Youth Groups:</strong> Quick Fire mode creates high-energy competitive environments</li>
                    <li>• <strong>Ministry Teams:</strong> Team Building mode strengthens relationships through shared challenges</li>
                    <li>• <strong>Personal Growth:</strong> Individual Play offers focused learning with intelligent spell assistance</li>
                    <li>• <strong>All Devices:</strong> Mobile-optimized interface works seamlessly on phones, tablets, and computers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Premium Text-to-Speech Feature - Only show if TTS is enabled */}
            {isTTSEnabled && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Volume2 className="w-5 h-5 text-green-500" />
                    <span>Premium Voice Playback</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    Experience Scripture and spiritual guidance through high-quality AI voices specifically chosen for Christian content. 
                    Perfect for meditation, accessibility, or hands-free listening during prayer time.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">Premium Voices:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">Adam</span>
                          <span className="text-gray-600">- Deep, thoughtful male voice</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-medium">Bella</span>
                          <span className="text-gray-600">- Gentle, nurturing female voice</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span className="font-medium">Grace</span>
                          <span className="text-gray-600">- Clear, inspiring female voice</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Powered by ElevenLabs AI for natural, spiritual-focused audio experience.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">Where You'll Hear Voices:</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start space-x-2">
                          <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Bible verse lookup and daily memory verses</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <MessageCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>AI spiritual guidance and biblical responses</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Headphones className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>Hands-free listening during prayer or meditation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-900 mb-2">Voice Features:</h5>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Premium quality voices specifically chosen for spiritual content</li>
                      <li>• Regular 1.0x playback speed optimized for contemplation</li>
                      <li>• Intelligent content processing removes formatting for clear audio</li>
                      <li>• Long content automatically split for seamless listening</li>
                      <li>• Simple play/pause/stop controls in every message and verse</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

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
                  {faqs.filter(faq => !faq.requiresTTS || isTTSEnabled).map((faq, index) => (
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
                  onClick={() => setLocation("/")}
                  className="w-full faith-button-primary justify-center sm:justify-start text-sm sm:text-base py-2 sm:py-3"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start New Chat
                </Button>
                <Button
                  onClick={() => setLocation("/bible-games")}
                  variant="outline"
                  className="w-full justify-center sm:justify-start text-sm sm:text-base py-2 sm:py-3"
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Play Bible Games
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
                  onClick={() => window.open("https://pay.airwallex.com/hkhhexfr4367", "_blank")}
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