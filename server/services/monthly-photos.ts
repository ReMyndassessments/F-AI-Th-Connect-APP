import type { MonthlyPhoto } from "@shared/schema";

// Monthly themed photo data featuring modern young Christians in Bible study and faith activities
// Using high-quality stock photos from Unsplash featuring young adults in Christian fellowship
// Each month has 2 photos: one for hero, one for how-it-works section
export const MONTHLY_HERO_PHOTOS: MonthlyPhoto[] = [
  {
    id: 1,
    month: 1, // January
    title: "New Year Bible Study",
    description: "Young Christians starting the year with intentional Scripture study",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
    altText: "Young diverse Christians studying Bible together around modern coffee table",
    theme: "New Year Commitment",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    month: 2, // February
    title: "Young Adults in Fellowship",
    description: "Modern Christian community building authentic relationships",
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2070&auto=format&fit=crop",
    altText: "Diverse young adults praying together in circle with hands joined",
    theme: "Christian Fellowship",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    month: 3, // March
    title: "Spring Campus Ministry",
    description: "College students growing in faith during spring semester",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
    altText: "College students with Bibles sitting on campus grass in spring",
    theme: "Campus Faith",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    month: 4, // April
    title: "Easter Celebration Study",
    description: "Young believers exploring the resurrection story together",
    imageUrl: "https://images.unsplash.com/photo-1555708982-8645ec9ce3cc?q=80&w=2070&auto=format&fit=crop",
    altText: "Young Christians reading Easter story together with flowers nearby",
    theme: "Easter Joy",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    month: 5, // May
    title: "Young Women's Bible Study",
    description: "Modern Christian women growing together in God's Word",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0d76b3a2f64?q=80&w=2070&auto=format&fit=crop",
    altText: "Young women in comfortable living room setting with Bibles and notebooks",
    theme: "Women's Ministry",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    month: 6, // June
    title: "Summer Youth Ministry",
    description: "Young people engaging deeply with Scripture in summer",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2070&auto=format&fit=crop",
    altText: "Young Christians with Bibles gathered on outdoor deck in summer",
    theme: "Youth Engagement",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 7,
    month: 7, // July
    title: "Freedom in Christ Study",
    description: "Young adults discovering spiritual liberty through Bible study",
    imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070&auto=format&fit=crop",
    altText: "Young woman reading Bible outdoors with peaceful mountain background",
    theme: "Spiritual Freedom",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 8,
    month: 8, // August
    title: "Harvest Season Fellowship",
    description: "Young Christians gathering for Bible study and community",
    imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=2070&auto=format&fit=crop",
    altText: "Young adults in cozy living room Bible study with warm lighting",
    theme: "Community Study",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 9,
    month: 9, // September
    title: "Back to School Faith",
    description: "Students beginning new semester with Bible study commitment",
    imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop",
    altText: "College students with Bibles and laptops in modern campus setting",
    theme: "Academic Faith",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 10,
    month: 10, // October
    title: "Fall Discipleship Group",
    description: "Young believers deepening their walk with Christ together",
    imageUrl: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=2070&auto=format&fit=crop",
    altText: "Young Christians in autumn outdoor Bible study with fall leaves",
    theme: "Discipleship",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 11,
    month: 11, // November
    title: "Thanksgiving Bible Study",
    description: "Young Christians expressing gratitude through Scripture",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop",
    altText: "Diverse young adults sharing thanksgiving meal with Bibles on table",
    theme: "Grateful Hearts",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 12,
    month: 12, // December
    title: "Advent Study Group",
    description: "Young believers preparing hearts for Christmas through Scripture",
    imageUrl: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=2070&auto=format&fit=crop",
    altText: "Young Christians reading Christmas story with warm fireplace background",
    theme: "Christ's Birth",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Secondary photos for "How It Works" section - young Christians in Bible study activities
export const MONTHLY_SECONDARY_PHOTOS: MonthlyPhoto[] = [
  {
    id: 101,
    month: 1, // January
    title: "Young Adults Bible Study",
    description: "Modern Christians discussing Scripture and prayer together",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
    altText: "Young people with Bibles in circle discussion at modern church",
    theme: "Group Study",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 102,
    month: 2, // February
    title: "Community Prayer Circle",
    description: "Believers joining together in love and intercession",
    imageUrl: "https://images.unsplash.com/photo-1528118722131-4cd4d9361ba0?q=80&w=2070&auto=format&fit=crop",
    altText: "Young Christians holding hands in prayer circle outdoors",
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
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
    altText: "Young Christians with Bibles under blooming spring trees",
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
    imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2070&auto=format&fit=crop",
    altText: "Young Christians with Easter lilies reading resurrection story",
    theme: "Easter Studies",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 105,
    month: 5, // May
    title: "Men's Bible Study Group",
    description: "Young Christian men growing together in discipleship",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
    altText: "Young men in serious Bible discussion around wooden table",
    theme: "Men's Ministry",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 106,
    month: 6, // June
    title: "Summer Youth Ministry",
    description: "Young people growing in faith and biblical understanding",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop",
    altText: "Young adults with guitars and Bibles in summer camp setting",
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
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
    altText: "Young person reading Bible on mountaintop with scenic view",
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
    imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?q=80&w=2070&auto=format&fit=crop",
    altText: "Young Christians sharing meal and Bible study in rustic setting",
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
    imageUrl: "https://images.unsplash.com/photo-1585951894132-bf61f5e41b67?q=80&w=2070&auto=format&fit=crop",
    altText: "College students praying together on campus with backpacks and Bibles",
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
    imageUrl: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=2070&auto=format&fit=crop",
    altText: "Young Christians with warm drinks and Bibles in autumn coffee shop",
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
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070&auto=format&fit=crop",
    altText: "Young adults sharing thanksgiving feast with grateful hearts",
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
    imageUrl: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2070&auto=format&fit=crop",
    altText: "Young Christians reading nativity story with Christmas lights backdrop",
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