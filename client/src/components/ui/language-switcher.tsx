import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, LANGUAGE_NAMES } from "@/data/translations";

const FLAGS: Record<Language, string> = { en: '🇺🇸', tl: '🇵🇭', zh: '🇨🇳' };
const SHORT: Record<Language, string> = { en: 'EN', tl: 'TL', zh: '中' };
const LANGS: Language[] = ['en', 'tl', 'zh'];

interface Props {
  variant?: 'light' | 'dark';
}

export default function LanguageSwitcher({ variant = 'light' }: Props) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const btnClass = variant === 'dark'
    ? "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white/90 hover:text-white border border-white/30 hover:border-white/60 transition-colors bg-white/10 hover:bg-white/20"
    : "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-300 transition-colors bg-white hover:bg-blue-50";

  return (
    <div className="relative flex-shrink-0">
      <button onClick={() => setOpen(o => !o)} className={btnClass}>
        <span className="text-sm leading-none">{FLAGS[language]}</span>
        <span>{SHORT[language]}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[130px] overflow-hidden">
            {LANGS.map(lang => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors text-left ${
                  language === lang
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{FLAGS[lang]}</span>
                {LANGUAGE_NAMES[lang]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
