import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Calendar,
  Users,
  BarChart3,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Advertisement {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  linkUrl: string | null;
  type: "book" | "course" | "event" | "ministry" | "other";
  placement: "chat_sidebar" | "between_messages" | "home_banner" | "footer";
  active: boolean;
  priority: number;
  targetAudience: string | null;
  titleTl: string | null;
  titleZh: string | null;
  descriptionTl: string | null;
  descriptionZh: string | null;
  targetAudienceTl: string | null;
  targetAudienceZh: string | null;
  startDate: string | null;
  endDate: string | null;
  clickCount: number;
  impressionCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdvertisementsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  // Fetch advertisements
  const { data: adsData, isLoading } = useQuery({
    queryKey: ["/api/advertisements"],
  }) as { data: { advertisements: Advertisement[] } | undefined; isLoading: boolean };

  // Create advertisement mutation
  const createAdMutation = useMutation({
    mutationFn: (adData: any) =>
      fetch("/api/advertisements", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adData),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/advertisements"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Advertisement created",
        description: "Your faith-based promotion has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create advertisement.",
        variant: "destructive",
      });
    },
  });

  // Update advertisement mutation
  const updateAdMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      fetch(`/api/advertisements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/advertisements"] });
      setEditingAd(null);
      toast({
        title: "Advertisement updated",
        description: "Changes saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update advertisement.",
        variant: "destructive",
      });
    },
  });

  // Delete advertisement mutation
  const deleteAdMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/advertisements/${id}`, {
        method: 'DELETE',
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/advertisements"] });
      toast({
        title: "Advertisement deleted",
        description: "The promotion has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete advertisement.",
        variant: "destructive",
      });
    },
  });

  const handleCreateAd = (formData: FormData) => {
    const adData = {
      title: formData.get('title'),
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl') || null,
      linkUrl: formData.get('linkUrl') || null,
      type: formData.get('type'),
      placement: formData.get('placement'),
      active: formData.get('active') === 'true',
      priority: parseInt(formData.get('priority') as string) || 0,
      targetAudience: formData.get('targetAudience') || null,
      titleTl: formData.get('titleTl') || null,
      titleZh: formData.get('titleZh') || null,
      descriptionTl: formData.get('descriptionTl') || null,
      descriptionZh: formData.get('descriptionZh') || null,
      targetAudienceTl: formData.get('targetAudienceTl') || null,
      targetAudienceZh: formData.get('targetAudienceZh') || null,
      startDate: formData.get('startDate') || null,
      endDate: formData.get('endDate') || null,
    };
    createAdMutation.mutate(adData);
  };

  const handleToggleActive = (id: number, active: boolean) => {
    updateAdMutation.mutate({ id, data: { active } });
  };

  const handleUpdateAd = (id: number, formData: FormData) => {
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string || null,
      linkUrl: formData.get('linkUrl') as string || null,
      type: formData.get('type') as string,
      placement: formData.get('placement') as string,
      priority: parseInt(formData.get('priority') as string) || 1,
      targetAudience: formData.get('targetAudience') as string || null,
      titleTl: formData.get('titleTl') as string || null,
      titleZh: formData.get('titleZh') as string || null,
      descriptionTl: formData.get('descriptionTl') as string || null,
      descriptionZh: formData.get('descriptionZh') as string || null,
      targetAudienceTl: formData.get('targetAudienceTl') as string || null,
      targetAudienceZh: formData.get('targetAudienceZh') as string || null,
    };

    updateAdMutation.mutate({ id, data });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return <BookOpen className="w-4 h-4" />;
      case 'course': return <Users className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'ministry': return <Eye className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getPlacementBadge = (placement: string) => {
    const badges = {
      chat_sidebar: { label: "Chat Sidebar", color: "bg-blue-100 text-blue-800" },
      between_messages: { label: "Between Messages", color: "bg-purple-100 text-purple-800" },
      home_banner: { label: "Home Banner", color: "bg-green-100 text-green-800" },
      footer: { label: "Footer", color: "bg-gray-100 text-gray-800" },
    };
    const badge = badges[placement as keyof typeof badges];
    return (
      <Badge className={badge.color}>
        {badge.label}
      </Badge>
    );
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

  const advertisements = adsData?.advertisements || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Faith-Based Advertisements</CardTitle>
              <CardDescription>
                Manage tasteful promotions for Christian books, courses, events, and ministries
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="faith-button-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Advertisement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Advertisement</DialogTitle>
                  <DialogDescription>
                    Add a tasteful faith-based promotion that will enrich your users' spiritual journey
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateAd(new FormData(e.target as HTMLFormElement));
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input name="title" placeholder="Christian Book Title" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select name="type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="book">Book</SelectItem>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="ministry">Ministry</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea name="description" placeholder="Brief description of this faith-based resource..." required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Image URL (Optional)</label>
                      <Input name="imageUrl" type="url" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Link URL (Optional)</label>
                      <Input name="linkUrl" type="url" placeholder="https://..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Placement</label>
                      <Select name="placement" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select placement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chat_sidebar">Chat Sidebar</SelectItem>
                          <SelectItem value="between_messages">Between Messages</SelectItem>
                          <SelectItem value="home_banner">Home Banner</SelectItem>
                          <SelectItem value="footer">Footer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority (0-10)</label>
                      <Input name="priority" type="number" min="0" max="10" defaultValue="0" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target Audience (Optional)</label>
                    <Input name="targetAudience" placeholder="e.g., New believers, Bible study groups..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Start Date (Optional)</label>
                      <Input name="startDate" type="datetime-local" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date (Optional)</label>
                      <Input name="endDate" type="datetime-local" />
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">🌏 Translations (Optional)</p>
                    <p className="text-xs text-gray-500 mb-3">Leave blank to show the English text for all languages.</p>
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-blue-700">🇵🇭 Tagalog</p>
                      <div className="grid grid-cols-1 gap-2">
                        <Input name="titleTl" placeholder="Title in Tagalog" />
                        <Textarea name="descriptionTl" placeholder="Description in Tagalog" rows={2} />
                        <Input name="targetAudienceTl" placeholder="Target audience in Tagalog" />
                      </div>
                      <p className="text-xs font-medium text-red-700">🇨🇳 Chinese (中文)</p>
                      <div className="grid grid-cols-1 gap-2">
                        <Input name="titleZh" placeholder="Title in Chinese (标题)" />
                        <Textarea name="descriptionZh" placeholder="Description in Chinese (描述)" rows={2} />
                        <Input name="targetAudienceZh" placeholder="Target audience in Chinese (目标受众)" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" name="active" value="true" id="active" />
                    <label htmlFor="active" className="text-sm font-medium">Make active immediately</label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createAdMutation.isPending}>
                      Create Advertisement
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Advertisement Dialog */}
            <Dialog open={!!editingAd} onOpenChange={() => setEditingAd(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Advertisement</DialogTitle>
                  <DialogDescription>
                    Update this faith-based promotion
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (editingAd) {
                    handleUpdateAd(editingAd.id, new FormData(e.target as HTMLFormElement));
                  }
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input name="title" defaultValue={editingAd?.title || ""} placeholder="Christian Book Title" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select name="type" defaultValue={editingAd?.type || ""} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="book">Book</SelectItem>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="ministry">Ministry</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea name="description" defaultValue={editingAd?.description || ""} placeholder="Brief description of this faith-based resource..." required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Image URL (Optional)</label>
                      <Input name="imageUrl" type="url" defaultValue={editingAd?.imageUrl || ""} placeholder="https://..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Link URL (Optional)</label>
                      <Input name="linkUrl" type="url" defaultValue={editingAd?.linkUrl || ""} placeholder="https://..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Placement</label>
                      <Select name="placement" defaultValue={editingAd?.placement || ""} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select placement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chat_sidebar">Chat Sidebar</SelectItem>
                          <SelectItem value="home_banner">Home Banner</SelectItem>
                          <SelectItem value="between_messages">Between Messages</SelectItem>
                          <SelectItem value="footer">Footer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Input name="priority" type="number" min="1" defaultValue={editingAd?.priority || 1} placeholder="1" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target Audience (Optional)</label>
                    <Input name="targetAudience" defaultValue={editingAd?.targetAudience || ""} placeholder="Christians interested in..." />
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">🌏 Translations (Optional)</p>
                    <p className="text-xs text-gray-500 mb-3">Leave blank to show the English text for all languages.</p>
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-blue-700">🇵🇭 Tagalog</p>
                      <div className="grid grid-cols-1 gap-2">
                        <Input name="titleTl" defaultValue={editingAd?.titleTl || ""} placeholder="Title in Tagalog" />
                        <Textarea name="descriptionTl" defaultValue={editingAd?.descriptionTl || ""} placeholder="Description in Tagalog" rows={2} />
                        <Input name="targetAudienceTl" defaultValue={editingAd?.targetAudienceTl || ""} placeholder="Target audience in Tagalog" />
                      </div>
                      <p className="text-xs font-medium text-red-700">🇨🇳 Chinese (中文)</p>
                      <div className="grid grid-cols-1 gap-2">
                        <Input name="titleZh" defaultValue={editingAd?.titleZh || ""} placeholder="Title in Chinese (标题)" />
                        <Textarea name="descriptionZh" defaultValue={editingAd?.descriptionZh || ""} placeholder="Description in Chinese (描述)" rows={2} />
                        <Input name="targetAudienceZh" defaultValue={editingAd?.targetAudienceZh || ""} placeholder="Target audience in Chinese (目标受众)" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setEditingAd(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="faith-button-primary" disabled={updateAdMutation.isPending}>
                      {updateAdMutation.isPending ? "Updating..." : "Update Advertisement"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {advertisements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No advertisements created yet.</p>
                  <p className="text-sm">Start by adding your first faith-based promotion.</p>
                </div>
              ) : (
                advertisements.map((ad) => (
                  <div key={ad.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getTypeIcon(ad.type)}
                          <h4 className="font-medium">{ad.title}</h4>
                          {getPlacementBadge(ad.placement)}
                          <Badge variant={ad.active ? "default" : "secondary"}>
                            {ad.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{ad.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Priority: {ad.priority}</span>
                          <span>Clicks: {ad.clickCount}</span>
                          <span>Views: {ad.impressionCount}</span>
                          {ad.linkUrl && (
                            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Link
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={ad.active}
                          onCheckedChange={(active) => handleToggleActive(ad.id, active)}
                          disabled={updateAdMutation.isPending}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingAd(ad)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAdMutation.mutate(ad.id)}
                          disabled={deleteAdMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}