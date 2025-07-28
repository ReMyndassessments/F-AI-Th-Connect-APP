import type { MonthlyPhoto } from "@shared/schema";

// Monthly themed photo data with Christian/inspirational themes
// Using high-quality stock photos from Unsplash with appropriate themes
export const MONTHLY_PHOTO_DATA: MonthlyPhoto[] = [
  {
    id: 1,
    month: 1, // January
    title: "New Beginnings",
    description: "Start the year with faith, hope, and renewed purpose",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
    altText: "Person in prayer during sunrise, symbolizing new beginnings and spiritual renewal",
    theme: "New Year Renewal",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    month: 2, // February
    title: "Love and Fellowship",
    description: "Celebrating God's love and Christian community",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070&auto=format&fit=crop",
    altText: "Diverse group of people in fellowship, sharing love and community",
    theme: "Christian Love",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    month: 3, // March
    title: "Spring Renewal",
    description: "God's creation awakening with new life and growth",
    imageUrl: "https://images.unsplash.com/photo-1521651201144-634f700b36ef?q=80&w=2070&auto=format&fit=crop",
    altText: "Beautiful spring landscape with blooming flowers, representing spiritual growth",
    theme: "Spiritual Growth",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    month: 4, // April
    title: "Easter Hope",
    description: "Resurrection hope and the promise of eternal life",
    imageUrl: "https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?q=80&w=2070&auto=format&fit=crop",
    altText: "Easter cross at sunrise, symbolizing hope and resurrection",
    theme: "Resurrection Hope",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    month: 5, // May
    title: "Faithful Service",
    description: "Serving others with Christ's love and compassion",
    imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2070&auto=format&fit=crop",
    altText: "Hands serving others in Christian ministry and outreach",
    theme: "Christian Service",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    month: 6, // June
    title: "Family Faith",
    description: "Building strong Christian families and marriages",
    imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop",
    altText: "Christian family praying together, showing unity in faith",
    theme: "Family Unity",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 7,
    month: 7, // July
    title: "Freedom in Christ",
    description: "Celebrating spiritual freedom and liberty in faith",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
    altText: "Person with arms raised in worship, expressing freedom and joy in Christ",
    theme: "Spiritual Freedom",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 8,
    month: 8, // August
    title: "Harvest Blessings",
    description: "Grateful for God's abundant provision and harvest",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop",
    altText: "Golden wheat field representing God's provision and harvest blessings",
    theme: "Divine Provision",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 9,
    month: 9, // September
    title: "Back to Learning",
    description: "Growing in wisdom and biblical understanding",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2070&auto=format&fit=crop",
    altText: "Open Bible with warm lighting, representing learning and spiritual education",
    theme: "Biblical Wisdom",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 10,
    month: 10, // October
    title: "Gratitude & Harvest",
    description: "Thanksgiving for God's faithfulness through all seasons",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
    altText: "Autumn landscape showing fall colors, representing gratitude and thanksgiving",
    theme: "Thankful Hearts",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 11,
    month: 11, // November
    title: "Thanksgiving Joy",
    description: "Gathering in gratitude for God's countless blessings",
    imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?q=80&w=2070&auto=format&fit=crop",
    altText: "Family gathered around dinner table in prayer and thanksgiving",
    theme: "Grateful Worship",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 12,
    month: 12, // December
    title: "Christmas Hope",
    description: "Celebrating the birth of our Savior and God's greatest gift",
    imageUrl: "https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=2070&auto=format&fit=crop",
    altText: "Nativity scene representing the birth of Jesus and Christmas hope",
    theme: "Christ's Birth",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class MonthlyPhotoService {
  /**
   * Get the current month's photo automatically
   * @returns The themed photo for the current month
   */
  static getCurrentMonthPhoto(): MonthlyPhoto {
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
    const monthPhoto = MONTHLY_PHOTO_DATA.find(photo => photo.month === currentMonth);
    
    // Fallback to January if somehow no photo is found
    return monthPhoto || MONTHLY_PHOTO_DATA[0];
  }

  /**
   * Get a specific month's photo
   * @param month - Month number (1-12)
   * @returns The themed photo for the specified month
   */
  static getMonthPhoto(month: number): MonthlyPhoto | null {
    if (month < 1 || month > 12) return null;
    return MONTHLY_PHOTO_DATA.find(photo => photo.month === month) || null;
  }

  /**
   * Get all monthly photos
   * @returns Array of all 12 monthly photos
   */
  static getAllMonthlyPhotos(): MonthlyPhoto[] {
    return MONTHLY_PHOTO_DATA;
  }

  /**
   * Get the next month's photo (for previewing)
   * @returns The themed photo for next month
   */
  static getNextMonthPhoto(): MonthlyPhoto {
    const nextMonth = ((new Date().getMonth() + 1) % 12) + 1;
    const monthPhoto = MONTHLY_PHOTO_DATA.find(photo => photo.month === nextMonth);
    return monthPhoto || MONTHLY_PHOTO_DATA[0];
  }
}