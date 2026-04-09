import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Heart, 
  Send,
  CheckCircle
} from "lucide-react";
import DailyVerseCard from "@/components/daily-verse/daily-verse-card";

export default function Contact() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (in real app, this would send to backend)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll respond within 24 hours.",
      });
    }, 1500);
  };

  if (isSubmitted) {
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

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for reaching out to us. We've received your message and will respond within 24 hours.
            </p>
            <div className="space-x-4">
              <Button
                onClick={() => setLocation("/chat")}
                className="faith-button-primary"
              >
                Start a Chat
              </Button>
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold faith-gradient-text mb-4">Contact Us</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're here to support you in your faith journey. Reach out with questions, feedback, or prayer requests.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="type">Message Type</Label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">General Question</option>
                        <option value="technical">Technical Support</option>
                        <option value="feedback">Feedback</option>
                        <option value="prayer">Prayer Request</option>
                        <option value="partnership">Partnership Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="Brief description of your message"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Please share your message, question, or prayer request..."
                        rows={6}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full faith-button-primary"
                    >
                      {isSubmitting ? (
                        "Sending Message..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-blue-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">Email Support</h4>
                        <p className="text-gray-600">info@f-ai-th-connect.online</p>
                        <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">Response Time</h4>
                        <p className="text-gray-600">Within 24 hours</p>
                        <p className="text-sm text-gray-500">Monday - Friday, 9 AM - 5 PM EST</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-red-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">Prayer Requests</h4>
                        <p className="text-gray-600">We pray for all requests received</p>
                        <p className="text-sm text-gray-500">Your privacy and confidentiality are important to us</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ministry Partnership</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-1">
                      F-AI-TH-Connect is supported by faithful partners who believe in our mission to provide biblical guidance through technology.
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      F-AI-TH Connect is a corporate ministry of <span className="font-medium text-gray-700">ReMynd Student Services</span>.
                    </p>
                    <Button
                      onClick={() => setLocation("/support")}
                      className="w-full faith-button-primary"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Support Our Ministry
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
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
                  onClick={() => setLocation("/help")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Phone className="w-4 h-4 mr-2" />
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