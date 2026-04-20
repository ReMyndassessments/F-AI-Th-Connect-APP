import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FeatureFlagsTab from "@/components/admin/feature-flags-tab";
import AdvertisementsTab from "@/components/admin/advertisements-tab";
import { PasswordChangeTab } from "@/components/admin/password-change-tab";
import MissionsTab from "@/components/admin/missions-tab";

import DailyVerseCard from "@/components/daily-verse/daily-verse-card";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Clock,
  FileText,
  BarChart3,
  Shield,
  Settings,
  Home,
  Download,
  Flag,
  Eye
} from "lucide-react";
import { useLocation } from "wouter";

// Analytics interface
interface Analytics {
  totalSessions: number;
  totalMessages: number;
  avgMessagesPerSession: number;
  activeSessionsToday: number;
  totalAdImpressions: number;
  totalAdClicks: number;
  avgCTR: number;
  topPlacements: Array<{placement: string; impressions: number; clicks: number; ctr: number}>;
  dailyStats: Array<{date: string; sessions: number; messages: number; impressions: number; clicks: number}>;
  sessionDurations: Array<number>;
  messageVolumeTrends: Array<{hour: number; count: number}>;
  pageViewsTotal: number;
  pageViewsToday: number;
  topPages: Array<{page: string; count: number}>;
  featureUsageTotal: number;
  featureUsageToday: number;
  topFeatures: Array<{feature: string; count: number}>;
  dailyVisits: Array<{date: string; pageViews: number; featureEvents: number}>;
}

// Analytics data fetching
const useAnalytics = () => {
  return useQuery<Analytics>({
    queryKey: ["/api/analytics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const { user, isLoading, isAuthenticated, logout } = useAdminAuth();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const exportData = () => {
    // Export current dashboard data
    const data = {
      analytics: analytics || null,
      exportDate: new Date().toISOString(),
      note: (analytics?.totalSessions ?? 0) > 0 ? "Live analytics data" : "Fresh installation with no usage data yet"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `f-ai-th-connect-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Admin dashboard data has been exported successfully.",
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out.",
        variant: "destructive",
      });
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show message if not authenticated (while redirecting)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            Access denied. Redirecting to login...
          </AlertDescription>
        </Alert>
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
                size="sm"
                onClick={() => setLocation("/")}
                className="flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Back to App</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold faith-gradient-text">Admin Dashboard</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user?.username}</span>
              </span>
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Daily Verse and Stats */}
        <div className="mb-8">
          <div className="mb-6">
            <DailyVerseCard variant="compact" />
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsLoading ? "..." : (analytics?.totalSessions || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {(analytics?.totalSessions ?? 0) > 0 ? "Active user conversations" : "No sessions yet"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsLoading ? "..." : (analytics?.totalMessages || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {(analytics?.totalMessages ?? 0) > 0 ? "User engagement messages" : "No messages yet"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Session Length</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsLoading ? "..." : (analytics?.avgMessagesPerSession || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                messages per session
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsLoading ? "..." : (analytics?.activeSessionsToday || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                sessions in last 24h
              </p>
            </CardContent>
          </Card>
          </div>

          {/* Visitor & Usage Analytics */}
          <div className="mt-8 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Visitor & Feature Usage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Page Visits</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {analyticsLoading ? "..." : (analytics?.pageViewsTotal || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.pageViewsToday || 0} visits today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Feature Interactions</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {analyticsLoading ? "..." : (analytics?.featureUsageTotal || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.featureUsageToday || 0} interactions today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Most Visited Page</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600 capitalize">
                    {analyticsLoading ? "..." : (analytics?.topPages?.[0]?.page?.replace('_', ' ') || "—")}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.topPages?.[0]?.count || 0} visits
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Feature Used</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600 capitalize" style={{fontSize: '1rem', paddingTop: '0.35rem'}}>
                    {analyticsLoading ? "..." : (analytics?.topFeatures?.[0]?.feature?.replace(/_/g, ' ') || "—")}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.topFeatures?.[0]?.count || 0} uses
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Page & Feature Breakdown */}
            {analytics && (analytics.pageViewsTotal > 0 || analytics.featureUsageTotal > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Pages Visited</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analytics.topPages.length === 0 ? (
                      <p className="text-sm text-gray-400">No visits recorded yet</p>
                    ) : (
                      <div className="space-y-2">
                        {analytics.topPages.map(p => (
                          <div key={p.page} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{p.page.replace(/_/g, ' ')}</span>
                            <div className="flex items-center gap-2">
                              <div className="h-2 bg-blue-400 rounded" style={{width: `${Math.max(8, (p.count / (analytics.topPages[0]?.count || 1)) * 80)}px`}} />
                              <span className="text-xs text-gray-500 w-8 text-right">{p.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Features Used</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analytics.topFeatures.length === 0 ? (
                      <p className="text-sm text-gray-400">No feature interactions yet</p>
                    ) : (
                      <div className="space-y-2">
                        {analytics.topFeatures.map(f => (
                          <div key={f.feature} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{f.feature.replace(/_/g, ' ')}</span>
                            <div className="flex items-center gap-2">
                              <div className="h-2 bg-green-400 rounded" style={{width: `${Math.max(8, (f.count / (analytics.topFeatures[0]?.count || 1)) * 80)}px`}} />
                              <span className="text-xs text-gray-500 w-8 text-right">{f.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 7-day visits chart */}
            {analytics?.dailyVisits && analytics.dailyVisits.some(d => d.pageViews > 0 || d.featureEvents > 0) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-sm">7-Day Visitor Activity</CardTitle>
                  <CardDescription>Page visits and feature interactions per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-32 border-b mb-3">
                    {analytics.dailyVisits.map(day => {
                      const maxVal = Math.max(...analytics.dailyVisits.map(d => d.pageViews + d.featureEvents), 1);
                      const total = day.pageViews + day.featureEvents;
                      const h = Math.round((total / maxVal) * 100);
                      return (
                        <div key={day.date} className="flex flex-col items-center flex-1 mx-0.5">
                          <div className="w-full flex flex-col items-center">
                            <div className="w-6 bg-blue-400 rounded-t" style={{height: `${h}px`}} title={`${day.pageViews} views, ${day.featureEvents} interactions`} />
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">
                            {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded inline-block" /> Page visits + interactions</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Advertisement Analytics for Potential Advertisers */}
          <div className="mt-8 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Advertisement Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {analyticsLoading ? "..." : (analytics?.totalAdImpressions || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ad views across all placements
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {analyticsLoading ? "..." : (analytics?.totalAdClicks || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    User engagement with ads
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">
                    {analyticsLoading ? "..." : `${analytics?.avgCTR || 0}%`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Click-through rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Placements</CardTitle>
                  <Flag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {analyticsLoading ? "..." : (analytics?.topPlacements?.length || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available ad positions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Top Performing Placements */}
          {analytics?.topPlacements && analytics.topPlacements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-3">Top Performing Ad Placements</h3>
              <div className="grid gap-3">
                {analytics.topPlacements.slice(0, 3).map((placement, index) => (
                  <Card key={placement.placement}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium capitalize">
                            {placement.placement.replace('_', ' ')} 
                            {index === 0 && <Badge className="ml-2 text-xs">Best Performer</Badge>}
                          </p>
                          <p className="text-sm text-gray-600">
                            {placement.impressions} impressions • {placement.clicks} clicks
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{placement.ctr}%</div>
                          <div className="text-xs text-gray-500">CTR</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Value Proposition for Potential Advertisers */}
          {analytics && (analytics.totalSessions > 0 || analytics.totalMessages > 0) && (
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-amber-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Advertiser Value Proposition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Engaged Audience</h4>
                    <ul className="text-sm space-y-1">
                      <li>• {analytics.totalSessions} total conversation sessions</li>
                      <li>• {analytics.avgMessagesPerSession} messages per session average</li>
                      <li>• {analytics.activeSessionsToday} active users in last 24h</li>
                      <li>• 100% Christian-focused audience seeking spiritual guidance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Performance Metrics</h4>
                    <ul className="text-sm space-y-1">
                      <li>• {analytics.avgCTR}% average click-through rate</li>
                      <li>• {analytics.totalAdImpressions} total ad impressions</li>
                      <li>• {analytics.topPlacements?.length || 0} strategic placement options</li>
                      <li>• Real-time analytics and performance tracking</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Performance Chart */}
          {analytics?.dailyStats && analytics.dailyStats.some(day => day.sessions > 0) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>7-Day Performance Overview</CardTitle>
                <CardDescription>User activity and advertisement performance trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  {/* Simple bar chart representation */}
                  <div className="flex items-end justify-between h-48 border-b">
                    {analytics.dailyStats.map((day, index) => {
                      const maxSessions = Math.max(...analytics.dailyStats.map(d => d.sessions));
                      const height = maxSessions > 0 ? (day.sessions / maxSessions) * 180 : 0;
                      return (
                        <div key={day.date} className="flex flex-col items-center flex-1 mx-1">
                          <div className="flex flex-col items-center mb-2">
                            <div 
                              className="bg-blue-500 w-8 rounded-t"
                              style={{ height: `${height}px` }}
                              title={`${day.sessions} sessions, ${day.messages} messages`}
                            ></div>
                            <div className="text-xs mt-1 text-center">
                              <div className="font-semibold">{day.sessions}</div>
                              <div className="text-gray-500">
                                {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                      Sessions per day
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <div className="overflow-x-auto pb-1 -mx-1 px-1">
            <TabsList className="flex w-max min-w-full gap-0">
              <TabsTrigger value="overview" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-4">Overview</TabsTrigger>
              <TabsTrigger value="sessions" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-4">Sessions</TabsTrigger>
              <TabsTrigger value="topics" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-4">Topics</TabsTrigger>
              <TabsTrigger value="missions" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-4 flex items-center gap-1">
                🌏 <span>Missions</span>
              </TabsTrigger>
              <TabsTrigger value="feature-flags" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-4 flex items-center gap-1">
                <Flag className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Features</span>
                <span className="sm:hidden">Flags</span>
              </TabsTrigger>
              <TabsTrigger value="advertisements" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-4 flex items-center gap-1">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Ads</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-4">Settings</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Usage Trend</CardTitle>
                  <CardDescription>Sessions and messages over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-500 text-sm">No usage data available yet</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scripture References</CardTitle>
                  <CardDescription>Most referenced Bible verses this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-500 text-sm">No scripture references tracked yet</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Chat Sessions</CardTitle>
                <CardDescription>Latest spiritual conversations and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">No chat sessions yet</p>
                    <p className="text-gray-400 text-xs mt-1">Sessions will appear here as users start conversations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="topics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Popular Discussion Topics</CardTitle>
                <CardDescription>Most common spiritual conversation themes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No conversation topics tracked yet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          

          
          <TabsContent value="missions" className="space-y-4">
            <MissionsTab />
          </TabsContent>

          <TabsContent value="feature-flags" className="space-y-4">
            <FeatureFlagsTab />
          </TabsContent>
          
          <TabsContent value="advertisements" className="space-y-4">
            <AdvertisementsTab />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <PasswordChangeTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}