import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Globe, MapPin, User, Church, Calendar, Heart, Share2, ArrowLeft,
  BookOpen, CheckCircle, ExternalLink, Loader2, Home, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "@/components/ui/language-switcher";
import type { MissionGroup } from "@shared/schema";

const TYPE_LABELS: Record<string, string> = {
  "short-term": "Short-Term Mission",
  "long-term": "Long-Term Mission",
  local: "Local Outreach",
  ongoing: "Ongoing Ministry",
};

const TYPE_COLORS: Record<string, string> = {
  "short-term": "bg-blue-100 text-blue-700",
  "long-term": "bg-purple-100 text-purple-700",
  local: "bg-green-100 text-green-700",
  ongoing: "bg-amber-100 text-amber-700",
};


export default function MissionsProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: group, isLoading, isError } = useQuery<MissionGroup>({
    queryKey: ["/api/missions", slug],
    queryFn: async () => {
      const res = await fetch(`/api/missions/${slug}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  function handleShare() {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        toast({ title: "Link copied!", description: "Share this link with anyone who wants to support this mission." });
      });
    } else {
      toast({ title: "Copy this link", description: url });
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (isError || !group) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mission not found</h1>
        <p className="text-gray-500 mb-6">This mission group may be pending approval or the link may be incorrect.</p>
        <Button onClick={() => setLocation("/missions")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> View All Missions
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setLocation("/missions")}
              className="flex items-center gap-1 text-blue-200 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Missions
            </button>
            <div className="flex items-center gap-3">
              <LanguageSwitcher variant="dark" />
              <button
                onClick={() => setLocation("/")}
                className="flex items-center gap-1 text-blue-200 hover:text-white text-sm transition-colors"
              >
                <Home className="w-4 h-4" /> Home
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className={`${TYPE_COLORS[group.missionType]} font-semibold`}>
              {TYPE_LABELS[group.missionType]}
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">{group.groupName}</h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-blue-100">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{group.destination}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <User className="w-4 h-4 shrink-0" />
              <span>{group.leaderName}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <Church className="w-4 h-4 shrink-0" />
              <span>{group.church}</span>
            </div>
            {(group.startDate || group.endDate) && (
              <div className="flex items-center gap-2 text-blue-100">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>
                  {group.startDate || ""}
                  {group.startDate && group.endDate ? " – " : ""}
                  {group.endDate || ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mission Story */}
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6 pb-6 px-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" /> Our Mission
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{group.description}</p>
              </CardContent>
            </Card>

            {/* Prayer Needs */}
            {group.prayerNeeds && (
              <Card className="border-0 shadow-sm bg-indigo-50 border border-indigo-100">
                <CardContent className="pt-6 pb-6 px-6">
                  <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    🙏 Prayer Requests
                  </h2>
                  <p className="text-indigo-800 leading-relaxed whitespace-pre-line">{group.prayerNeeds}</p>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Fundraising Goal */}
            {group.goalAmount && (
              <Card className="border-0 shadow-sm bg-amber-50 border border-amber-100">
                <CardContent className="pt-5 pb-5 px-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">Fundraising Goal</p>
                  <p className="text-3xl font-extrabold text-amber-700">₱{group.goalAmount.toLocaleString()}</p>
                  <p className="text-amber-700 text-xs mt-1">Target for this mission trip</p>
                </CardContent>
              </Card>
            )}

            {/* Contact to Give */}
            <Card className="border-2 border-blue-200 shadow-md">
              <CardContent className="pt-6 pb-6 px-5 space-y-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">💝</div>
                  <h3 className="font-bold text-gray-900 text-lg">Want to Support This Mission?</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                    Reach out directly to the group leader. All giving is arranged personally between you and the mission team — F-AI-TH-Connect does not collect or process donations.
                  </p>
                </div>
                <a
                  href={`mailto:${group.email}?subject=Support for ${encodeURIComponent(group.groupName)}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold transition-all hover:opacity-90 active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                  Contact {group.leaderName}
                </a>
                <p className="text-xs text-gray-400 text-center italic">
                  This opens your email app with the group leader's address pre-filled.
                </p>
              </CardContent>
            </Card>

            {/* Share */}
            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share This Mission
            </Button>

            {/* Website link */}
            {group.websiteUrl && /^https?:\/\//i.test(group.websiteUrl) && (
              <a
                href={group.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Visit their page
              </a>
            )}

            {/* Check mark facts */}
            <Card className="border-0 shadow-sm bg-gray-50">
              <CardContent className="pt-5 pb-5 px-5 space-y-2">
                {[
                  "Reviewed and approved by F-AI-TH-Connect",
                  "F-AI-TH-Connect does not collect or process donations",
                  "All giving is arranged directly between you and the mission team",
                  "Your prayers and support are an act of worship",
                ].map(fact => (
                  <div key={fact} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600">{fact}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Platform CTA */}
        <div className="mt-16 bg-gradient-to-br from-blue-700 to-indigo-700 rounded-2xl p-8 text-white text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-4 text-blue-200" />
          <h2 className="text-2xl font-bold mb-3">Equip Your Own D-Group</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            F-AI-TH-Connect is a free ministry platform for Bible study, D-Group discipleship, and missions preparation. Every tool you need — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setLocation("/chat")}
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold"
            >
              Try It Free
            </Button>
            <Button
              onClick={() => setLocation("/missions/register")}
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Register Your Mission
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
