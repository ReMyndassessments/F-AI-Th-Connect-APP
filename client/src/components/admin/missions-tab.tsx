import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApiRequest } from "@/lib/admin-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Mail, User, Church, MapPin, Calendar, CheckCircle, XCircle, Trash2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { MissionGroup } from "@shared/schema";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

const TYPE_LABELS: Record<string, string> = {
  "short-term": "Short-Term",
  "long-term": "Long-Term",
  local: "Local",
  ongoing: "Ongoing",
};

function MissionRow({ group, onApprove, onReject, onDelete, isPending }: {
  group: MissionGroup;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDelete: (id: number) => void;
  isPending: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border rounded-xl p-4 ${group.status === 'pending' ? 'border-amber-200 bg-amber-50/30' : group.status === 'approved' ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-bold text-gray-900 text-base">{group.groupName}</span>
            <Badge className={`text-xs border ${STATUS_COLORS[group.status]}`}>
              {group.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-xs text-gray-600">
              {TYPE_LABELS[group.missionType]}
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {group.leaderName}
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <a href={`mailto:${group.email}`} className="text-blue-600 hover:underline truncate">{group.email}</a>
            </div>
            <div className="flex items-center gap-1.5">
              <Church className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {group.church}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {group.destination}
            </div>
            {(group.startDate || group.endDate) && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {group.startDate || ""}{group.startDate && group.endDate ? " – " : ""}{group.endDate || ""}
              </div>
            )}
            {group.goalAmount && (
              <div className="text-amber-700 font-medium">
                Goal: ₱{group.goalAmount.toLocaleString()}
              </div>
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? "Hide details" : "Show story & prayer needs"}
          </button>

          {expanded && (
            <div className="mt-3 space-y-3">
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Mission Story</p>
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{group.description}</p>
              </div>
              {group.prayerNeeds && (
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Prayer Needs</p>
                  <p className="text-sm text-indigo-800 whitespace-pre-line leading-relaxed">{group.prayerNeeds}</p>
                </div>
              )}
              {group.donationLink && /^https?:\/\//i.test(group.donationLink) && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Donation link:</span>
                  <a href={group.donationLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 truncate max-w-xs">
                    {group.donationLink.slice(0, 40)}...
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}
              {group.websiteUrl && /^https?:\/\//i.test(group.websiteUrl) && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Website:</span>
                  <a href={group.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {group.status === 'approved' && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Public URL:</span>
                  <a href={`/missions/${group.slug}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline flex items-center gap-1">
                    /missions/{group.slug} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              <p className="text-xs text-gray-400">
                Submitted: {new Date(group.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          {group.status === 'pending' && (
            <>
              <Button
                size="sm"
                onClick={() => onApprove(group.id)}
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(group.id)}
                disabled={isPending}
                className="border-red-300 text-red-600 hover:bg-red-50 text-xs px-3"
              >
                <XCircle className="w-3.5 h-3.5 mr-1" />
                Reject
              </Button>
            </>
          )}
          {group.status === 'approved' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject(group.id)}
              disabled={isPending}
              className="border-amber-300 text-amber-700 hover:bg-amber-50 text-xs px-3"
            >
              <XCircle className="w-3.5 h-3.5 mr-1" />
              Revoke
            </Button>
          )}
          {group.status === 'rejected' && (
            <Button
              size="sm"
              onClick={() => onApprove(group.id)}
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              Approve
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(group.id)}
            disabled={isPending}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs px-3"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function MissionsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: groups = [], isLoading } = useQuery<MissionGroup[]>({
    queryKey: ["/api/admin/missions"],
    queryFn: async () => {
      const res = await adminApiRequest("/api/admin/missions");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await adminApiRequest(`/api/admin/missions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/missions"] });
      toast({ title: `Mission ${status}`, description: `The missions group has been ${status}.` });
    },
    onError: () => {
      toast({ title: "Action failed", description: "Could not update status. Please try again.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await adminApiRequest(`/api/admin/missions/${id}`, { method: "DELETE" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/missions"] });
      toast({ title: "Mission deleted", description: "The missions group has been removed." });
    },
    onError: () => {
      toast({ title: "Delete failed", description: "Could not delete this group.", variant: "destructive" });
    },
  });

  const counts = {
    all: groups.length,
    pending: groups.filter(g => g.status === "pending").length,
    approved: groups.filter(g => g.status === "approved").length,
    rejected: groups.filter(g => g.status === "rejected").length,
  };

  const filtered = filterStatus === "all" ? groups : groups.filter(g => g.status === filterStatus);
  const isMutating = updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Missions Partner Program
          </CardTitle>
          <CardDescription>
            Review and approve missions group registrations. Approved groups appear publicly at /missions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { key: "all", label: "Total", color: "text-gray-700 bg-gray-100" },
              { key: "pending", label: "Pending", color: "text-amber-700 bg-amber-100" },
              { key: "approved", label: "Approved", color: "text-green-700 bg-green-100" },
              { key: "rejected", label: "Rejected", color: "text-red-700 bg-red-100" },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`rounded-xl p-3 text-center transition-all ${filterStatus === key ? color + " ring-2 ring-current ring-opacity-30" : "bg-gray-50 hover:bg-gray-100 text-gray-600"}`}
              >
                <div className="text-2xl font-bold">{counts[key as keyof typeof counts]}</div>
                <div className="text-xs font-medium mt-0.5">{label}</div>
              </button>
            ))}
          </div>

          {/* Transparency reminder */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
            <p className="font-semibold mb-1">Giving Model Reminder</p>
            <p>The platform uses a <strong>90/10 model</strong> — 90% goes directly to each missions group, 10% sustains this ministry. Donors are shown this transparently and can also choose to cover the 10% themselves. Approved groups are responsible for honoring this commitment.</p>
          </div>

          {/* Groups list */}
          {isLoading && (
            <div className="text-center py-12 text-gray-500 text-sm">Loading missions groups...</div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12">
              <Globe className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {filterStatus === "pending" ? "No pending registrations." : filterStatus === "all" ? "No missions groups registered yet." : `No ${filterStatus} groups.`}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {filtered.map(group => (
              <MissionRow
                key={group.id}
                group={group}
                isPending={isMutating}
                onApprove={(id) => updateMutation.mutate({ id, status: "approved" })}
                onReject={(id) => updateMutation.mutate({ id, status: "rejected" })}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
