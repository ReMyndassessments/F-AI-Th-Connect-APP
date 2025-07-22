import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { MessageCircle, Shield, Lock, Eye, Database, Mail } from "lucide-react";
import DailyVerseCard from "@/components/daily-verse/daily-verse-card";

export default function Privacy() {
  const [, setLocation] = useLocation();

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
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold faith-gradient-text mb-4">Privacy Policy</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your privacy and spiritual conversations are sacred to us. Learn how we protect and handle your information.
              </p>
              <p className="text-sm text-gray-500 mt-4">Last updated: January 22, 2025</p>
            </div>

            <div className="space-y-8">
              {/* Information We Collect */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-blue-500" />
                    <span>Information We Collect</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <h4 className="font-semibold mb-2">Conversation Data</h4>
                  <p className="mb-4">
                    We collect the messages you send through our AI chat interface, including your questions, prayer requests, 
                    and spiritual discussions. This data is used solely to provide biblical guidance and improve our service.
                  </p>
                  
                  <h4 className="font-semibold mb-2">File Uploads</h4>
                  <p className="mb-4">
                    When you upload documents for Bible study creation, we temporarily process these files to generate 
                    spiritual content. Files are not permanently stored after processing.
                  </p>

                  <h4 className="font-semibold mb-2">Usage Information</h4>
                  <p className="mb-4">
                    We collect basic usage statistics to understand how our service helps believers, including session 
                    duration, feature usage, and general interaction patterns.
                  </p>

                  <h4 className="font-semibold mb-2">Technical Information</h4>
                  <p>
                    Standard web information such as IP addresses, browser type, and device information to ensure 
                    proper functionality and security.
                  </p>
                </CardContent>
              </Card>

              {/* How We Use Your Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-green-500" />
                    <span>How We Use Your Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Provide Biblical Guidance:</strong> Your conversations enable our AI to offer personalized Christian wisdom and scripture-based responses.</li>
                    <li><strong>Create Bible Studies:</strong> Uploaded documents are processed to generate comprehensive spiritual content and discussion materials.</li>
                    <li><strong>Improve Our Service:</strong> We analyze usage patterns to enhance the quality of biblical guidance and add helpful features.</li>
                    <li><strong>Maintain Security:</strong> Technical information helps us protect against abuse and ensure service reliability.</li>
                    <li><strong>Respond to Support:</strong> Contact information is used only to address your questions and provide assistance.</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Data Protection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-purple-500" />
                    <span>How We Protect Your Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <h4 className="font-semibold mb-2">Secure Transmission</h4>
                  <p className="mb-4">
                    All conversations are encrypted in transit using industry-standard SSL/TLS encryption to protect 
                    your spiritual discussions from unauthorized access.
                  </p>

                  <h4 className="font-semibold mb-2">Limited Access</h4>
                  <p className="mb-4">
                    Only authorized personnel involved in providing Christian guidance and technical support have 
                    access to conversation data, and only when necessary for service improvement.
                  </p>

                  <h4 className="font-semibold mb-2">Data Minimization</h4>
                  <p className="mb-4">
                    We collect only the information necessary to provide biblical guidance and operate our service effectively.
                  </p>

                  <h4 className="font-semibold mb-2">Regular Security Reviews</h4>
                  <p>
                    We regularly review and update our security practices to ensure your spiritual conversations remain private and protected.
                  </p>
                </CardContent>
              </Card>

              {/* Data Sharing */}
              <Card>
                <CardHeader>
                  <CardTitle>Information Sharing</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p className="mb-4">
                    <strong>We do not sell, rent, or trade your personal information or spiritual conversations to third parties.</strong>
                  </p>

                  <h4 className="font-semibold mb-2">Limited Sharing May Occur:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>AI Service Provider:</strong> Conversation content is shared with our AI service provider (DeepSeek) to generate biblical responses. They are contractually obligated to protect your data.</li>
                    <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or to protect the safety of users.</li>
                    <li><strong>Service Providers:</strong> Trusted partners who help operate our service under strict confidentiality agreements.</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Your Rights */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Privacy Rights</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Access:</strong> Request information about what personal data we have about you.</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate personal information.</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data, subject to legal and operational requirements.</li>
                    <li><strong>Data Portability:</strong> Request a copy of your conversation history in a portable format.</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from promotional communications at any time.</li>
                  </ul>

                  <p className="mt-4">
                    To exercise these rights, please contact us at <a href="mailto:info@f-ai-th-connect.online" className="text-blue-600 hover:underline">info@f-ai-th-connect.online</a>.
                  </p>
                </CardContent>
              </Card>

              {/* Data Retention */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Retention</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Conversation History:</strong> Stored during your session and for a reasonable period to improve service quality.</li>
                    <li><strong>Uploaded Files:</strong> Temporarily processed and deleted after Bible study generation.</li>
                    <li><strong>Contact Information:</strong> Retained as long as necessary to provide support and services.</li>
                    <li><strong>Usage Analytics:</strong> Aggregated and anonymized data may be retained longer for service improvement.</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Children's Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle>Children's Privacy</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    F-AI-TH-Connect is intended for users 13 years of age and older. We do not knowingly collect personal 
                    information from children under 13. If we become aware that we have collected such information, 
                    we will take steps to delete it promptly.
                  </p>
                  <p className="mt-4">
                    We encourage parents and guardians to monitor their children's online activities and discuss 
                    appropriate use of Christian resources.
                  </p>
                </CardContent>
              </Card>

              {/* Policy Changes */}
              <Card>
                <CardHeader>
                  <CardTitle>Changes to This Policy</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or for 
                    legal, operational, or regulatory reasons. We will notify you of significant changes by posting 
                    the updated policy on our website and updating the "Last updated" date.
                  </p>
                  <p className="mt-4">
                    Your continued use of F-AI-TH-Connect after any changes indicates your acceptance of the updated Privacy Policy.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span>Contact Us About Privacy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    If you have questions, concerns, or requests regarding this Privacy Policy or how we handle 
                    your personal information, please contact us:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Email:</strong> info@f-ai-th-connect.online</p>
                    <p><strong>Subject Line:</strong> Privacy Policy Inquiry</p>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    We are committed to addressing your privacy concerns promptly and transparently.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <DailyVerseCard />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Pages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setLocation("/terms")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Terms of Service
                </Button>
                <Button
                  onClick={() => setLocation("/contact")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
                <Button
                  onClick={() => setLocation("/help")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Help Center
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}