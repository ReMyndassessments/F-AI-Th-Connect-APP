import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Globe, Heart, Users, ArrowLeft, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  groupName: z.string().min(2, "Group name must be at least 2 characters").max(100),
  leaderName: z.string().min(2, "Leader name is required").max(100),
  email: z.string().email("Valid email is required"),
  church: z.string().min(2, "Church or organization name is required").max(100),
  destination: z.string().min(2, "Destination is required").max(100),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  missionType: z.enum(["short-term", "long-term", "local", "ongoing"]),
  description: z.string().min(20, "Please write at least 20 characters about your mission").max(2000),
  prayerNeeds: z.string().max(1000).optional(),
  goalAmount: z.string().optional(),
  donationLink: z.string().url("Must be a valid URL starting with https://").optional().or(z.literal("")),
  websiteUrl: z.string().url("Must be a valid URL starting with https://").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function MissionsRegister() {
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [groupName, setGroupName] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      leaderName: "",
      email: "",
      church: "",
      destination: "",
      startDate: "",
      endDate: "",
      missionType: "short-term",
      description: "",
      prayerNeeds: "",
      goalAmount: "",
      donationLink: "",
      websiteUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        ...data,
        goalAmount: data.goalAmount ? parseInt(data.goalAmount) : undefined,
        donationLink: data.donationLink || undefined,
        websiteUrl: data.websiteUrl || undefined,
        prayerNeeds: data.prayerNeeds || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      };
      const res = await apiRequest("POST", "/api/missions/register", payload);
      return res.json();
    },
    onSuccess: (_, variables) => {
      setGroupName(variables.groupName);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Received!</h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for registering <span className="font-semibold text-blue-700">{groupName}</span> as a Missions Partner.
          </p>
          <Card className="bg-blue-50 border-blue-200 mb-8">
            <CardContent className="pt-6 pb-5 text-left space-y-3 text-sm text-blue-900">
              <p className="font-semibold text-base">What happens next?</p>
              <p>Our team will review your submission and approve your listing within 1–3 business days.</p>
              <p>Once approved, your missions group will appear in the public Missions Directory at <span className="font-medium">/missions</span> with your own shareable profile page.</p>
              <p>You can then share your unique link with supporters, churches, and anyone who wants to give to your specific mission.</p>
            </CardContent>
          </Card>
          <p className="text-sm text-gray-500 italic mb-6">
            "How beautiful are the feet of those who bring good news!" — Romans 10:15
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setLocation("/missions")} variant="outline" className="border-blue-300 text-blue-700">
              View Missions Directory
            </Button>
            <Button onClick={() => setLocation("/chat")} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              Try F-AI-TH-Connect
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <button
            onClick={() => setLocation("/missions")}
            className="flex items-center gap-1 text-blue-200 hover:text-white text-sm mb-6 mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Missions Directory
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Register Your Mission</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Get your group a public profile page and shareable donation link — so supporters can find you and give specifically to your mission.
          </p>
        </div>
      </div>

      {/* Why Register */}
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-4">
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Globe, title: "Your Own Page", desc: "A public profile at /missions/[your-group] you can share anywhere" },
            { icon: Heart, title: "Targeted Giving", desc: "Supporters give directly to your mission, not just the platform" },
            { icon: Users, title: "Grow Together", desc: "Connect with a community of groups all bringing the Word to the lost" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <p className="font-semibold text-sm text-gray-900 mb-1">{title}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <Card className="shadow-lg border-0 mb-12">
          <CardContent className="pt-8 pb-8 px-6 sm:px-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
                <div className="space-y-1 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">Group Information</h2>
                  <p className="text-sm text-gray-500">Tell us about your group and who is leading it.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="groupName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group / Team Name *</FormLabel>
                      <FormControl><Input placeholder="e.g. CCF YFC Mindanao Team" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="leaderName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leader / Contact Name *</FormLabel>
                      <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="church" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Church / Organization *</FormLabel>
                      <FormControl><Input placeholder="e.g. CCF, Victory, IGSL" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="border-t pt-6 space-y-1 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">Mission Details</h2>
                  <p className="text-sm text-gray-500">Where are you going, when, and what kind of mission is it?</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="destination" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination *</FormLabel>
                      <FormControl><Input placeholder="e.g. Tawi-Tawi, Philippines" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="missionType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mission Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="short-term">Short-Term (under 6 months)</SelectItem>
                          <SelectItem value="long-term">Long-Term (6+ months)</SelectItem>
                          <SelectItem value="local">Local Outreach</SelectItem>
                          <SelectItem value="ongoing">Ongoing Ministry</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="startDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date <span className="text-gray-400">(optional)</span></FormLabel>
                      <FormControl><Input placeholder="e.g. June 2025 or 2025-06-01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="endDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date <span className="text-gray-400">(optional)</span></FormLabel>
                      <FormControl><Input placeholder="e.g. July 2025 or ongoing" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Mission Story *</FormLabel>
                    <FormDescription>Tell supporters who you are, where you're going, and why. This appears on your public profile page.</FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="We are a team of 8 young believers from CCF Makati heading to Tawi-Tawi to plant a church among the Tausug people. We will be running medical missions, children's programs, and evangelism for 2 weeks..."
                        className="min-h-[140px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="prayerNeeds" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prayer Needs <span className="text-gray-400">(optional)</span></FormLabel>
                    <FormDescription>Share specific things you need prayer for. Supporters who can't give financially can still pray for you.</FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Please pray for safety during travel, open hearts among the community, and wisdom for our team leader..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="border-t pt-6 space-y-1 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">Fundraising <span className="text-gray-400 font-normal text-base">(optional)</span></h2>
                  <p className="text-sm text-gray-500">Add a donation link so supporters can give directly to your mission.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="goalAmount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fundraising Goal (₱)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g. 50000" min="1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="donationLink" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Donation Link</FormLabel>
                      <FormControl><Input placeholder="https://gcash.me/... or airwallex link" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website / Social Link <span className="text-gray-400">(optional)</span></FormLabel>
                    <FormControl><Input placeholder="https://facebook.com/yourteampage" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {mutation.isError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                    Something went wrong. Please check your details and try again.
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/missions")}
                    className="sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3"
                  >
                    {mutation.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit for Approval
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Submissions are reviewed and approved by the F-AI-TH-Connect team within 1–3 business days.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
