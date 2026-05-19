import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X, Share, Smartphone, Globe, Home } from "lucide-react";
import { useLocation } from "wouter";
import { usePWA } from "@/hooks/usePWA";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, LANGUAGE_NAMES } from "@/data/translations";

export default function Header() {
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { canInstall, install } = usePWA();
  const { language, setLanguage, t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const startChat = () => {
    setLocation("/chat");
  };

  const handleLangSelect = (lang: Language) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  const languages: Language[] = ['en', 'tl', 'zh'];

  return (
    <>
      {/* Spacer so page content starts below the fixed header */}
      <div className="h-16" />

      <header className="bg-white shadow-sm border-b border-gray-100 fixed top-0 left-0 right-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              title="Home"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold faith-gradient-text whitespace-nowrap">F-AI-TH-Connect</span>
            </button>

            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setLocation("/")}
                className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors font-medium"
                title="Home"
              >
                <Home className="w-4 h-4" />
                <span className="sr-only">Home</span>
              </button>
              <button
                onClick={() => setLocation("/bible")}
                className="text-gray-600 hover:text-blue-500 transition-colors font-medium"
              >
                {t.nav.dgroups}
              </button>
              <button
                onClick={() => setLocation("/bible-games")}
                className="text-gray-600 hover:text-blue-500 transition-colors font-medium"
              >
                {t.nav.bibleGames}
              </button>
              <button
                onClick={() => setLocation("/missions")}
                className="text-teal-600 hover:text-teal-800 transition-colors font-medium flex items-center gap-1"
              >
                <Globe className="w-4 h-4" />
                {t.nav.missions}
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors text-sm font-medium border border-gray-200 rounded-lg px-2.5 py-1.5 hover:border-blue-300"
                  title={t.nav.language}
                >
                  <span className="text-base leading-none">
                    {language === 'en' ? '🇺🇸' : language === 'tl' ? '🇵🇭' : '🇨🇳'}
                  </span>
                  <span>{LANGUAGE_NAMES[language]}</span>
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[130px] overflow-hidden">
                    {languages.map(lang => (
                      <button
                        key={lang}
                        onClick={() => handleLangSelect(lang)}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors text-left ${language === lang ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'}`}
                      >
                        <span>{lang === 'en' ? '🇺🇸' : lang === 'tl' ? '🇵🇭' : '🇨🇳'}</span>
                        {LANGUAGE_NAMES[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setLocation("/share")}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 touch-target mobile-tap"
                title="Share App - Get QR Code"
              >
                <Share className="w-5 h-5 text-gray-600" />
              </Button>
              {canInstall && (
                <Button
                  onClick={install}
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100 touch-target mobile-tap"
                  title={t.nav.installApp}
                >
                  <Smartphone className="w-5 h-5 text-green-600" />
                </Button>
              )}
              <Button
                onClick={() => setLocation("/support")}
                variant="outline"
                className="px-3 lg:px-4 py-2 rounded-lg font-medium border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 text-sm lg:text-base touch-target mobile-tap"
              >
                {t.nav.support}
              </Button>
              <Button
                onClick={startChat}
                className="faith-button-primary px-4 lg:px-6 py-2 rounded-lg font-medium text-sm lg:text-base touch-target mobile-tap"
              >
                {t.nav.openMinistryDesk}
              </Button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 touch-target mobile-tap rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 bg-white">
              <div className="flex flex-col space-y-3">

                {/* Mobile language selector */}
                <div className="flex items-center gap-2 px-2 pb-1 border-b border-gray-100">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{t.nav.language}:</span>
                  {languages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleLangSelect(lang)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${language === lang ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      <span>{lang === 'en' ? '🇺🇸' : lang === 'tl' ? '🇵🇭' : '🇨🇳'}</span>
                      {LANGUAGE_NAMES[lang]}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => { setLocation("/"); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors text-left font-medium py-3 px-2 rounded-lg hover:bg-gray-50 touch-target mobile-tap"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
                <button
                  onClick={() => {
                    setLocation("/bible");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-blue-500 transition-colors text-left font-medium py-3 px-2 rounded-lg hover:bg-gray-50 touch-target mobile-tap"
                >
                  {t.nav.dgroups}
                </button>
                <button
                  onClick={() => {
                    setLocation("/bible-games");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-blue-500 transition-colors text-left font-medium py-3 px-2 rounded-lg hover:bg-gray-50 touch-target mobile-tap"
                >
                  {t.nav.bibleGames}
                </button>
                <button
                  onClick={() => {
                    setLocation("/missions");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-teal-600 hover:text-teal-800 transition-colors text-left font-medium py-3 px-2 rounded-lg hover:bg-teal-50 touch-target mobile-tap flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  {t.nav.missionsPartners}
                </button>

                <Button
                  onClick={() => setLocation("/share")}
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-blue-500 py-3 touch-target mobile-tap"
                >
                  <Share className="w-4 h-4 mr-2" />
                  {t.nav.shareApp}
                </Button>
                {canInstall && (
                  <Button
                    onClick={install}
                    variant="ghost"
                    className="w-full justify-start text-green-600 hover:text-green-700 py-3 touch-target mobile-tap"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    {t.nav.installApp}
                  </Button>
                )}
                <Button
                  onClick={() => { setLocation("/support"); setIsMobileMenuOpen(false); }}
                  variant="outline"
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 py-3 touch-target mobile-tap"
                >
                  {t.nav.supportMinistry}
                </Button>
                <Button
                  onClick={startChat}
                  className="faith-button-primary w-full py-3 touch-target mobile-tap"
                >
                  {t.nav.openMinistryDesk}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Close lang dropdown on outside click */}
        {langOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
        )}
      </header>
    </>
  );
}
