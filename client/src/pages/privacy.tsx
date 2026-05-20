import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Shield, Lock, Eye, Database, Mail } from "lucide-react";
import DailyVerseCard from "@/components/daily-verse/daily-verse-card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Privacy() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const p = t.privacy;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold faith-gradient-text mb-4">{p.pageTitle}</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">{p.pageSubtext}</p>
              <p className="text-sm text-gray-500 mt-4">{p.lastUpdated}</p>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-blue-500" />
                    <span>{p.s1Title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <h4 className="font-semibold mb-2">{p.s1ConvH}</h4>
                  <p className="mb-4">{p.s1ConvP}</p>
                  <h4 className="font-semibold mb-2">{p.s1FileH}</h4>
                  <p className="mb-4">{p.s1FileP}</p>
                  <h4 className="font-semibold mb-2">{p.s1UsageH}</h4>
                  <p className="mb-4">{p.s1UsageP}</p>
                  <h4 className="font-semibold mb-2">{p.s1TechH}</h4>
                  <p>{p.s1TechP}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-green-500" />
                    <span>{p.s2Title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>{p.s2_1bold}</strong> {p.s2_1text}</li>
                    <li><strong>{p.s2_2bold}</strong> {p.s2_2text}</li>
                    <li><strong>{p.s2_3bold}</strong> {p.s2_3text}</li>
                    <li><strong>{p.s2_4bold}</strong> {p.s2_4text}</li>
                    <li><strong>{p.s2_5bold}</strong> {p.s2_5text}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-purple-500" />
                    <span>{p.s3Title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <h4 className="font-semibold mb-2">{p.s3TransH}</h4>
                  <p className="mb-4">{p.s3TransP}</p>
                  <h4 className="font-semibold mb-2">{p.s3AccessH}</h4>
                  <p className="mb-4">{p.s3AccessP}</p>
                  <h4 className="font-semibold mb-2">{p.s3MinH}</h4>
                  <p className="mb-4">{p.s3MinP}</p>
                  <h4 className="font-semibold mb-2">{p.s3ReviewH}</h4>
                  <p>{p.s3ReviewP}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{p.s4Title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p className="mb-4"><strong>{p.s4Intro}</strong></p>
                  <h4 className="font-semibold mb-2">{p.s4LimitedH}</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>{p.s4_1bold}</strong> {p.s4_1text}</li>
                    <li><strong>{p.s4_2bold}</strong> {p.s4_2text}</li>
                    <li><strong>{p.s4_3bold}</strong> {p.s4_3text}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{p.s5Title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>{p.s5_1bold}</strong> {p.s5_1text}</li>
                    <li><strong>{p.s5_2bold}</strong> {p.s5_2text}</li>
                    <li><strong>{p.s5_3bold}</strong> {p.s5_3text}</li>
                    <li><strong>{p.s5_4bold}</strong> {p.s5_4text}</li>
                    <li><strong>{p.s5_5bold}</strong> {p.s5_5text}</li>
                  </ul>
                  <p className="mt-4">
                    {p.s5Contact} <a href="mailto:info@f-ai-th-connect.online" className="text-blue-600 hover:underline">info@f-ai-th-connect.online</a>.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{p.s6Title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>{p.s6_1bold}</strong> {p.s6_1text}</li>
                    <li><strong>{p.s6_2bold}</strong> {p.s6_2text}</li>
                    <li><strong>{p.s6_3bold}</strong> {p.s6_3text}</li>
                    <li><strong>{p.s6_4bold}</strong> {p.s6_4text}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{p.s7Title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>{p.s7P1}</p>
                  <p className="mt-4">{p.s7P2}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{p.s8Title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>{p.s8P1}</p>
                  <p className="mt-4">{p.s8P2}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span>{p.s9Title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{p.s9P1}</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>{p.s9EmailLabel}</strong> info@f-ai-th-connect.online</p>
                    <p><strong>{p.s9SubjectLabel}</strong> {p.s9SubjectVal}</p>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">{p.s9Commitment}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="w-full lg:w-80 space-y-6">
            <DailyVerseCard />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{p.sidebarTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => setLocation("/terms")} variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  {p.sidebarTerms}
                </Button>
                <Button onClick={() => setLocation("/contact")} variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  {p.sidebarContact}
                </Button>
                <Button onClick={() => setLocation("/help")} variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  {p.sidebarHelp}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
