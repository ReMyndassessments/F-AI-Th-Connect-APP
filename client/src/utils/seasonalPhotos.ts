// Seasonal photo rotation system based on Christian calendar and months

export interface SeasonalPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  season: string;
}

// Calculate Easter date for a given year using the algorithm
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
}

// Calculate Advent (4th Sunday before Christmas)
function calculateAdvent(year: number): Date {
  const christmas = new Date(year, 11, 25); // December 25
  const christmasDay = christmas.getDay();
  const daysToSubtract = christmasDay === 0 ? 28 : (21 + christmasDay);
  const advent = new Date(christmas);
  advent.setDate(christmas.getDate() - daysToSubtract);
  return advent;
}

// Calculate Ash Wednesday (46 days before Easter)
function calculateAshWednesday(year: number): Date {
  const easter = calculateEaster(year);
  const ashWednesday = new Date(easter);
  ashWednesday.setDate(easter.getDate() - 46);
  return ashWednesday;
}

// Calculate Pentecost (50 days after Easter)
function calculatePentecost(year: number): Date {
  const easter = calculateEaster(year);
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 50);
  return pentecost;
}

// Determine current Christian season
function getCurrentChristianSeason(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  
  const easter = calculateEaster(year);
  const advent = calculateAdvent(year);
  const ashWednesday = calculateAshWednesday(year);
  const pentecost = calculatePentecost(year);
  
  // Check if we're in Christmas season (Dec 25 - Jan 6)
  if ((month === 12 && date >= 25) || (month === 1 && date <= 6)) {
    return 'christmas';
  }
  
  // Check if we're in Advent (4 Sundays before Christmas)
  if (now >= advent && now < new Date(year, 11, 25)) {
    return 'advent';
  }
  
  // Check if we're in Lent (Ash Wednesday to Easter)
  if (now >= ashWednesday && now < easter) {
    return 'lent';
  }
  
  // Check if we're in Easter season (Easter to Pentecost)
  if (now >= easter && now <= pentecost) {
    return 'easter';
  }
  
  // Check for Thanksgiving (4th Thursday of November in US)
  if (month === 11) {
    const firstThursday = new Date(year, 10, 1);
    firstThursday.setDate(1 + (4 - firstThursday.getDay() + 7) % 7);
    const thanksgiving = new Date(firstThursday);
    thanksgiving.setDate(firstThursday.getDate() + 21); // 4th Thursday
    
    const thanksgivingWeek = new Date(thanksgiving);
    thanksgivingWeek.setDate(thanksgiving.getDate() - 3);
    const thanksgivingEnd = new Date(thanksgiving);
    thanksgivingEnd.setDate(thanksgiving.getDate() + 3);
    
    if (now >= thanksgivingWeek && now <= thanksgivingEnd) {
      return 'thanksgiving';
    }
  }
  
  // Return monthly season for ordinary time
  const seasons = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  
  return seasons[month - 1];
}

// Seasonal photo definitions
const seasonalPhotos: Record<string, SeasonalPhoto> = {
  january: {
    id: 'jan',
    title: 'New Beginnings',
    description: 'Starting the year with renewed faith and hope',
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#E0F2FE"/>
            <stop offset="100%" style="stop-color:#F0F9FF"/>
          </linearGradient>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FDE047"/>
            <stop offset="100%" style="stop-color:#F59E0B"/>
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#skyGrad)"/>
        <circle cx="200" cy="80" r="50" fill="url(#sunGrad)" opacity="0.8"/>
        <path d="M50 350 Q200 280 350 320 Q500 360 650 300 Q700 280 750 300 L750 400 L50 400 Z" fill="#1E40AF" opacity="0.3"/>
        <rect x="350" y="200" width="100" height="150" fill="#8B5A2B"/>
        <polygon points="320,200 400,150 480,200" fill="#DC2626"/>
        <rect x="375" y="280" width="15" height="30" fill="#92400E"/>
        <rect x="410" y="250" width="20" height="25" fill="#60A5FA" opacity="0.7"/>
        <rect x="440" y="250" width="20" height="25" fill="#60A5FA" opacity="0.7"/>
        <path d="M370 120 L380 130 L390 115 L400 125 L410 110 L420 120 L430 105" stroke="#10B981" stroke-width="3" fill="none"/>
        <text x="400" y="50" text-anchor="middle" font-family="serif" font-size="24" fill="#1F2937" font-weight="bold">New Beginnings</text>
        <text x="400" y="380" text-anchor="middle" font-family="serif" font-size="16" fill="#374151">"Therefore, if anyone is in Christ, the new creation has come" - 2 Cor 5:17</text>
      </svg>
    `),
    season: 'january'
  },
  
  february: {
    id: 'feb',
    title: 'Love & Unity',
    description: 'Celebrating God\'s love and Christian fellowship',
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FCA5A5"/>
            <stop offset="100%" style="stop-color:#DC2626"/>
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="#FEF7F7"/>
        <path d="M400 300 C380 260, 320 240, 300 280 C280 240, 220 260, 240 300 C260 340, 340 360, 400 380 C460 360, 540 340, 560 300 C580 260, 520 240, 500 280 C480 240, 420 260, 400 300 Z" fill="url(#heartGrad)"/>
        <circle cx="400" cy="200" r="80" fill="none" stroke="#F59E0B" stroke-width="4" opacity="0.6"/>
        <path d="M360 160 L400 120 L440 160 L400 200 Z" fill="#F59E0B" opacity="0.8"/>
        <text x="400" y="100" text-anchor="middle" font-family="serif" font-size="28" fill="#7C2D12" font-weight="bold">God's Love</text>
        <text x="400" y="130" text-anchor="middle" font-family="serif" font-size="16" fill="#A3A3A3">"Love one another as I have loved you" - John 15:12</text>
      </svg>
    `),
    season: 'february'
  },
  
  march: {
    id: 'mar',
    title: 'Spring Renewal',
    description: 'New life and spiritual growth',
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="springGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#DBEAFE"/>
            <stop offset="100%" style="stop-color:#ECFDF5"/>
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#springGrad)"/>
        <rect x="0" y="350" width="800" height="50" fill="#22C55E"/>
        <circle cx="150" cy="320" r="25" fill="#EAB308"/>
        <circle cx="250" cy="315" r="20" fill="#EAB308"/>
        <circle cx="350" cy="325" r="30" fill="#EAB308"/>
        <circle cx="450" cy="310" r="22" fill="#EAB308"/>
        <circle cx="550" cy="320" r="28" fill="#EAB308"/>
        <circle cx="650" cy="315" r="25" fill="#EAB308"/>
        <rect x="380" y="180" width="40" height="170" fill="#8B5A2B"/>
        <circle cx="400" cy="150" r="80" fill="#10B981"/>
        <text x="400" y="60" text-anchor="middle" font-family="serif" font-size="26" fill="#166534" font-weight="bold">Spring Renewal</text>
        <text x="400" y="90" text-anchor="middle" font-family="serif" font-size="16" fill="#374151">"See, I am doing a new thing!" - Isaiah 43:19</text>
      </svg>
    `),
    season: 'march'
  },
  
  easter: {
    id: 'easter',
    title: 'He Is Risen',
    description: 'Celebrating the resurrection of our Lord',
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="gloryGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:#FEF3C7"/>
            <stop offset="100%" style="stop-color:#DBEAFE"/>
          </radialGradient>
        </defs>
        <rect width="800" height="400" fill="url(#gloryGrad)"/>
        <path d="M300 300 L350 250 L450 250 L500 300 L500 350 L300 350 Z" fill="#A3A3A3"/>
        <ellipse cx="400" cy="250" rx="75" ry="25" fill="#525252"/>
        <circle cx="400" cy="120" r="60" fill="#FDE047" opacity="0.9"/>
        <path d="M340 120 L400 60 L460 120 L400 180 Z" fill="#F59E0B" opacity="0.7"/>
        <path d="M320 120 L400 40 L480 120 L400 200 Z" fill="#FBBF24" opacity="0.5"/>
        <rect x="600" y="280" width="120" height="80" fill="#FFFFFF"/>
        <circle cx="730" cy="300" r="15" fill="#F87171"/>
        <circle cx="730" cy="330" r="15" fill="#F87171"/>
        <circle cx="730" cy="360" r="15" fill="#F87171"/>
        <ellipse cx="650" cy="320" rx="30" ry="50" fill="#FFFFFF"/>
        <text x="400" y="50" text-anchor="middle" font-family="serif" font-size="32" fill="#7C2D12" font-weight="bold">He Is Risen!</text>
        <text x="400" y="380" text-anchor="middle" font-family="serif" font-size="18" fill="#374151">"He is not here; he has risen!" - Matthew 28:6</text>
      </svg>
    `),
    season: 'easter'
  },
  
  lent: {
    id: 'lent',
    title: 'Reflection & Prayer',
    description: 'A season of preparation and spiritual discipline',
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="400" fill="#F3F4F6"/>
        <path d="M200 350 Q300 250 400 300 Q500 350 600 280 L600 400 L200 400 Z" fill="#6B7280" opacity="0.3"/>
        <rect x="350" y="150" width="100" height="200" fill="#8B5A2B"/>
        <rect x="395" y="100" width="10" height="100" fill="#8B5A2B"/>
        <rect x="370" y="120" width="60" height="10" fill="#8B5A2B"/>
        <circle cx="400" cy="200" r="40" fill="none" stroke="#7C2D12" stroke-width="6"/>
        <path d="M385 185 L400 170 L415 185 L400 200 Z" fill="#7C2D12"/>
        <circle cx="150" cy="100" r="3" fill="#D1D5DB"/>
        <circle cx="200" cy="80" r="3" fill="#D1D5DB"/>
        <circle cx="250" cy="90" r="3" fill="#D1D5DB"/>
        <circle cx="550" cy="85" r="3" fill="#D1D5DB"/>
        <circle cx="600" cy="95" r="3" fill="#D1D5DB"/>
        <circle cx="650" cy="75" r="3" fill="#D1D5DB"/>
        <text x="400" y="50" text-anchor="middle" font-family="serif" font-size="26" fill="#374151" font-weight="bold">Prayer & Reflection</text>
        <text x="400" y="380" text-anchor="middle" font-family="serif" font-size="16" fill="#6B7280">"Return to me with all your heart" - Joel 2:12</text>
      </svg>
    `),
    season: 'lent'
  },
  
  christmas: {
    id: 'christmas',
    title: 'Emmanuel - God With Us',
    description: 'Celebrating the birth of our Savior',
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="starGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#FEF3C7"/>
            <stop offset="100%" style="stop-color:#F59E0B"/>
          </radialGradient>
        </defs>
        <rect width="800" height="400" fill="#1E3A8A"/>
        <circle cx="100" cy="80" r="2" fill="#FFFFFF"/>
        <circle cx="150" cy="60" r="1.5" fill="#FFFFFF"/>
        <circle cx="200" cy="90" r="2" fill="#FFFFFF"/>
        <circle cx="600" cy="70" r="1.5" fill="#FFFFFF"/>
        <circle cx="650" cy="85" r="2" fill="#FFFFFF"/>
        <circle cx="700" cy="65" r="1.5" fill="#FFFFFF"/>
        <polygon points="400,80 410,110 440,110 418,130 428,160 400,145 372,160 382,130 360,110 390,110" fill="url(#starGrad)"/>
        <rect x="250" y="280" width="300" height="100" fill="#8B5A2B"/>
        <polygon points="250,280 400,220 550,280" fill="#DC2626"/>
        <rect x="350" y="320" width="40" height="40" fill="#92400E"/>
        <rect x="420" y="310" width="80" height="50" fill="#FDE047" opacity="0.8"/>
        <ellipse cx="460" cy="335" rx="30" ry="15" fill="#FBBF24"/>
        <text x="400" y="50" text-anchor="middle" font-family="serif" font-size="28" fill="#FEF3C7" font-weight="bold">Emmanuel</text>
        <text x="400" y="200" text-anchor="middle" font-family="serif" font-size="18" fill="#E0E7FF">"For unto us a child is born" - Isaiah 9:6</text>
      </svg>
    `),
    season: 'christmas'
  },
  
  advent: {
    id: 'advent',
    title: 'Prepare the Way',
    description: 'Waiting in joyful hope for the coming of our Savior',
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="400" fill="#312E81"/>
        <rect x="200" y="300" width="80" height="80" fill="#7C2D12"/>
        <rect x="320" y="300" width="80" height="80" fill="#7C2D12"/>
        <rect x="440" y="300" width="80" height="80" fill="#7C2D12"/>
        <rect x="560" y="300" width="80" height="80" fill="#7C2D12"/>
        <ellipse cx="240" cy="290" rx="15" ry="8" fill="#F59E0B"/>
        <rect x="235" y="270" width="10" height="20" fill="#F59E0B"/>
        <ellipse cx="360" cy="290" rx="15" ry="8" fill="#F59E0B"/>
        <rect x="355" y="270" width="10" height="20" fill="#F59E0B"/>
        <ellipse cx="480" cy="290" rx="15" ry="8" fill="#F59E0B"/>
        <rect x="475" y="270" width="10" height="20" fill="#F59E0B"/>
        <ellipse cx="600" cy="290" rx="15" ry="8" fill="#DC2626"/>
        <rect x="595" y="270" width="10" height="20" fill="#DC2626"/>
        <path d="M200 200 Q300 150 400 180 Q500 210 600 170 L600 250 L200 250 Z" fill="#10B981" opacity="0.7"/>
        <text x="400" y="100" text-anchor="middle" font-family="serif" font-size="26" fill="#E0E7FF" font-weight="bold">Prepare the Way</text>
        <text x="400" y="130" text-anchor="middle" font-family="serif" font-size="16" fill="#C7D2FE">"Prepare the way of the Lord" - Matthew 3:3</text>
      </svg>
    `),
    season: 'advent'
  },
  
  thanksgiving: {
    id: 'thanksgiving',
    title: 'Grateful Hearts',
    description: 'Giving thanks for God\'s abundant blessings',
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="autumnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#FEF3C7"/>
            <stop offset="100%" style="stop-color:#FDE047"/>
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#autumnGrad)"/>
        <circle cx="150" cy="320" r="20" fill="#DC2626"/>
        <circle cx="200" cy="310" r="25" fill="#F59E0B"/>
        <circle cx="250" cy="325" r="18" fill="#EAB308"/>
        <circle cx="550" cy="315" r="22" fill="#DC2626"/>
        <circle cx="600" cy="320" r="20" fill="#F59E0B"/>
        <circle cx="650" cy="310" r="24" fill="#EAB308"/>
        <ellipse cx="400" cy="250" rx="150" ry="80" fill="#8B5A2B"/>
        <circle cx="350" cy="230" r="15" fill="#DC2626"/>
        <circle cx="380" cy="240" r="12" fill="#F59E0B"/>
        <circle cx="420" cy="235" r="18" fill="#EAB308"/>
        <circle cx="450" cy="245" r="14" fill="#DC2626"/>
        <ellipse cx="400" cy="180" rx="100" ry="40" fill="#F97316"/>
        <polygon points="380,160 400,140 420,160 400,180" fill="#10B981"/>
        <text x="400" y="100" text-anchor="middle" font-family="serif" font-size="28" fill="#7C2D12" font-weight="bold">Grateful Hearts</text>
        <text x="400" y="130" text-anchor="middle" font-family="serif" font-size="16" fill="#92400E">"Give thanks in all circumstances" - 1 Thess 5:18</text>
      </svg>
    `),
    season: 'thanksgiving'
  }
};

// Get current seasonal photo
export function getCurrentSeasonalPhoto(): SeasonalPhoto {
  const currentSeason = getCurrentChristianSeason();
  return seasonalPhotos[currentSeason] || seasonalPhotos.january;
}

// Get all available photos (for testing/preview)
export function getAllSeasonalPhotos(): SeasonalPhoto[] {
  return Object.values(seasonalPhotos);
}

// Get photo by season name
export function getSeasonalPhoto(season: string): SeasonalPhoto | null {
  return seasonalPhotos[season] || null;
}