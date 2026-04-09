import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Heart, BookOpen, Globe, Users, Shield, Star, ChevronDown, X, Check, ArrowRight, MessageCircle, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const AIRWALLEX_LINK = "https://pay.airwallex.com/hkhhexfr4367";

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000];

const SCRIPTURE_SUCCESS = "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver. — 2 Corinthians 9:7";

type GivingType = "once" | "monthly" | "missions";

interface DonationModalProps {
  open: boolean;
  givingType: GivingType;
  onClose: () => void;
}

function DonationModal({ open, givingType, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState<number | "">(500);
  const [custom, setCustom] = useState("");
  const [success, setSuccess] = useState(false);

  const finalAmount = custom ? Number(custom) : amount;

  const typeLabel: Record<GivingType, string> = {
    once: "Give Once",
    monthly: "Give Monthly",
    missions: "Support Missions",
  };

  const typeDesc: Record<GivingType, string> = {
    once: "A one-time act of worship and generosity.",
    monthly: "Commit to ongoing partnership with the mission.",
    missions: "Directly fuel global outreach and discipleship.",
  };

  function handleGive() {
    window.open(AIRWALLEX_LINK, "_blank");
    setSuccess(true);
  }

  function handleClose() {
    setSuccess(false);
    setCustom("");
    setAmount(500);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-5 text-white">
          <button onClick={handleClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-amber-300" />
            <span className="text-sm font-semibold text-amber-300 uppercase tracking-wide">{typeLabel[givingType]}</span>
          </div>
          <h2 className="text-2xl font-bold">Fuel the Mission</h2>
          <p className="text-blue-100 text-sm mt-1">{typeDesc[givingType]}</p>
        </div>

        {success ? (
          /* Success State */
          <div className="px-6 py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Thank you for supporting the mission 💝</h3>
            <p className="text-sm text-gray-500 italic leading-relaxed">"{SCRIPTURE_SUCCESS}"</p>
            <p className="text-sm text-gray-600">Your generosity helps bring biblical guidance to D-Groups around the world.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-800 font-medium">🙏 We pray your giving is returned a hundredfold — pressed down, shaken together, and running over.</p>
            </div>
            <Button onClick={handleClose} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold">
              Close
            </Button>
          </div>
        ) : (
          /* Amount Selection */
          <div className="px-6 py-5 space-y-5">
            <p className="text-xs text-center text-gray-400 italic">Not required. Never expected. Always appreciated.</p>

            {/* Preset amounts */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Select amount (PHP)</label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map(a => (
                  <button
                    key={a}
                    onClick={() => { setAmount(a); setCustom(""); }}
                    className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      amount === a && !custom
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    ₱{a.toLocaleString()}
                  </button>
                ))}
                <button
                  onClick={() => { setAmount(""); }}
                  className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all col-span-3 ${
                    custom || amount === ""
                      ? "border-amber-400 bg-amber-50 text-amber-700"
                      : "border-gray-200 text-gray-700 hover:border-amber-300"
                  }`}
                >
                  Custom Amount
                </button>
              </div>

              {(custom !== "" || amount === "") && (
                <div className="mt-3 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₱</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={custom}
                    onChange={e => setCustom(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 border-2 border-amber-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Giving summary */}
            {(finalAmount && finalAmount > 0) ? (
              <div className="bg-indigo-50 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm text-indigo-700">Your gift</span>
                <span className="text-lg font-bold text-indigo-800">₱{Number(finalAmount).toLocaleString()}</span>
              </div>
            ) : null}

            <Button
              onClick={handleGive}
              disabled={!finalAmount || Number(finalAmount) <= 0}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl py-3.5 font-bold text-base shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Heart className="w-4 h-4 mr-2" />
              Give as an act of worship →
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock className="w-3 h-3" />
              <span>Secured by Airwallex • No account required</span>
            </div>

            <p className="text-center text-xs text-gray-400 italic">
              "Give as an act of worship, not obligation."
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function SupportPage() {
  const [, setLocation] = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [givingType, setGivingType] = useState<GivingType>("once");
  const donateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("support") === "true") {
      setTimeout(() => {
        donateRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  }, []);

  function openModal(type: GivingType) {
    setGivingType(type);
    setModalOpen(true);
  }

  function scrollToDonate() {
    donateRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <DonationModal open={modalOpen} givingType={givingType} onClose={() => setModalOpen(false)} />

      {/* ── Sticky Header ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg faith-gradient-text">F-AI-TH-Connect</span>
          </button>
          <button
            onClick={scrollToDonate}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-sm font-bold shadow hover:shadow-md transition-all active:scale-95"
          >
            <Heart className="w-4 h-4" /> Support Missions
          </button>
        </div>
      </header>

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800 text-white py-24 sm:py-32 px-4">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-amber-300 font-medium mb-2">
              <Star className="w-3.5 h-3.5" />
              A corporate ministry of ReMynd Student Services
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">
              Bringing the Word<br />
              <span className="text-amber-400">to the Lost and the Unreached</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              F-AI-TH-Connect is a free AI-powered ministry platform built for Bible study communities, D-Groups, and missions outreach — grounded in Scripture, designed for real people.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={scrollToDonate}
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-xl font-bold text-base shadow-lg transition-all active:scale-95"
              >
                <Heart className="w-5 h-5" /> 💝 Support Missions
              </button>
              <button
                onClick={() => setLocation("/bible")}
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl font-semibold text-base transition-all active:scale-95"
              >
                <Sparkles className="w-5 h-5" /> Open Ministry AI
              </button>
            </div>
          </FadeIn>
          <FadeIn delay={400}>
            <button onClick={scrollToDonate} className="mt-8 flex flex-col items-center gap-1 mx-auto text-white/40 hover:text-white/70 transition-colors text-xs">
              <span>See how you can help</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. OUR STORY ────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Born from a Burden for the Church</h2>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <FadeIn delay={100}>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  F-AI-TH-Connect was built by a team that loves the local church. We saw D-Group leaders working hard every week — preparing studies, coordinating schedules, finding resources — and we asked: <em>what if AI could carry some of that weight?</em>
                </p>
                <p>
                  As a <strong className="text-gray-800">corporate ministry of ReMynd Student Services</strong>, this platform exists to equip believers — not replace the Holy Spirit. Every feature points back to Scripture and community.
                </p>
                <p>
                  It is and will always remain <strong className="text-gray-800">completely free</strong> to use. No subscriptions. No paywalls. No accounts required for most features. Just ministry.
                </p>
                <p>
                  We intentionally chose <strong className="text-gray-800">DeepSeek AI</strong> — developed in China — as our AI engine. Not by accident. The unreached include hundreds of millions of young people in nations where the gospel has yet to take root. By building on technology that originates from within those communities, we are quietly meeting the next generation on their turf, with the Word of God. Every conversation is an open door.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="space-y-4">
                {[
                  { icon: BookOpen, label: "Scripture-First AI", desc: "Every AI response is grounded in biblical truth, not generic advice." },
                  { icon: Users, label: "Built for Community", desc: "D-Groups, Bible studies, and ministry teams are the primary audience." },
                  { icon: Globe, label: "Missions-Oriented", desc: "Designed to support the Great Commission — locally and globally." },
                  { icon: Sparkles, label: "Reaching the Unreached Through Their Tech", desc: "DeepSeek AI is a deliberate choice — bringing the gospel through technology born in unreached regions of the world." },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{label}</p>
                      <p className="text-gray-500 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 3. WHY THIS EXISTS ──────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Why This Exists</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">The Great Commission Needs Great Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Matthew 28:19 — "Go and make disciples of all nations." We believe technology, when surrendered to God, can be a powerful vehicle for that command.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { emoji: "📖", title: "D-Group Leaders", desc: "Spend less time preparing and more time present with your group." },
              { emoji: "🌏", title: "Missionaries & Outreach", desc: "Access biblical study resources in seconds, from anywhere in the world." },
              { emoji: "🏛️", title: "Church Communities", desc: "Equip every member — not just the pastor — to study and share the Word." },
            ].map(({ emoji, title, desc }) => (
              <FadeIn key={title} delay={100}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 text-left space-y-3">
                  <div className="text-3xl">{emoji}</div>
                  <h3 className="font-bold text-gray-900">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHAT MAKES THIS DIFFERENT ────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">What Makes This Different</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Ministry, Not Marketing</h2>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { title: "No Subscription Required", desc: "Every feature is free, forever. We refuse to put God's Word behind a paywall.", icon: "🔓" },
              { title: "Scripture-Grounded AI", desc: "The AI is specifically prompted with Christian theology and biblical principles.", icon: "✝️" },
              { title: "CCF 4 W's Integration", desc: "Upload this week's guide and the AI builds a complete study around it.", icon: "📋" },
              { title: "Free Video Meeting Rooms", desc: "Host your D-Group call instantly — no Zoom account, no downloads.", icon: "📹" },
              { title: "8 Study Types", desc: "Men's, Women's, Youth, Couples, Senior, Business, Sunday School, Mixed Group.", icon: "👥" },
              { title: "Offline-Capable (PWA)", desc: "Install it on your phone like an app. Works even with limited connectivity.", icon: "📱" },
            ].map(({ title, desc, icon }) => (
              <FadeIn key={title} delay={100}>
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-100 transition-colors">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. OPEN MINISTRY AI ─────────────────────────────── */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-bold">Try the Ministry AI — It's Free</h2>
            <p className="text-blue-100 leading-relaxed">
              Ask a biblical question, generate a D-Group study, prepare a sermon, or explore Scripture. No sign-up. No payment. Just open and go.
            </p>
            <button
              onClick={() => setLocation("/bible")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all active:scale-95 mt-2"
            >
              <Sparkles className="w-5 h-5" /> Open Ministry AI <ArrowRight className="w-4 h-4" />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── 6. FUEL THE MISSION (DONATION) ──────────────────── */}
      <section ref={donateRef} id="donate" className="py-24 px-4 bg-white scroll-mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Support the Mission</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Fuel the Mission</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
              This platform costs real money to run. If it has served you or your group, consider giving — not out of obligation, but as an act of worship.
            </p>
            <div className="inline-block mt-4 px-5 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 text-sm font-medium italic">
                "Not required. Never expected. Always appreciated."
              </p>
            </div>
          </FadeIn>

          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {/* Give Once */}
            <FadeIn delay={100}>
              <div className="relative flex flex-col rounded-3xl border-2 border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 transition-all overflow-hidden group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 pb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Give Once</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                    A single gift that helps keep the ministry running and growing.
                  </p>
                </div>
                <div className="p-6 pt-4 mt-auto">
                  <button
                    onClick={() => openModal("once")}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all active:scale-95"
                  >
                    Give Once
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Give Monthly — Featured */}
            <FadeIn delay={200}>
              <div className="relative flex flex-col rounded-3xl border-2 border-indigo-500 bg-white shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">PARTNER</div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 pb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Give Monthly</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                    Become an ongoing ministry partner. Your commitment sustains long-term impact.
                  </p>
                </div>
                <div className="p-6 pt-4 mt-auto">
                  <button
                    onClick={() => openModal("monthly")}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all active:scale-95"
                  >
                    Give Monthly
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Support Missions */}
            <FadeIn delay={300}>
              <div className="relative flex flex-col rounded-3xl border-2 border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-amber-200 transition-all overflow-hidden group">
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 pb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Support Missions</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                    Directly fund global outreach, discipleship, and unreached communities.
                  </p>
                </div>
                <div className="p-6 pt-4 mt-auto">
                  <button
                    onClick={() => openModal("missions")}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all active:scale-95"
                  >
                    💝 Support Missions
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={400}>
            <p className="mt-8 text-gray-400 text-sm italic">
              "Give as an act of worship, not obligation." — All giving is voluntary and deeply appreciated.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock className="w-3.5 h-3.5" />
              <span>All payments are secured by Airwallex</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 6b. MISSIONS PARTNER PROGRAM ─────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-950 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Missions Partner Program</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Going on Mission? Get Your Own Page.</h2>
              <p className="text-blue-200 max-w-2xl mx-auto leading-relaxed">
                Register your short-term or long-term missions group and we will give you a dedicated public profile page with a shareable link — so supporters can find you and give specifically to your trip.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              { emoji: "🌏", title: "Your Own Profile Page", desc: "A public listing at /missions/[your-group] you can share anywhere — social media, email, church bulletins." },
              { emoji: "💝", title: "Targeted Giving", desc: "Supporters give directly to your mission, not just a general fund. Every peso goes where you need it." },
              { emoji: "🤝", title: "Ambassador Community", desc: "You spread F-AI-TH-Connect to churches and groups you meet — helping us reach more while we help fund your trip." },
            ].map(({ emoji, title, desc }) => (
              <FadeIn key={title} delay={100}>
                <div className="bg-white/10 rounded-2xl p-5 border border-white/20 text-center">
                  <div className="text-3xl mb-3">{emoji}</div>
                  <h3 className="font-bold text-white mb-2">{title}</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Transparency Model */}
          <FadeIn delay={200}>
            <div className="bg-white/10 rounded-2xl border border-white/20 p-6 mb-8">
              <h3 className="font-bold text-white text-lg mb-1 flex items-center gap-2">
                <span>📊</span> How the Giving Model Works — Full Transparency
              </h3>
              <p className="text-blue-200 text-sm mb-5 leading-relaxed">
                We believe stewardship means being completely open about where every peso goes.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 text-center">
                  <div className="text-4xl font-extrabold text-green-300 mb-1">90%</div>
                  <p className="font-semibold text-green-200 text-sm">Goes directly to the mission</p>
                  <p className="text-green-300 text-xs mt-1">Straight to the group's trip costs, outreach, and ministry work.</p>
                </div>
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 text-center">
                  <div className="text-4xl font-extrabold text-blue-300 mb-1">10%</div>
                  <p className="font-semibold text-blue-200 text-sm">Sustains this ministry</p>
                  <p className="text-blue-300 text-xs mt-1">Covers servers, AI costs, and video infrastructure — keeping the platform free for everyone.</p>
                </div>
              </div>
              <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-4 text-center text-sm text-amber-200 italic">
                "F-AI-TH-Connect is always free. A small portion of each gift helps sustain this platform so others around the world can access it freely."
              </div>
              <p className="text-blue-300 text-xs mt-3 text-center">
                Donors also have the option to cover the 10% themselves — sending 100% directly to the mission.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="text-center">
              <button
                onClick={() => setLocation("/missions/register")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold text-base shadow-lg transition-all active:scale-95"
              >
                🌏 Register Your Mission Group
              </button>
              <p className="mt-3 text-blue-300 text-sm">
                Or <button onClick={() => setLocation("/missions")} className="underline underline-offset-2 hover:text-white transition-colors">browse existing missions partners</button>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 7. IMPACT STATS ─────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-950 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Impact</span>
            <h2 className="text-3xl font-bold mt-2 mb-12">Every Gift Reaches Further</h2>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: "100+", label: "D-Groups Served" },
              { value: "15+", label: "Countries Reached" },
              { value: "8", label: "Study Types Available" },
              { value: "Free", label: "Always & Forever" },
            ].map(({ value, label }) => (
              <FadeIn key={label} delay={100}>
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-amber-400 mb-1">{value}</div>
                  <div className="text-blue-200 text-sm">{label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. TRANSPARENCY ─────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">Trust & Transparency</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Our Commitments to You</h2>
            <p className="text-gray-500 leading-relaxed mb-10">
              We believe transparency is part of good stewardship. Here is how we operate.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: Shield,
                title: "Scripture-Committed",
                desc: "Every AI response is shaped by Christian theology. We never drift from the Word.",
                color: "text-blue-600 bg-blue-100",
              },
              {
                icon: Heart,
                title: "Mission-First Design",
                desc: "No ads. No data selling. No paywalls. The platform exists to serve the Church.",
                color: "text-rose-500 bg-rose-100",
              },
              {
                icon: Globe,
                title: "Open Access Always",
                desc: "We will never charge for core features. Giving supports the mission — nothing more.",
                color: "text-amber-600 bg-amber-100",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <FadeIn key={title} delay={100}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left space-y-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FINAL CTA ────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <FadeIn>
            <div className="text-5xl mb-4">🙏</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Join the Mission
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Whether you give ₱100 or pray for us daily — you are part of what God is doing through this platform. Thank you for being here.
            </p>
            <p className="text-indigo-600 font-semibold italic text-sm">
              "Each of you should give what you have decided in your heart to give." — 2 Corinthians 9:7
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={scrollToDonate}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                <Heart className="w-5 h-5" /> 💝 Support Missions
              </button>
              <button
                onClick={() => setLocation("/bible")}
                className="flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-indigo-300 hover:text-indigo-700 transition-all"
              >
                <Sparkles className="w-5 h-5" /> Open Ministry AI
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <p className="font-medium text-gray-300">F-AI-TH-Connect</p>
        <p className="mt-1">A corporate ministry of <span className="text-gray-200 font-medium">ReMynd Student Services</span></p>
        <p className="mt-2 text-gray-500 text-xs">© 2024 F-AI-TH-Connect. Grounded in Scripture. Built for the Church.</p>
      </footer>
    </div>
  );
}
