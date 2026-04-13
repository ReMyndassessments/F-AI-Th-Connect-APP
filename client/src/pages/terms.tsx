import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { MessageCircle, Scale, Shield, Heart, AlertTriangle, Mail } from "lucide-react";
import DailyVerseCard from "@/components/daily-verse/daily-verse-card";

export default function Terms() {
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
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold faith-gradient-text mb-4">Terms of Service</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                These terms govern your use of F-AI-TH-Connect and our Christian ministry platform.
              </p>
              <p className="text-sm text-gray-500 mt-4">Last updated: January 22, 2025</p>
            </div>

            <div className="space-y-8">
              {/* Agreement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Scale className="w-5 h-5 text-blue-500" />
                    <span>Agreement to Terms</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    By accessing and using F-AI-TH-Connect ("the Service"), you agree to be bound by these Terms of Service 
                    ("Terms"). If you do not agree to these Terms, please do not use our Service.
                  </p>
                  <p className="mt-4">
                    F-AI-TH-Connect is a Christian ministry platform designed to provide biblical wisdom, spiritual 
                    support, and faith-based conversations. We are committed to serving the Christian community with 
                    integrity and biblical truth.
                  </p>
                </CardContent>
              </Card>

              {/* Service Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Our Service</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <h4 className="font-semibold mb-2">What We Provide</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Scripture-grounded biblical guidance and spiritual conversations</li>
                    <li>Scripture-based responses to life questions and challenges</li>
                    <li>Bible study creation from uploaded documents</li>
                    <li>Prayer support and Christian encouragement</li>
                    <li>Daily spiritual content and memory verses</li>
                  </ul>

                  <h4 className="font-semibold mb-2 mt-6">What We Are Not</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>A replacement for pastoral counseling or professional therapy</li>
                    <li>A substitute for reading the Bible and personal prayer</li>
                    <li>Professional medical, legal, or financial advice</li>
                    <li>A crisis intervention or emergency service</li>
                  </ul>
                </CardContent>
              </Card>

              {/* User Responsibilities */}
              <Card>
                <CardHeader>
                  <CardTitle>User Responsibilities</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <h4 className="font-semibold mb-2">Acceptable Use</h4>
                  <p className="mb-4">You agree to use F-AI-TH-Connect in a manner consistent with Christian values and principles:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Use the Service for legitimate spiritual guidance and biblical questions</li>
                    <li>Respect the Christian nature and purpose of the platform</li>
                    <li>Be honest and sincere in your spiritual conversations</li>
                    <li>Treat the Service and other users with respect and kindness</li>
                  </ul>

                  <h4 className="font-semibold mb-2 mt-6">Prohibited Activities</h4>
                  <p className="mb-4">You agree not to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Use the Service for harmful, illegal, or unethical purposes</li>
                    <li>Attempt to manipulate or abuse the platform</li>
                    <li>Share content that contradicts core Christian beliefs or values</li>
                    <li>Upload malicious files or attempt to compromise system security</li>
                    <li>Use the Service to harass, threaten, or harm others</li>
                    <li>Violate any applicable laws or regulations</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Spiritual Disclaimer */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <span>Important Spiritual Disclaimer</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <p className="text-amber-800 font-semibold mb-2">Please Read Carefully:</p>
                    <p className="text-amber-700">
                      F-AI-TH-Connect provides AI-generated biblical guidance based on Christian teachings and Scripture. 
                      While we strive for theological accuracy, our responses should complement, not replace, traditional 
                      Christian spiritual practices and pastoral care.
                    </p>
                  </div>

                  <h4 className="font-semibold mb-2">Always Remember:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Seek guidance from your pastor, elder, or trusted Christian mentor for important spiritual decisions</li>
                    <li>Verify biblical interpretations with multiple Christian sources and established theology</li>
                    <li>Continue personal Bible study, prayer, and fellowship with other believers</li>
                    <li>For crisis situations, contact appropriate emergency services or crisis hotlines</li>
                    <li>Responses reflect general Christian principles and may not address your specific denominational beliefs</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Intellectual Property */}
              <Card>
                <CardHeader>
                  <CardTitle>Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <h4 className="font-semibold mb-2">Our Content</h4>
                  <p className="mb-4">
                    The F-AI-TH-Connect service, including its design, functionality, and AI-generated content, 
                    is protected by intellectual property laws. Biblical content and Scripture references remain 
                    the property of their respective publishers and copyright holders.
                  </p>

                  <h4 className="font-semibold mb-2">Your Content</h4>
                  <p className="mb-4">
                    You retain ownership of content you upload or create through the Service. By using F-AI-TH-Connect, 
                    you grant us permission to process your content to provide biblical guidance and generate Bible studies.
                  </p>

                  <h4 className="font-semibold mb-2">Fair Use</h4>
                  <p>
                    You may share AI-generated responses for personal spiritual growth, Bible study, and Christian 
                    fellowship. Commercial use requires written permission.
                  </p>
                </CardContent>
              </Card>

              {/* Privacy and Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Privacy and Data Handling</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    Your privacy and the confidentiality of your spiritual conversations are important to us. 
                    Please review our <Button 
                      variant="link" 
                      className="p-0 h-auto text-blue-600 hover:underline"
                      onClick={() => setLocation("/privacy")}
                    >
                      Privacy Policy
                    </Button> for detailed information about how we collect, use, and protect your information.
                  </p>
                  
                  <p className="mt-4">
                    By using F-AI-TH-Connect, you consent to the data practices described in our Privacy Policy.
                  </p>
                </CardContent>
              </Card>

              {/* Service Availability */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Availability</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    We strive to maintain F-AI-TH-Connect's availability, but we cannot guarantee uninterrupted service. 
                    The Service may be temporarily unavailable due to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Scheduled maintenance and updates</li>
                    <li>Technical issues or system failures</li>
                    <li>Third-party service provider limitations</li>
                    <li>Circumstances beyond our reasonable control</li>
                  </ul>
                  <p className="mt-4">
                    We reserve the right to modify, suspend, or discontinue the Service with reasonable notice 
                    when possible.
                  </p>
                </CardContent>
              </Card>

              {/* Limitation of Liability */}
              <Card>
                <CardHeader>
                  <CardTitle>Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    F-AI-TH-Connect is provided "as is" without warranties of any kind. While we seek to provide 
                    biblically sound guidance, we cannot guarantee the accuracy, completeness, or appropriateness 
                    of AI-generated responses for your specific situation.
                  </p>
                  
                  <p className="mt-4">
                    To the fullest extent permitted by law, we disclaim liability for any direct, indirect, 
                    incidental, or consequential damages arising from your use of the Service, including but not 
                    limited to spiritual, emotional, or personal decisions made based on AI-generated guidance.
                  </p>

                  <p className="mt-4 font-semibold text-amber-700">
                    Always seek appropriate professional help for serious personal, spiritual, medical, or legal matters.
                  </p>
                </CardContent>
              </Card>

              {/* Ministry Partnership */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Ministry Partnership</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    F-AI-TH-Connect operates as a faith-based ministry supported by Christian partners who believe 
                    in our mission. We may display faith-based advertisements and ministry partnership opportunities 
                    that align with Christian values.
                  </p>
                  
                  <p className="mt-4">
                    Your support helps us serve more believers with biblical guidance and maintain this service 
                    as a blessing to the Christian community.
                  </p>
                </CardContent>
              </Card>

              {/* Modifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Changes to Terms</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    We may update these Terms of Service to reflect changes in our service, legal requirements, 
                    or operational needs. We will notify users of significant changes by posting updated terms 
                    and updating the "Last updated" date.
                  </p>
                  
                  <p className="mt-4">
                    Continued use of F-AI-TH-Connect after changes indicates acceptance of the updated Terms. 
                    If you disagree with changes, please discontinue use of the Service.
                  </p>
                </CardContent>
              </Card>

              {/* Termination */}
              <Card>
                <CardHeader>
                  <CardTitle>Termination</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    You may stop using F-AI-TH-Connect at any time. We reserve the right to suspend or terminate 
                    access to the Service for violations of these Terms, inappropriate use, or other circumstances 
                    that compromise the integrity of our Christian mission.
                  </p>
                  
                  <p className="mt-4">
                    Upon termination, your right to use the Service ceases immediately. Provisions regarding 
                    intellectual property, disclaimers, and limitations of liability survive termination.
                  </p>
                </CardContent>
              </Card>

              {/* Governing Law */}
              <Card>
                <CardHeader>
                  <CardTitle>Governing Law</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    These Terms are governed by the laws of the United States and the state in which F-AI-TH-Connect 
                    operates, without regard to conflict of law principles. Any disputes will be resolved through 
                    good faith discussion and, if necessary, binding arbitration in accordance with Christian 
                    principles of reconciliation.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span>Contact Us</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    If you have questions about these Terms of Service or need clarification about our Christian 
                    ministry platform, please contact us:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Email:</strong> info@f-ai-th-connect.online</p>
                    <p><strong>Subject Line:</strong> Terms of Service Inquiry</p>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    We are committed to addressing your concerns in the spirit of Christian service and transparency.
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
                  onClick={() => setLocation("/privacy")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Policy
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
                  <MessageCircle className="w-4 h-4 mr-2" />
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