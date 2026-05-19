import { useState, useEffect } from "react";
import { trackPageView } from "@/hooks/useAnalytics";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Globe, MapPin, User, Church, ArrowRight, PlusCircle, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { MissionGroup } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";

const TYPE_LABELS: Record<string, string> = {
  "short-term": "Short-Term",
  "long-term": "Long-Term",
  local: "Local",
  ongoing: "Ongoing",
};

const TYPE_COLORS: Record<string, string> = {
  "short-term": "bg-blue-100 text-blue-700",
  "long-term": "bg-purple-100 text-purple-700",
  local: "bg-green-100 text-green-700",
  ongoing: "bg-amber-100 text-amber-700",
};

function MissionCard({ group, onClick }: { group: MissionGroup; onClick: () => void }) {
  const { t } = useLanguage();
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200 group"
      onClick={onClick}
    >
      <CardContent className="pt-6 pb-5 px-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-700 transition-colors">
            {group.groupName}
          </h3>
          <Badge className={`shrink-0 text-xs font-medium ${TYPE_COLORS[group.missionType]}`}>
            {TYPE_LABELS[group.missionType]}
          </Badge>
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>{group.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>{group.leaderName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Church className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>{group.church}</span>
          </div>
          {(group.startDate || group.endDate) && (
            <div className="text-xs text-gray-400 pl-5">
              {group.startDate && <span>{group.startDate}</span>}
              {group.startDate && group.endDate && <span> – </span>}
              {group.endDate && <span>{group.endDate}</span>}
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{group.description}</p>

        {group.goalAmount && (
          <div className="bg-amber-50 rounded-lg px-3 py-2 text-xs text-amber-800 font-medium mb-4">
            {t.missions.fundraisingGoal} ₱{group.goalAmount.toLocaleString()}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {t.missions.contactLeader}
          </span>
          <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-medium text-sm">
            {t.missions.viewMission} <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MissionsDirectory() {
  const [, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();
  useEffect(() => { trackPageView('missions'); }, []);

  const { data: groups = [], isLoading, isError } = useQuery<MissionGroup[]>({
    queryKey: ["/api/missions"],
  });

  const filters = [
    { key: "all", label: t.missions.allMissions },
    { key: "short-term", label: t.missions.shortTerm },
    { key: "long-term", label: t.missions.longTerm },
    { key: "local", label: t.missions.localOutreach },
    { key: "ongoing", label: t.missions.ongoing },
  ];

  const filtered = groups.filter(g => {
    const matchesType = activeFilter === "all" || g.missionType === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || [g.groupName, g.destination, g.leaderName, g.church, g.description]
      .some(val => val?.toLowerCase().includes(q));
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-1 text-blue-200 hover:text-white text-sm mb-8 transition-colors"
          >
            <Home className="w-4 h-4" /> {t.missions.home}
          </button>
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{t.missions.title}</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            {t.missions.subtitle}
          </p>
          <Button
            onClick={() => setLocation("/missions/register")}
            className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-6 py-3 text-base shadow-md"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {t.missions.registerMission}
          </Button>
        </div>
      </div>

      {/* Register Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-amber-800">
            <span className="font-semibold">{t.missions.planningTrip}</span> {t.missions.planningTripDesc}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setLocation("/missions/register")}
            className="border-amber-400 text-amber-700 hover:bg-amber-100 whitespace-nowrap"
          >
            {t.missions.joinPartner}
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Search + Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t.missions.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f.key
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white rounded-xl animate-pulse border border-gray-100" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-20 text-gray-500">
            <p>{t.missions.unableToLoad}</p>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-blue-300" />
            </div>
            {groups.length === 0 ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.missions.beFirst}</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  {t.missions.noMissionsYet}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.missions.noResults}</h3>
                <p className="text-gray-500 mb-6">{t.missions.tryAdjusting}</p>
              </>
            )}
            <Button onClick={() => setLocation("/missions/register")} className="bg-blue-600 hover:bg-blue-700 text-white">
              {t.missions.registerMission}
            </Button>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-5">
              {filtered.length} mission{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(g => (
                <MissionCard
                  key={g.id}
                  group={g}
                  onClick={() => setLocation(`/missions/${g.slug}`)}
                />
              ))}
            </div>
          </>
        )}

        {/* Platform CTA */}
        <div className="mt-16 bg-gradient-to-br from-blue-700 to-indigo-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">{t.missions.platformTitle}</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            {t.missions.platformDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setLocation("/chat")}
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold"
            >
              {t.missions.startUsing}
            </Button>
            <Button
              onClick={() => setLocation("/missions/register")}
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              {t.missions.registerGroup}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
