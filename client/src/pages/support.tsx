import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Heart, BookOpen, Globe, Users, Shield, Star, ChevronDown, X, Check, ArrowRight, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const AIRWALLEX_LINK = "https://pay.airwallex.com/hkhhexfr4367";
const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000];

type GivingType = "once" | "monthly";

interface DonationModalProps {
  open: boolean;
  givingType: GivingType;
  onClose: () => void;
}

function DonationModal({ open, givingType, onClose }: DonationModalProps) {
  const { t } = useLanguage();
  const s = t.support;
  const [amount, setAmount] = useState<number | "">(500);
  const [custom, setCustom] = useState("");
  const [success, setSuccess] = useState(false);

  const finalAmount = custom ? Number(custom) : amount;

  const typeLabel: Record<GivingType, string> = {
    once: s.modalTypeLabel_once,
    monthly: s.modalTypeLabel_monthly,
  };
  const typeDesc: Record<GivingType, string> = {
    once: s.modalTypeDesc_once,
    monthly: s.modalTypeDesc_monthly,
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
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-5 text-white">
          <button onClick={handleClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-amber-300" />
            <span className="text-sm font-semibold text-amber-300 uppercase tracking-wide">{typeLabel[givingType]}</span>
          </div>
          <h2 className="text-2xl font-bold">{s.modalHeading}</h2>
          <p className="text-blue-100 text-sm mt-1">{typeDesc[givingType]}</p>
        </div>

        {success ? (
          <div className="px-6 py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{s.modalSuccessTitle}</h3>
            <p className="text-sm text-gray-500 italic leading-relaxed">{s.modalSuccessScripture}</p>
            <p className="text-sm text-gray-600">{s.modalSuccessDesc}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-800 font-medium">{s.modalSuccessPrayer}</p>
            </div>
            <Button onClick={handleClose} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold">
              {s.modalCloseBtn}
            </Button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5">
            <p className="text-xs text-center text-gray-400 italic">{s.modalNotRequired}</p>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">{s.modalSelectAmount}</label>
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
                  {s.modalCustomAmount}
                </button>
              </div>

              {(custom !== "" || amount === "") && (
                <div className="mt-3 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₱</span>
                  <input
                    type="number"
                    min="1"
                    placeholder={s.modalEnterAmount}
                    value={custom}
                    onChange={e => setCustom(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 border-2 border-amber-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {(finalAmount && finalAmount > 0) ? (
              <div className="bg-indigo-50 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm text-indigo-700">{s.modalYourGift}</span>
                <span className="text-lg font-bold text-indigo-800">₱{Number(finalAmount).toLocaleString()}</span>
              </div>
            ) : null}

            <Button
              onClick={handleGive}
              disabled={!finalAmount || Number(finalAmount) <= 0}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl py-3.5 font-bold text-base shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Heart className="w-4 h-4 mr-2" />
              {s.modalGiveBtn}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock className="w-3 h-3" />
              <span>{s.modalSecured}</span>
            </div>

            <p className="text-center text-xs text-gray-400 italic">{s.modalQuote}</p>
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

const STORY_FEATURE_ICONS = [BookOpen, Users, Globe, Sparkles];
const TRUST_ICONS = [Shield, Heart, Globe];
const TRUST_COLORS = ["text-blue-600 bg-blue-100", "text-rose-500 bg-rose-100", "text-amber-600 bg-amber-100"];

export default function SupportPage() {
  const { t } = useLanguage();
  const s = t.support;
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

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800 text-white py-24 sm:py-32 px-4">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-amber-300 font-medium mb-2">
              <Star className="w-3.5 h-3.5" />
              {s.heroBadge}
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">
              {s.heroHeadline1}<br />
              <span className="text-amber-400">{s.heroHeadline2}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {s.heroSubtext}
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={scrollToDonate}
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-xl font-bold text-base shadow-lg transition-all active:scale-95"
              >
                <Heart className="w-5 h-5" /> 💝 {s.heroBtnGive}
              </button>
              <button
                onClick={() => setLocation("/bible")}
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl font-semibold text-base transition-all active:scale-95"
              >
                <Sparkles className="w-5 h-5" /> {s.heroBtnDesk}
              </button>
            </div>
          </FadeIn>
          <FadeIn delay={400}>
            <button onClick={scrollToDonate} className="mt-8 flex flex-col items-center gap-1 mx-auto text-white/40 hover:text-white/70 transition-colors text-xs">
              <span>{s.heroScrollHint}</span>
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
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{s.storyLabel}</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">{s.storyHeading}</h2>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <FadeIn delay={100}>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {s.storyP1pre}<em>{s.storyP1em}</em>
                </p>
                <p>
                  {s.storyP2pre}<strong className="text-gray-800">{s.storyP2strong}</strong>{s.storyP2post}
                </p>
                <p>
                  {s.storyP3pre}<strong className="text-gray-800">{s.storyP3strong}</strong>{s.storyP3post}
                </p>
                <p>
                  {s.storyP4pre}<strong className="text-gray-800">{s.storyP4strong}</strong>{s.storyP4post}
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="space-y-4">
                {(s.storyFeatures as { label: string; desc: string }[]).map(({ label, desc }, i) => {
                  const Icon = STORY_FEATURE_ICONS[i];
                  return (
                    <div key={label} className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{label}</p>
                        <p className="text-gray-500 text-sm">{desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 3. WHY THIS EXISTS ──────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">{s.whyLabel}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">{s.whyHeading}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">{s.whySubtext}</p>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {(s.whyCards as { emoji: string; title: string; desc: string }[]).map(({ emoji, title, desc }) => (
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
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{s.diffLabel}</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">{s.diffHeading}</h2>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-5">
            {(s.diffItems as { title: string; desc: string; icon: string }[]).map(({ title, desc, icon }) => (
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
            <h2 className="text-2xl sm:text-3xl font-bold">{s.deskHeading}</h2>
            <p className="text-blue-100 leading-relaxed">{s.deskSubtext}</p>
            <button
              onClick={() => setLocation("/bible")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all active:scale-95 mt-2"
            >
              <Sparkles className="w-5 h-5" /> {s.deskBtn} <ArrowRight className="w-4 h-4" />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── 6. FUEL THE MISSION (DONATION) ──────────────────── */}
      <section ref={donateRef} id="donate" className="py-24 px-4 bg-white scroll-mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">{s.fuelLabel}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">{s.fuelHeading}</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">{s.fuelSubtext}</p>
            <div className="inline-block mt-4 px-5 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 text-sm font-medium italic">{s.fuelQuote}</p>
            </div>
          </FadeIn>

          <div className="mt-12 grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <FadeIn delay={100}>
              <div className="relative flex flex-col rounded-3xl border-2 border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 transition-all overflow-hidden group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 pb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{s.giveOnceTitle}</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{s.giveOnceDesc}</p>
                </div>
                <div className="p-6 pt-4 mt-auto">
                  <button
                    onClick={() => openModal("once")}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all active:scale-95"
                  >
                    {s.giveOnceBtn}
                  </button>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="relative flex flex-col rounded-3xl border-2 border-indigo-500 bg-white shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">{s.giveMonthlyBadge}</div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 pb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{s.giveMonthlyTitle}</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{s.giveMonthlyDesc}</p>
                </div>
                <div className="p-6 pt-4 mt-auto">
                  <button
                    onClick={() => openModal("monthly")}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all active:scale-95"
                  >
                    {s.giveMonthlyBtn}
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={400}>
            <p className="mt-8 text-gray-400 text-sm italic">{s.fuelFooterQuote}</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock className="w-3.5 h-3.5" />
              <span>{s.fuelSecured}</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 6b. MISSIONS PARTNER PROGRAM ─────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-950 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">{s.missionsLabel}</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">{s.missionsHeading}</h2>
              <p className="text-blue-200 max-w-2xl mx-auto leading-relaxed">{s.missionsSubtext}</p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {(s.missionsCards as { emoji: string; title: string; desc: string }[]).map(({ emoji, title, desc }) => (
              <FadeIn key={title} delay={100}>
                <div className="bg-white/10 rounded-2xl p-5 border border-white/20 text-center">
                  <div className="text-3xl mb-3">{emoji}</div>
                  <h3 className="font-bold text-white mb-2">{title}</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={300}>
            <div className="text-center">
              <button
                onClick={() => setLocation("/missions/register")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold text-base shadow-lg transition-all active:scale-95"
              >
                {s.missionsBtn}
              </button>
              <p className="mt-3 text-blue-300 text-sm">
                {s.missionsOr}{" "}
                <button onClick={() => setLocation("/missions")} className="underline underline-offset-2 hover:text-white transition-colors">
                  {s.missionsBrowse}
                </button>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 7. IMPACT STATS ─────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-950 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">{s.impactLabel}</span>
            <h2 className="text-3xl font-bold mt-2 mb-12">{s.impactHeading}</h2>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {(s.impactStats as { value: string; label: string }[]).map(({ value, label }) => (
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
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{s.trustLabel}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{s.trustHeading}</h2>
            <p className="text-gray-500 leading-relaxed mb-10">{s.trustSubtext}</p>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-5">
            {(s.trustItems as { title: string; desc: string }[]).map(({ title, desc }, i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <FadeIn key={title} delay={100}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left space-y-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${TRUST_COLORS[i]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 9. FINAL CTA ────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <FadeIn>
            <div className="text-5xl mb-4">🙏</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{s.ctaHeading}</h2>
            <p className="text-gray-500 leading-relaxed">{s.ctaSubtext}</p>
            <p className="text-indigo-600 font-semibold italic text-sm">{s.ctaVerse}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={scrollToDonate}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                <Heart className="w-5 h-5" /> 💝 {s.ctaBtn1}
              </button>
              <button
                onClick={() => setLocation("/bible")}
                className="flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-indigo-300 hover:text-indigo-700 transition-all"
              >
                <Sparkles className="w-5 h-5" /> {s.ctaBtn2}
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <p className="font-medium text-gray-300">F-AI-TH-Connect</p>
        <p className="mt-1">{s.footerLine2}</p>
        <p className="mt-2 text-gray-500 text-xs">{s.footerCopyright}</p>
      </footer>
    </div>
  );
}
