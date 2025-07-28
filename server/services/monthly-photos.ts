import type { MonthlyPhoto } from "@shared/schema";

// Monthly themed photo data with Christian/inspirational themes
// Using high-quality stock photos from Unsplash with appropriate themes
// Each month has 2 photos: one for hero, one for how-it-works section
export const MONTHLY_HERO_PHOTOS: MonthlyPhoto[] = [
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

// Secondary photos for "How It Works" section - Bible study, community, worship themes
export const MONTHLY_SECONDARY_PHOTOS: MonthlyPhoto[] = [
  {
    id: 101,
    month: 1, // January
    title: "New Year Bible Study",
    description: "Starting the year with intentional Scripture study and prayer",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2070&auto=format&fit=crop",
    altText: "Open Bible with warm lighting, representing new year spiritual commitment",
    theme: "Scripture Study",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 102,
    month: 2, // February
    title: "Community Prayer Circle",
    description: "Believers joining together in love and intercession",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
    altText: "Small group of diverse Christians praying together in circle",
    theme: "Community Prayer",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 103,
    month: 3, // March
    title: "Spring Bible Study",
    description: "Growing in God's Word as creation awakens around us",
    imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop",
    altText: "Bible study group meeting outdoors in beautiful spring setting",
    theme: "Outdoor Worship",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 104,
    month: 4, // April
    title: "Easter Celebration Study",
    description: "Exploring the resurrection story and its life-changing power",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=2070&auto=format&fit=crop",
    altText: "Christians studying Easter scriptures together with joy and reverence",
    theme: "Easter Studies",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 105,
    month: 5, // May
    title: "Mother's Day Faith",
    description: "Honoring godly mothers and their faithful legacy",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2070&auto=format&fit=crop",
    altText: "Mother reading Bible stories to children, passing on faith",
    theme: "Family Faith",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 106,
    month: 6, // June
    title: "Summer Youth Ministry",
    description: "Young people growing in faith and biblical understanding",
    imageUrl: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2070&auto=format&fit=crop",
    altText: "Young adults engaged in Bible study and Christian fellowship",
    theme: "Youth Ministry",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 107,
    month: 7, // July
    title: "Freedom in Christ Study",
    description: "Understanding our spiritual liberty and Christian identity",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    altText: "Person reading Bible with peaceful expression, experiencing spiritual freedom",
    theme: "Personal Study",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 108,
    month: 8, // August
    title: "Harvest Season Devotion",
    description: "Reflecting on God's provision and faithful abundance",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2070&auto=format&fit=crop",
    altText: "Christians praying over harvest feast, acknowledging God's provision",
    theme: "Gratitude Study",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 109,
    month: 9, // September
    title: "Back to School Prayer",
    description: "Seeking God's wisdom for new learning opportunities",
    imageUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=2070&auto=format&fit=crop",
    altText: "Student with Bible and school materials, praying for wisdom",
    theme: "Educational Faith",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 110,
    month: 10, // October
    title: "Fall Discipleship",
    description: "Deepening our walk with Christ as seasons change",
    imageUrl: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?q=80&w=2070&auto=format&fit=crop",
    altText: "Small group Bible study in cozy autumn setting with warm lighting",
    theme: "Discipleship",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 111,
    month: 11, // November
    title: "Thanksgiving Gathering",
    description: "Families and friends united in grateful worship",
    imageUrl: "https://images.unsplash.com/photo-1574731672081-e5e5a651e8b5?q=80&w=2070&auto=format&fit=crop",
    altText: "Multi-generational family holding hands around dinner table in prayer",
    theme: "Family Worship",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 112,
    month: 12, // December
    title: "Advent Bible Study",
    description: "Preparing hearts for Christmas through Scripture and prayer",
    imageUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=2070&auto=format&fit=crop",
    altText: "Christmas Bible study with Advent candles and nativity scene",
    theme: "Advent Preparation",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class MonthlyPhotoService {
  /**
   * Get the current month's hero photo automatically
   * @returns The themed hero photo for the current month
   */
  static getCurrentMonthHeroPhoto(): MonthlyPhoto {
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
    const monthPhoto = MONTHLY_HERO_PHOTOS.find(photo => photo.month === currentMonth);
    
    // Fallback to January if somehow no photo is found
    return monthPhoto || MONTHLY_HERO_PHOTOS[0];
  }

  /**
   * Get the current month's secondary photo automatically
   * @returns The themed secondary photo for the current month
   */
  static getCurrentMonthSecondaryPhoto(): MonthlyPhoto {
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
    const monthPhoto = MONTHLY_SECONDARY_PHOTOS.find(photo => photo.month === currentMonth);
    
    // Fallback to January if somehow no photo is found
    return monthPhoto || MONTHLY_SECONDARY_PHOTOS[0];
  }

  /**
   * Get a specific month's hero photo
   * @param month - Month number (1-12)
   * @returns The themed hero photo for the specified month
   */
  static getMonthHeroPhoto(month: number): MonthlyPhoto | null {
    if (month < 1 || month > 12) return null;
    return MONTHLY_HERO_PHOTOS.find(photo => photo.month === month) || null;
  }

  /**
   * Get a specific month's secondary photo
   * @param month - Month number (1-12)
   * @returns The themed secondary photo for the specified month
   */
  static getMonthSecondaryPhoto(month: number): MonthlyPhoto | null {
    if (month < 1 || month > 12) return null;
    return MONTHLY_SECONDARY_PHOTOS.find(photo => photo.month === month) || null;
  }

  /**
   * Get all monthly hero photos
   * @returns Array of all 12 monthly hero photos
   */
  static getAllMonthlyHeroPhotos(): MonthlyPhoto[] {
    return MONTHLY_HERO_PHOTOS;
  }

  /**
   * Get all monthly secondary photos
   * @returns Array of all 12 monthly secondary photos
   */
  static getAllMonthlySecondaryPhotos(): MonthlyPhoto[] {
    return MONTHLY_SECONDARY_PHOTOS;
  }

  /**
   * Get both photos for current month
   * @returns Object with both hero and secondary photos
   */
  static getCurrentMonthPhotos(): { hero: MonthlyPhoto; secondary: MonthlyPhoto } {
    return {
      hero: this.getCurrentMonthHeroPhoto(),
      secondary: this.getCurrentMonthSecondaryPhoto()
    };
  }

  // Legacy methods for backward compatibility
  static getCurrentMonthPhoto(): MonthlyPhoto {
    return this.getCurrentMonthHeroPhoto();
  }

  static getMonthPhoto(month: number): MonthlyPhoto | null {
    return this.getMonthHeroPhoto(month);
  }

  static getAllMonthlyPhotos(): MonthlyPhoto[] {
    return this.getAllMonthlyHeroPhotos();
  }
}