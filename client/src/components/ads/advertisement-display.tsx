import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, Calendar, Users, Eye, X } from "lucide-react";

interface Advertisement {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  linkUrl: string | null;
  type: "book" | "course" | "event" | "ministry" | "other";
  placement: string;
  active: boolean;
  priority: number;
  targetAudience: string | null;
}

interface AdvertisementDisplayProps {
  placement: "chat_sidebar" | "between_messages" | "home_banner" | "footer";
  onDismiss?: () => void;
  className?: string;
}

export default function AdvertisementDisplay({ placement, onDismiss, className = "" }: AdvertisementDisplayProps) {
  // Check if advertisements are enabled (using public endpoint)
  const { data: flagData } = useQuery({
    queryKey: ["/api/feature-flags/public"],
  }) as { data: { flags: Array<{ name: string; enabled: boolean }> } | undefined };

  // Fetch active advertisements for this placement
  const { data: adsData } = useQuery({
    queryKey: ["/api/advertisements", placement],
    queryFn: () =>
      fetch(`/api/advertisements?placement=${placement}&active=true`).then(res => res.json()),
    enabled: flagData?.flags?.find(f => f.name === "advertisements_enabled")?.enabled || false,
  }) as { data: { advertisements: Advertisement[] } | undefined };

  const advertisements = adsData?.advertisements || [];
  const advertisementsEnabled = flagData?.flags?.find(f => f.name === "advertisements_enabled")?.enabled || false;
  const placementEnabled = flagData?.flags?.find(f => f.name === `${placement}_ads`)?.enabled || false;

  // Record impression when ad is displayed
  useEffect(() => {
    if (advertisements.length > 0 && advertisementsEnabled && placementEnabled) {
      advertisements.forEach(ad => {
        fetch(`/api/advertisements/${ad.id}/impression`, { method: 'POST' })
          .catch(console.error);
      });
    }
  }, [advertisements, advertisementsEnabled, placementEnabled]);

  // Don't show anything if feature is disabled or no ads
  if (!advertisementsEnabled || !placementEnabled || advertisements.length === 0) {
    return null;
  }

  const handleAdClick = (ad: Advertisement) => {
    // Record click
    fetch(`/api/advertisements/${ad.id}/click`, { method: 'POST' })
      .catch(console.error);

    // Open link if available
    if (ad.linkUrl) {
      window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'course': return <Users className="w-4 h-4 text-green-500" />;
      case 'event': return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'ministry': return <Eye className="w-4 h-4 text-amber-500" />;
      default: return <BookOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPlacementStyle = () => {
    switch (placement) {
      case 'chat_sidebar':
        return "w-full lg:max-w-xs"; // Full width on mobile, constrained on desktop
      case 'between_messages':
        return "max-w-2xl mx-auto my-4";
      case 'home_banner':
        return "w-full";
      case 'footer':
        return "w-full";
      default:
        return "";
    }
  };

  // Show first advertisement (highest priority)
  const ad = advertisements[0];

  return (
    <Card className={`${getPlacementStyle()} ${className} border-blue-100 bg-gradient-to-r from-blue-50 to-amber-50`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            {getTypeIcon(ad.type)}
            <Badge variant="outline" className="text-xs bg-white border-blue-200 text-blue-700">
              Recommended
            </Badge>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {ad.imageUrl && (
          <div className="mb-3">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-24 object-cover rounded-md"
              onError={(e) => {
                // Hide image if it fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{ad.title}</h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{ad.description}</p>

        {ad.targetAudience && (
          <p className="text-xs text-blue-600 mb-3">Perfect for: {ad.targetAudience}</p>
        )}

        {ad.linkUrl && (
          <Button
            onClick={() => handleAdClick(ad)}
            size="sm"
            className="w-full bg-gradient-to-r from-blue-500 to-amber-500 hover:from-blue-600 hover:to-amber-600 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        )}

        <div className="mt-2 text-xs text-gray-400 text-center">
          Christian Resource • Faith-Based
        </div>
      </CardContent>
    </Card>
  );
}