// Daily memory verses that rotate based on the current date
export interface DailyVerse {
  reference: string;
  text: string;
  theme: string;
  textTl: string;
  themeTl: string;
  textZh: string;
  themeZh: string;
}

export const DAILY_VERSES: DailyVerse[] = [
  {
    reference: "Matthew 28:19",
    text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.",
    theme: "The Great Commission",
    textTl: "Kaya nga, humayo kayo at gawin ninyong mga alagad ang lahat ng mga bansa, na binabautismuhan sila sa pangalan ng Ama at ng Anak at ng Espiritu Santo.",
    themeTl: "Ang Dakilang Utos",
    textZh: "所以，你们要去，使万民作我的门徒，奉父、子、圣灵的名给他们施洗。",
    themeZh: "大使命",
  },
  {
    reference: "Matthew 11:28",
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    theme: "Rest and Peace",
    textTl: "Halina sa akin, kayong lahat na nahihirapan at nabibigatan, at bibigyan ko kayo ng pahinga.",
    themeTl: "Pahinga at Kapayapaan",
    textZh: "凡劳苦担重担的人，可以到我这里来，我就使你们得安息。",
    themeZh: "安息与平静",
  },
  {
    reference: "Philippians 4:13",
    text: "I can do all this through him who gives me strength.",
    theme: "Strength and Courage",
    textTl: "Lahat ng bagay ay kaya kong gawin sa pamamagitan niyaong nagpapalakas sa akin.",
    themeTl: "Lakas at Katapangan",
    textZh: "我靠着那加给我力量的，凡事都能做。",
    themeZh: "力量与勇气",
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    theme: "Hope and Future",
    textTl: "Sapagkat nalalaman ko ang mga plano para sa inyo, sabi ng Panginoon, mga planong nagbibigay ng pag-asa at kinabukasan, hindi ng kasamaan.",
    themeTl: "Pag-asa at Kinabukasan",
    textZh: "耶和华说，我知道我向你们所怀的意念，是赐平安的意念，不是降灾祸的意念，要叫你们末后有指望。",
    themeZh: "盼望与未来",
  },
  {
    reference: "Psalm 23:1",
    text: "The Lord is my shepherd, I lack nothing.",
    theme: "Trust and Provision",
    textTl: "Ang Panginoon ang aking pastor; hindi ako magkukulang.",
    themeTl: "Tiwala at Probisyon",
    textZh: "耶和华是我的牧者；我必不至缺乏。",
    themeZh: "信靠与供应",
  },
  {
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    theme: "God's Purpose",
    textTl: "At nalalaman natin na ang lahat ng mga bagay ay nagkakaisa para sa ikabubuti ng mga nagmamahal sa Diyos, sa mga tinawag ayon sa kanyang layunin.",
    themeTl: "Layunin ng Diyos",
    textZh: "我们晓得万事都互相效力，叫爱神的人得益处，就是按他旨意被召的人。",
    themeZh: "上帝的旨意",
  },
  {
    reference: "Proverbs 3:5-6",
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    theme: "Trust and Guidance",
    textTl: "Magtiwala ka sa Panginoon nang buong puso mo, at huwag kang manalig sa iyong sariling kaunawaan. Sa lahat ng iyong mga lakad ay kilalanin mo siya, at kanya nga itutuwid ang iyong mga landas.",
    themeTl: "Tiwala at Gabay",
    textZh: "你要专心仰赖耶和华，不可倚靠自己的聪明，在你一切所行的事上都要认定他，他必指引你的路。",
    themeZh: "信靠与引导",
  },
  {
    reference: "Isaiah 40:31",
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    theme: "Renewed Strength",
    textTl: "Datapuwa't silang naghihintay sa Panginoon ay mangagbabagong lakas; sila ay magsisiangat ng pakpak na parang mga agila; sila ay magsisitakbo at hindi mangangapos ng hininga; sila ay magsisilakad at hindi mangangalay.",
    themeTl: "Bagong Lakas",
    textZh: "但那等候耶和华的，必重新得力。他们必如鹰展翅上腾；他们奔跑却不困倦，行走却不疲乏。",
    themeZh: "重新得力",
  },
  {
    reference: "1 Corinthians 13:4-5",
    text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking.",
    theme: "Love and Kindness",
    textTl: "Ang pagmamahal ay matiyaga at maawain; ang pagmamahal ay hindi naiinggit, hindi nagmamapuri, hindi kayabang, hindi nagagalaw ng walang dahilan, hindi nagsasagawa ng mga bagay na nakakahiya, hindi naghahanap ng sariling kapakanan.",
    themeTl: "Pagmamahal at Kabaitan",
    textZh: "爱是恒久忍耐，又有恩慈；爱是不嫉妒，爱是不自夸，不张狂，不作害羞的事，不求自己的益处。",
    themeZh: "爱与仁慈",
  },
  {
    reference: "Joshua 1:9",
    text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    theme: "Courage and Faith",
    textTl: "Hindi ba iniutos ko sa iyo? Magpalakas-loob ka at magitingin; huwag kang matatakot o manganglupaypay, sapagkat kasama mo ang Panginoon mong Diyos saan ka man pumunta.",
    themeTl: "Katapangan at Pananampalataya",
    textZh: "我岂没有吩咐你吗？你当刚强壮胆，不要惧怕，也不要惊惶，因为你无论往哪里去，耶和华你的神必与你同在。",
    themeZh: "勇气与信心",
  },
  {
    reference: "2 Corinthians 5:17",
    text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
    theme: "New Life in Christ",
    textTl: "Kaya nga kung ang sinuman ay nasa kay Cristo, siya ay bagong nilalang; ang mga lumang bagay ay lumipas na, narito, naging bago ang lahat.",
    themeTl: "Bagong Buhay kay Cristo",
    textZh: "若有人在基督里，他就是新造的人，旧事已过，都变成新的了。",
    themeZh: "在基督里的新生命",
  },
  {
    reference: "Psalm 46:10",
    text: "Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.",
    theme: "Peace and Stillness",
    textTl: "Tumigil kayo at alamin ninyo na ako ang Diyos; aako akong parangalan sa gitna ng mga bansa, aako akong parangalan sa buong lupa.",
    themeTl: "Kapayapaan at Katahimikan",
    textZh: "你们要休息，要知道我是神！我必在外邦中被尊崇，在遍地上也被尊崇。",
    themeZh: "平静与安息",
  },
  {
    reference: "Ephesians 2:8-9",
    text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.",
    theme: "Grace and Salvation",
    textTl: "Sapagkat kayo ay naligtas sa pamamagitan ng biyaya sa pamamagitan ng pananampalataya, at ito ay hindi mula sa inyong sarili, ito ay kaloob ng Diyos; hindi sa pamamagitan ng mga gawa, upang walang sinumang makapagmapuri.",
    themeTl: "Biyaya at Kaligtasan",
    textZh: "你们得救是本乎恩，也因着信；这并不是出于自己，乃是神所赐的；也不是出于行为，免得有人自夸。",
    themeZh: "恩典与救恩",
  },
  {
    reference: "1 Peter 5:7",
    text: "Cast all your anxiety on him because he cares for you.",
    theme: "God's Care",
    textTl: "Ilagak ninyo sa kanya ang lahat ng inyong pag-aalala, sapagkat inaalagaan niya kayo.",
    themeTl: "Pag-aalaga ng Diyos",
    textZh: "你们要将一切的忧虑卸给神，因为他顾念你们。",
    themeZh: "上帝的关爱",
  },
  {
    reference: "Psalm 139:14",
    text: "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.",
    theme: "Self-Worth in God",
    textTl: "Ipipuri kita sapagkat ako ay kagila-gilalas na ginawa; kamangha-mangha ang iyong mga gawa; alam iyon ng aking kaluluwa.",
    themeTl: "Pagpapahalaga sa Diyos",
    textZh: "我要称谢你，因我受造，奇妙可畏；你的作为奇妙，这是我心深知道的。",
    themeZh: "在神眼中的价值",
  },
  {
    reference: "Matthew 6:26",
    text: "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?",
    theme: "God's Provision",
    textTl: "Tingnan ninyo ang mga ibon sa himpapawid; hindi sila naghahasik, o nag-aani, o nag-iipon sa mga kamalig, gayon ma'y pinakakain sila ng inyong Amang makalangit. Hindi ba kayo lalong mahalaga kaysa kanila?",
    themeTl: "Probisyon ng Diyos",
    textZh: "你们看那天上的飞鸟，也不种，也不收，也不积蓄在仓里，你们的天父尚且养活它。你们不比飞鸟贵重得多吗？",
    themeZh: "上帝的供应",
  },
  {
    reference: "Romans 12:2",
    text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is—his good, pleasing and perfect will.",
    theme: "Transformation",
    textTl: "At huwag kayong makiayon sa mundong ito, kundi magbago kayo sa pamamagitan ng pagbabago ng inyong isipan, upang mapatunayan ninyo kung ano ang kalooban ng Diyos, kung ano ang mabuti, kasiya-siya at ganap.",
    themeTl: "Pagbabago",
    textZh: "不要效法这个世界，只要心意更新而变化，叫你们察验何为神的善良、纯全、可喜悦的旨意。",
    themeZh: "心意更新",
  },
  {
    reference: "Galatians 5:22-23",
    text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.",
    theme: "Fruits of the Spirit",
    textTl: "Ngunit ang bunga ng Espiritu ay pagmamahal, kagalakan, kapayapaan, pagtitiis, kabaitan, kabutihan, katapatan, kaamuan, pagpipigil sa sarili.",
    themeTl: "Mga Bunga ng Espiritu",
    textZh: "圣灵所结的果子，就是仁爱、喜乐、和平、忍耐、恩慈、良善、信实、温柔、节制。",
    themeZh: "圣灵的果子",
  },
  {
    reference: "Hebrews 11:1",
    text: "Now faith is confidence in what we hope for and assurance about what we do not see.",
    theme: "Faith and Hope",
    textTl: "Ang pananampalataya ay ang katiyakan ng mga bagay na inaasahan, ang patunay ng mga bagay na hindi nakikita.",
    themeTl: "Pananampalataya at Pag-asa",
    textZh: "信就是所望之事的实底，是未见之事的确据。",
    themeZh: "信心与盼望",
  },
  {
    reference: "1 John 4:19",
    text: "We love because he first loved us.",
    theme: "God's Love",
    textTl: "Mahal natin siya, sapagkat siya muna ang nagmahal sa atin.",
    themeTl: "Pagmamahal ng Diyos",
    textZh: "我们爱，因为神先爱我们。",
    themeZh: "上帝的爱",
  },
  {
    reference: "Psalm 119:105",
    text: "Your word is a lamp for my feet, a light on my path.",
    theme: "God's Word as Guide",
    textTl: "Ang iyong salita ay isang ilaw sa aking mga paa at isang liwanag sa aking landas.",
    themeTl: "Salita ng Diyos bilang Gabay",
    textZh: "你的话是我脚前的灯，是我路上的光。",
    themeZh: "神的话作为引导",
  },
  {
    reference: "Matthew 5:16",
    text: "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",
    theme: "Being a Light",
    textTl: "Gayon ding lumiwanag ang inyong liwanag sa harap ng mga tao, upang makita nila ang inyong mabubuting gawa, at luwalhatiin ang inyong Ama na nasa langit.",
    themeTl: "Maging Liwanag",
    textZh: "你们的光也当这样照在人前，叫他们看见你们的好行为，便将荣耀归给你们在天上的父。",
    themeZh: "成为光",
  },
  {
    reference: "Colossians 3:23",
    text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
    theme: "Work and Service",
    textTl: "At anuman ang inyong ginagawa, gawin ito nang buong puso, na parang para sa Panginoon at hindi para sa mga tao.",
    themeTl: "Trabaho at Serbisyo",
    textZh: "无论做什么，都要从心里做，像是给主做的，不是给人做的。",
    themeZh: "工作与服事",
  },
  {
    reference: "1 Thessalonians 5:16-18",
    text: "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
    theme: "Joy and Gratitude",
    textTl: "Magalak kayo palagi, manalangin nang walang humpay, magpasalamat sa lahat ng bagay; sapagkat ito ang kalooban ng Diyos para sa inyo kay Cristo Jesus.",
    themeTl: "Kagalakan at Pasasalamat",
    textZh: "要常常喜乐，不住地祷告，凡事谢恩；因为这是神在基督耶稣里向你们所定的旨意。",
    themeZh: "喜乐与感恩",
  },
  {
    reference: "Isaiah 41:10",
    text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
    theme: "God's Presence",
    textTl: "Huwag kang matakot, sapagkat ako ay kasama mo; huwag kang manglupaypay, sapagkat ako ang iyong Diyos; palakasin kita; oo, tutulungan kita; oo, aalalayan kita ng aking matuwid na kanang kamay.",
    themeTl: "Presensya ng Diyos",
    textZh: "你不要害怕，因为我与你同在；不要惊惶，因为我是你的神。我必坚固你，我必帮助你；我必用我公义的右手扶持你。",
    themeZh: "上帝的同在",
  },
  {
    reference: "Micah 6:8",
    text: "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.",
    theme: "Justice and Humility",
    textTl: "Ipinakita niya sa iyo, O tao, kung ano ang mabuti; at ano ang hinihingi ng Panginoon sa iyo kundi ang gumawa ng katarungan, at magmahal ng awa, at magpakababa na lumakad kasama ng iyong Diyos.",
    themeTl: "Katarungan at Kababaang-loob",
    textZh: "世人哪，耶和华已指示你何为善。他向你所要的是什么呢？只要你行公义，好怜悯，存谦卑的心，与你的神同行。",
    themeZh: "公义与谦卑",
  },
  {
    reference: "2 Timothy 1:7",
    text: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",
    theme: "Power and Self-Discipline",
    textTl: "Sapagkat hindi tayo pinagkalooban ng Diyos ng espiritu ng katakutan, kundi ng kapangyarihan at pagmamahal at disiplina sa sarili.",
    themeTl: "Kapangyarihan at Disiplina",
    textZh: "因为神赐给我们，不是胆怯的心，乃是刚强、仁爱、谨守的心。",
    themeZh: "能力与自律",
  },
  {
    reference: "John 14:27",
    text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    theme: "Peace from Jesus",
    textTl: "Kapayapaan ang iniiwan ko sa inyo; ang aking kapayapaan ay ibinibigay ko sa inyo. Hindi gaya ng ibinibigay ng mundo ang aking ibinibigay sa inyo. Huwag mabalisa ang inyong puso at huwag matakot.",
    themeTl: "Kapayapaan mula kay Jesus",
    textZh: "我留下平安给你们；我将我的平安赐给你们。我所赐的，不像世人所赐的。你们心里不要忧愁，也不要胆怯。",
    themeZh: "耶稣赐的平安",
  },
  {
    reference: "Psalm 34:8",
    text: "Taste and see that the Lord is good; blessed is the one who takes refuge in him.",
    theme: "God's Goodness",
    textTl: "Lasapin ninyo at tingnan na ang Panginoon ay mabuti; mapalad ang taong lumalagay ng kanyang tiwala sa kanya.",
    themeTl: "Kabutihan ng Diyos",
    textZh: "你们要尝尝主恩的滋味，便知道他是美善的；投靠他的人有福了！",
    themeZh: "上帝的良善",
  },
  {
    reference: "Matthew 28:20",
    text: "And surely I am with you always, to the very end of the age.",
    theme: "God's Eternal Presence",
    textTl: "At masdan, ako ay laging nandito sa inyo, hanggang sa katapusan ng panahon.",
    themeTl: "Walang Hanggang Presensya ng Diyos",
    textZh: "我就常与你们同在，直到世界的末了。",
    themeZh: "上帝永恒的同在",
  },
  {
    reference: "1 Corinthians 10:13",
    text: "No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear.",
    theme: "God's Faithfulness",
    textTl: "Walang pagsubok na dumating sa inyo na hindi karaniwan sa mga tao. Ngunit tapat ang Diyos, at hindi niya hahayaang kayo ay matukso nang higit sa inyong makakaya; kasabay ng pagsubok ay magbibigay siya ng paraan upang kaya ninyo itong tiisin.",
    themeTl: "Katapatan ng Diyos",
    textZh: "你们所遇见的试探，无非是人所能受的。神是信实的，必不叫你们受试探过于所能受的；在受试探的时候，总要给你们开一条出路，叫你们能忍受得住。",
    themeZh: "上帝的信实",
  },
  {
    reference: "Psalm 37:4",
    text: "Take delight in the Lord, and he will give you the desires of your heart.",
    theme: "Delight in the Lord",
    textTl: "Magsaya ka rin sa Panginoon, at ibibigay niya sa iyo ang mga nasa ng iyong puso.",
    themeTl: "Kagalakan sa Panginoon",
    textZh: "又要以耶和华为乐；他就将你心里所求的赐给你。",
    themeZh: "以主为乐",
  },
];

// Get today's verse based on the current date
export function getTodaysVerse(): DailyVerse {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const verseIndex = (dayOfYear - 1) % DAILY_VERSES.length;
  return DAILY_VERSES[verseIndex];
}

// Get verse for a specific date
export function getVerseForDate(date: Date): DailyVerse {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const verseIndex = (dayOfYear - 1) % DAILY_VERSES.length;
  return DAILY_VERSES[verseIndex];
}

// Get localized text/theme for the given language
export function getLocalizedVerse(language = 'en'): { text: string; theme: string; reference: string } {
  const verse = getTodaysVerse();
  if (language === 'zh') return { reference: verse.reference, text: verse.textZh, theme: verse.themeZh };
  if (language === 'tl') return { reference: verse.reference, text: verse.textTl, theme: verse.themeTl };
  return { reference: verse.reference, text: verse.text, theme: verse.theme };
}

// Get formatted date string
export function getFormattedDate(date: Date = new Date(), language = 'en'): string {
  const locale = language === 'zh' ? 'zh-CN' : language === 'tl' ? 'fil-PH' : 'en-US';
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
