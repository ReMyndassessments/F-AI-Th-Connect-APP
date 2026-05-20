import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  Heart, 
  Send,
  CheckCircle
} from "lucide-react";
import DailyVerseCard from "@/components/daily-verse/daily-verse-card";

export default function Contact() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
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

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: t.contact.toastTitle,
        description: t.contact.toastDesc,
      });
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.contact.successTitle}</h1>
            <p className="text-xl text-gray-600 mb-8">{t.contact.successText}</p>
            <div className="space-x-4">
              <Button onClick={() => setLocation("/chat")} className="faith-button-primary">
                {t.contact.successChat}
              </Button>
              <Button onClick={() => setLocation("/")} variant="outline">
                {t.contact.successHome}
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold faith-gradient-text mb-4">{t.contact.pageTitle}</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.contact.pageSubtext}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t.contact.sendTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">{t.contact.fieldName}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder={t.contact.namePlaceholder}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{t.contact.fieldEmail}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder={t.contact.emailPlaceholder}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="type">{t.contact.fieldType}</Label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">{t.contact.typeGeneral}</option>
                        <option value="technical">{t.contact.typeTechnical}</option>
                        <option value="feedback">{t.contact.typeFeedback}</option>
                        <option value="prayer">{t.contact.typePrayer}</option>
                        <option value="partnership">{t.contact.typePartnership}</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="subject">{t.contact.fieldSubject}</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder={t.contact.subjectPlaceholder}
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">{t.contact.fieldMessage}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder={t.contact.messagePlaceholder}
                        rows={6}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full faith-button-primary"
                    >
                      {isSubmitting ? (
                        t.contact.sendingBtn
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t.contact.sendBtn}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.contact.getInTouchTitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-blue-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">{t.contact.emailLabel}</h4>
                        <p className="text-gray-600">info@f-ai-th-connect.online</p>
                        <p className="text-sm text-gray-500">{t.contact.emailNote}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">{t.contact.responseLabel}</h4>
                        <p className="text-gray-600">{t.contact.responseTime}</p>
                        <p className="text-sm text-gray-500">{t.contact.responseHours}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-red-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">{t.contact.prayerLabel}</h4>
                        <p className="text-gray-600">{t.contact.prayerNote}</p>
                        <p className="text-sm text-gray-500">{t.contact.prayerPrivacy}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t.contact.partnerTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-1">{t.contact.partnerText}</p>
                    <p className="text-gray-500 text-sm mb-4">
                      {t.contact.partnerSubtext}
                    </p>
                    <Button
                      onClick={() => setLocation("/support")}
                      className="w-full faith-button-primary"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {t.contact.partnerBtn}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 space-y-6">
            <DailyVerseCard />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.contact.quickActionsTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setLocation("/chat")}
                  className="w-full faith-button-primary justify-start"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t.contact.quickChat}
                </Button>
                <Button
                  onClick={() => setLocation("/help")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t.contact.quickHelp}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
