import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Download
} from "lucide-react";
import { useLocation } from "wouter";

// Mock data for demonstration - in real app, this would come from your API
const mockStats = {
  totalSessions: 156,
  totalMessages: 1247,
  avgSessionLength: 8.5,
  topicBreakdown: {
    prayer: 34,
    bible_study: 28,
    life_guidance: 22,
    theology: 16
  },
  dailyUsage: [
    { date: "2025-07-15", sessions: 12, messages: 89 },
    { date: "2025-07-16", sessions: 18, messages: 134 },
    { date: "2025-07-17", sessions: 15, messages: 112 },
    { date: "2025-07-18", sessions: 22, messages: 167 },
    { date: "2025-07-19", sessions: 19, messages: 145 },
    { date: "2025-07-20", sessions: 25, messages: 189 },
    { date: "2025-07-21", sessions: 16, messages: 121 },
  ]
};

const mockRecentSessions = [
  {
    id: "session_1753100761868_b7pvsdmd36",
    createdAt: "2025-07-21T12:26:01Z",
    messageCount: 8,
    lastActivity: "2025-07-21T12:35:22Z",
    topic: "Prayer and Faith",
    status: "completed"
  },
  {
    id: "session_1753100690500_7cqwawadgxw",
    createdAt: "2025-07-21T12:24:50Z",
    messageCount: 12,
    lastActivity: "2025-07-21T12:26:01Z",
    topic: "Bible Study Creation",
    status: "deleted"
  },
  {
    id: "session_1753100429016_7m5f547nxmn",
    createdAt: "2025-07-21T12:20:29Z",
    messageCount: 6,
    lastActivity: "2025-07-21T12:22:34Z",
    topic: "Spiritual Guidance",
    status: "completed"
  }
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const exportData = () => {
    // In a real app, this would trigger a data export
    const data = {
      stats: mockStats,
      sessions: mockRecentSessions,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faith-connect-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                +18% from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Session Length</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.avgSessionLength}</div>
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
                {mockStats.dailyUsage[mockStats.dailyUsage.length - 1]?.sessions || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                sessions today
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
            <TabsTrigger value="topics">Popular Topics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Usage Trend</CardTitle>
                  <CardDescription>Sessions and messages over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockStats.dailyUsage.map((day, index) => (
                      <div key={day.date} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{formatDate(day.date)}</span>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-600">
                            {day.sessions} sessions
                          </div>
                          <div className="text-sm text-gray-600">
                            {day.messages} messages
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scripture References</CardTitle>
                  <CardDescription>Most referenced Bible verses this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">John 3:16</span>
                      <Badge variant="secondary">24 times</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Philippians 4:13</span>
                      <Badge variant="secondary">18 times</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Jeremiah 29:11</span>
                      <Badge variant="secondary">15 times</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Romans 8:28</span>
                      <Badge variant="secondary">12 times</Badge>
                    </div>
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
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {mockRecentSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{session.topic}</span>
                            <Badge variant={session.status === 'completed' ? 'default' : 'destructive'}>
                              {session.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            Session ID: {session.id.slice(-8)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {session.messageCount} messages • Started {formatTime(session.createdAt)}
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          Last active: {formatTime(session.lastActivity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
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
                <div className="space-y-4">
                  {Object.entries(mockStats.topicBreakdown).map(([topic, count]) => (
                    <div key={topic} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span className="font-medium capitalize">{topic.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-600">{count} conversations</div>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-amber-500 h-2 rounded-full"
                            style={{ width: `${(count / Math.max(...Object.values(mockStats.topicBreakdown))) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure your F-AI-TH-Connect application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">AI Configuration</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>DeepSeek API: Connected ✓</div>
                    <div>Token Limit: 1200 for large content, 600 for regular</div>
                    <div>Timeout: 60 seconds for processing</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">File Processing</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Max File Size: 5MB</div>
                    <div>Supported: PDF, DOCX, TXT</div>
                    <div>PDF Parser: pdf-parse library</div>
                    <div>Word Parser: mammoth library</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Database</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Storage: In-memory (development)</div>
                    <div>Sessions: Auto-cleanup enabled</div>
                    <div>Messages: Stored per session</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}