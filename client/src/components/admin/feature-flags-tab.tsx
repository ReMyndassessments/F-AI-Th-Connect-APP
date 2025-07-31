import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApiRequest } from "@/lib/admin-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Settings,
  Eye,
  EyeOff,
  Shield,
  Clock,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeatureFlag {
  id: number;
  name: string;
  description: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FeatureFlagsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch feature flags
  const { data: flagsData, isLoading } = useQuery({
    queryKey: ["/api/feature-flags"],
    queryFn: async () => {
      const response = await adminApiRequest("/api/feature-flags");
      return response.json();
    },
  }) as { data: { flags: FeatureFlag[] } | undefined; isLoading: boolean };

  // Update feature flag mutation
  const updateFlagMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: number; enabled: boolean }) => {
      const response = await adminApiRequest(`/api/feature-flags/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ enabled }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feature-flags"] });
      toast({
        title: "Feature flag updated",
        description: "The setting has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update feature flag.",
        variant: "destructive",
      });
    },
  });

  const handleToggleFlag = (id: number, enabled: boolean) => {
    updateFlagMutation.mutate({ id, enabled });
  };

  const getStatusBadge = (enabled: boolean) => {
    return enabled ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <Eye className="w-3 h-3 mr-1" />
        Enabled
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
        <EyeOff className="w-3 h-3 mr-1" />
        Disabled
      </Badge>
    );
  };

  const getFlagIcon = (flagName: string) => {
    switch (flagName) {
      case "advertisements_enabled":
        return <Shield className="w-5 h-5 text-blue-500" />;
      case "chat_sidebar_ads":
        return <Settings className="w-5 h-5 text-amber-500" />;
      case "home_banner_ads":
        return <Eye className="w-5 h-5 text-green-500" />;
      case "between_messages_ads":
        return <Clock className="w-5 h-5 text-purple-500" />;
      case "pwa_enabled":
        return <Smartphone className="w-5 h-5 text-indigo-500" />;
      default:
        return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const getFlagDisplayName = (flagName: string) => {
    switch (flagName) {
      case "advertisements_enabled":
        return "Advertisement System";
      case "chat_sidebar_ads":
        return "Chat Sidebar Ads";
      case "home_banner_ads":
        return "Home Page Banner Ads";
      case "between_messages_ads":
        return "Between Messages Ads";
      case "pwa_enabled":
        return "Progressive Web App";
      default:
        return flagName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const flags = flagsData?.flags || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Feature Flags & Advertisement Control
          </CardTitle>
          <CardDescription>
            Control which features and advertisement placements are enabled in your F-AI-TH-Connect application.
            Toggle these settings to tastefully integrate faith-based promotions without disrupting the user experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {flags.map((flag) => (
                <div key={flag.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getFlagIcon(flag.name)}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{getFlagDisplayName(flag.name)}</h4>
                        {getStatusBadge(flag.enabled)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {flag.description || "No description provided"}
                      </p>
                      {flag.name.includes('ads') && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md mt-1 inline-block">
                          💡 Advertisement Control: This affects revenue generation
                        </span>
                      )}
                      <p className="text-xs text-gray-400">
                        Last updated: {new Date(flag.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={(enabled) => handleToggleFlag(flag.id, enabled)}
                      disabled={updateFlagMutation.isPending}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advertisement Guidelines</CardTitle>
          <CardDescription>Best practices for tasteful Christian advertising</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
              <p><strong>Faith-Focused Content:</strong> Only promote books, courses, events, and resources that align with Christian values and biblical teachings.</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
              <p><strong>Non-Intrusive Placement:</strong> Ads should complement the spiritual conversation, not interrupt the flow of divine guidance.</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
              <p><strong>Quality Over Quantity:</strong> Show fewer, high-quality ads that truly benefit your users' spiritual journey.</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
              <p><strong>Contextual Relevance:</strong> Match advertisements to the spiritual topics being discussed for maximum value.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}