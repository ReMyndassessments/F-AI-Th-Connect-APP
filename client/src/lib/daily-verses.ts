// Daily memory verses that rotate based on the current date
export interface DailyVerse {
  reference: string;
  text: string;
  theme: string;
}

export const DAILY_VERSES: DailyVerse[] = [
  {
    reference: "Matthew 11:28",
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    theme: "Rest and Peace"
  },
  {
    reference: "Philippians 4:13",
    text: "I can do all this through him who gives me strength.",
    theme: "Strength and Courage"
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    theme: "Hope and Future"
  },
  {
    reference: "Psalm 23:1",
    text: "The Lord is my shepherd, I lack nothing.",
    theme: "Trust and Provision"
  },
  {
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    theme: "God's Purpose"
  },
  {
    reference: "Proverbs 3:5-6",
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    theme: "Trust and Guidance"
  },
  {
    reference: "Isaiah 40:31",
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    theme: "Renewed Strength"
  },
  {
    reference: "1 Corinthians 13:4-5",
    text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking.",
    theme: "Love and Kindness"
  },
  {
    reference: "Joshua 1:9",
    text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    theme: "Courage and Faith"
  },
  {
    reference: "2 Corinthians 5:17",
    text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
    theme: "New Life in Christ"
  },
  {
    reference: "Psalm 46:10",
    text: "Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.",
    theme: "Peace and Stillness"
  },
  {
    reference: "Ephesians 2:8-9",
    text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.",
    theme: "Grace and Salvation"
  },
  {
    reference: "1 Peter 5:7",
    text: "Cast all your anxiety on him because he cares for you.",
    theme: "God's Care"
  },
  {
    reference: "Psalm 139:14",
    text: "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.",
    theme: "Self-Worth in God"
  },
  {
    reference: "Matthew 6:26",
    text: "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?",
    theme: "God's Provision"
  },
  {
    reference: "Romans 12:2",
    text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is—his good, pleasing and perfect will.",
    theme: "Transformation"
  },
  {
    reference: "Galatians 5:22-23",
    text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.",
    theme: "Fruits of the Spirit"
  },
  {
    reference: "Hebrews 11:1",
    text: "Now faith is confidence in what we hope for and assurance about what we do not see.",
    theme: "Faith and Hope"
  },
  {
    reference: "1 John 4:19",
    text: "We love because he first loved us.",
    theme: "God's Love"
  },
  {
    reference: "Psalm 119:105",
    text: "Your word is a lamp for my feet, a light on my path.",
    theme: "God's Word as Guide"
  },
  {
    reference: "Matthew 5:16",
    text: "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",
    theme: "Being a Light"
  },
  {
    reference: "Colossians 3:23",
    text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
    theme: "Work and Service"
  },
  {
    reference: "1 Thessalonians 5:16-18",
    text: "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
    theme: "Joy and Gratitude"
  },
  {
    reference: "Isaiah 41:10",
    text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
    theme: "God's Presence"
  },
  {
    reference: "Micah 6:8",
    text: "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.",
    theme: "Justice and Humility"
  },
  {
    reference: "2 Timothy 1:7",
    text: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",
    theme: "Power and Self-Discipline"
  },
  {
    reference: "John 14:27",
    text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    theme: "Peace from Jesus"
  },
  {
    reference: "Psalm 34:8",
    text: "Taste and see that the Lord is good; blessed is the one who takes refuge in him.",
    theme: "God's Goodness"
  },
  {
    reference: "Matthew 28:20",
    text: "And surely I am with you always, to the very end of the age.",
    theme: "God's Eternal Presence"
  },
  {
    reference: "1 Corinthians 10:13",
    text: "No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear.",
    theme: "God's Faithfulness"
  },
  {
    reference: "Psalm 37:4",
    text: "Take delight in the Lord, and he will give you the desires of your heart.",
    theme: "Delight in the Lord"
  }
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

// Get formatted date string
export function getFormattedDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}