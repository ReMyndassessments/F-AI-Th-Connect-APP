import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Scale, Shield, Heart, AlertTriangle, Mail } from "lucide-react";
import DailyVerseCard from "@/components/daily-verse/daily-verse-card";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle } from "lucide-react";

export default function Terms() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const tm = t.terms;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold faith-gradient-text mb-4">{tm.pageTitle}</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">{tm.pageSubtext}</p>
              <p className="text-sm text-gray-500 mt-4">{tm.lastUpdated}</p>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Scale className="w-5 h-5 text-blue-500" />
                    <span>{tm.s1Title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>{tm.s1P1}</p>
                  <p className="mt-4">{tm.s1P2}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>{tm.s2Title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <h4 className="font-semibold mb-2">{tm.s2ProvH}</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{tm.s2Prov1}</li>
                    <li>{tm.s2Prov2}</li>
                    <li>{tm.s2Prov3}</li>
                    <li>{tm.s2Prov4}</li>
                    <li>{tm.s2Prov5}</li>
                  </ul>
                  <h4 className="font-semibold mb-2 mt-6">{tm.s2NotH}</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{tm.s2Not1}</li>
                    <li>{tm.s2Not2}</li>
                    <li>{tm.s2Not3}</li>
                    <li>{tm.s2Not4}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{tm.s3Title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <h4 className="font-semibold mb-2">{tm.s3AcceptH}</h4>
                  <p className="mb-4">{tm.s3AcceptIntro}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{tm.s3Accept1}</li>
                    <li>{tm.s3Accept2}</li>
                    <li>{tm.s3Accept3}</li>
                    <li>{tm.s3Accept4}</li>
                  </ul>
                  <h4 className="font-semibold mb-2 mt-6">{tm.s3ProhibH}</h4>
                  <p className="mb-4">{tm.s3ProhibIntro}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{tm.s3Prohib1}</li>
                    <li>{tm.s3Prohib2}</li>
                    <li>{tm.s3Prohib3}</li>
                    <li>{tm.s3Prohib4}</li>
                    <li>{tm.s3Prohib5}</li>
                    <li>{tm.s3Prohib6}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <span>{tm.s4Title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <p className="text-amber-800 font-semibold mb-2">{tm.s4ReadLabel}</p>
                    <p className="text-amber-700">{tm.s4ReadText}</p>
                  </div>
                  <h4 className="font-semibold mb-2">{tm.s4RememberH}</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{tm.s4Remember1}</li>
                    <li>{tm.s4Remember2}</li>
                    <li>{tm.s4Remember3}</li>
                    <li>{tm.s4Remember4}</li>
                    <li>{tm.s4Remember5}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{tm.s5Title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <h4 className="font-semibold mb-2">{tm.s5OurH}</h4>
                  <p className="mb-4">{tm.s5OurP}</p>
                  <h4 className="font-semibold mb-2">{tm.s5YourH}</h4>
                  <p className="mb-4">{tm.s5YourP}</p>
                  <h4 className="font-semibold mb-2">{tm.s5FairH}</h4>
                  <p>{tm.s5FairP}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{tm.s6Title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    {tm.s6P1pre}{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600 hover:underline"
                      onClick={() => setLocation("/privacy")}
                    >
                      {tm.s6P1link}
                    </Button>{" "}
                    {tm.s6P1post}
                  </p>
                  <p className="mt-4">{tm.s6P2}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{tm.s7Title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>{tm.s7Intro}</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>{tm.s7_1}</li>
                    <li>{tm.s7_2}</li>
                    <li>{tm.s7_3}</li>
                    <li>{tm.s7_4}</li>
                  </ul>
                  <p className="mt-4">{tm.s7Outro}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{tm.s8Title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>{tm.s8P1}</p>
                  <p className="mt-4">{tm.s8P2}</p>
                  <p className="mt-4 font-semibold text-amber-700">{tm.s8P3}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>{tm.s9Title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>{tm.s9P1}</p>
                  <p className="mt-4">{tm.s9P2}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{tm.s10Title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>{tm.s10P1}</p>
                  <p className="mt-4">{tm.s10P2}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{tm.s11Title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>{tm.s11P1}</p>
                  <p className="mt-4">{tm.s11P2}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{tm.s12Title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>{tm.s12P1}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span>{tm.s13Title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{tm.s13P1}</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>{tm.s13EmailLabel}</strong> info@f-ai-th-connect.online</p>
                    <p><strong>{tm.s13SubjectLabel}</strong> {tm.s13SubjectVal}</p>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">{tm.s13Commitment}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="w-full lg:w-80 space-y-6">
            <DailyVerseCard />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{tm.sidebarTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => setLocation("/privacy")} variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  {tm.sidebarPrivacy}
                </Button>
                <Button onClick={() => setLocation("/contact")} variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  {tm.sidebarContact}
                </Button>
                <Button onClick={() => setLocation("/help")} variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {tm.sidebarHelp}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
