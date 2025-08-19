export interface PromptCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  prompts: Prompt[];
}

export interface Prompt {
  id: string;
  title: string;
  text: string;
  tags: string[];
}

export const promptLibrary: PromptCategory[] = [
  {
    id: "ministry-leadership",
    name: "Ministry Leadership",
    icon: "👥",
    description: "Guidance for pastors, church leaders, and ministry coordinators",
    prompts: [
      {
        id: "sermon-prep",
        title: "Sermon Preparation",
        text: "Help me prepare a sermon on [insert topic/Scripture]. Please provide biblical insights, key points, practical applications, and supporting verses.",
        tags: ["preaching", "sermon", "teaching"]
      },
      {
        id: "conflict-resolution",
        title: "Church Conflict Resolution",
        text: "What are biblical principles for resolving conflict in the church? Please provide Scripture references and practical steps for reconciliation.",
        tags: ["conflict", "reconciliation", "leadership"]
      },
      {
        id: "team-encouragement",
        title: "Encouraging Ministry Teams",
        text: "How can I biblically encourage and motivate a discouraged ministry team? Please provide specific Scripture and practical advice.",
        tags: ["encouragement", "team", "leadership"]
      },
      {
        id: "vision-casting",
        title: "Vision Casting",
        text: "Help me develop a biblical vision statement for our ministry. What Scripture passages speak to God's heart for the church and community outreach?",
        tags: ["vision", "planning", "mission"]
      },
      {
        id: "discipleship-plan",
        title: "Discipleship Planning",
        text: "What does the Bible teach about making disciples? Help me create a structured discipleship plan based on Jesus' example and biblical principles.",
        tags: ["discipleship", "spiritual growth", "mentoring"]
      }
    ]
  },
  {
    id: "mens-ministry",
    name: "Men's Ministry",
    icon: "💪",
    description: "Biblical guidance for men's spiritual growth and leadership",
    prompts: [
      {
        id: "biblical-manhood",
        title: "Biblical Manhood",
        text: "What does the Bible teach about biblical manhood and masculinity? Please provide Scripture references and practical applications for modern men.",
        tags: ["manhood", "masculinity", "identity"]
      },
      {
        id: "father-leadership",
        title: "Fatherhood & Family Leadership",
        text: "How should Christian fathers lead their families according to Scripture? Please provide biblical principles and practical guidance.",
        tags: ["fatherhood", "family", "leadership"]
      },
      {
        id: "mens-accountability",
        title: "Men's Accountability",
        text: "What does the Bible say about accountability between Christian men? Help me understand biblical friendship and mutual encouragement.",
        tags: ["accountability", "friendship", "community"]
      },
      {
        id: "work-faith",
        title: "Faith in the Workplace",
        text: "How can Christian men integrate their faith in their work environment? Please provide biblical principles for workplace integrity and witness.",
        tags: ["work", "integrity", "witness"]
      }
    ]
  },
  {
    id: "womens-ministry",
    name: "Women's Ministry",
    icon: "🌸",
    description: "Biblical encouragement and guidance for women in ministry",
    prompts: [
      {
        id: "godly-womanhood",
        title: "Godly Womanhood",
        text: "What does the Bible teach about godly womanhood? Please provide Scripture references and practical applications for women today.",
        tags: ["womanhood", "identity", "calling"]
      },
      {
        id: "womens-study-topics",
        title: "Women's Bible Study Ideas",
        text: "Suggest biblical topics perfect for women's Bible study groups. Please include Scripture passages and discussion questions.",
        tags: ["bible study", "discussion", "community"]
      },
      {
        id: "motherhood-faith",
        title: "Christian Motherhood",
        text: "How can Christian mothers raise their children according to biblical principles? Please provide Scripture and practical parenting guidance.",
        tags: ["motherhood", "parenting", "children"]
      },
      {
        id: "womens-mentoring",
        title: "Women's Mentoring",
        text: "What does Titus 2 teach about older women mentoring younger women? Help me understand biblical mentoring relationships.",
        tags: ["mentoring", "discipleship", "relationships"]
      }
    ]
  },
  {
    id: "missions-outreach",
    name: "Missions & Outreach",
    icon: "🌍",
    description: "Evangelism, missions, and community outreach guidance",
    prompts: [
      {
        id: "great-commission",
        title: "Understanding the Great Commission",
        text: "Help me understand the Great Commission in Matthew 28:18-20. What does it mean for our church's mission and outreach efforts?",
        tags: ["great commission", "evangelism", "mission"]
      },
      {
        id: "evangelism-conversations",
        title: "Evangelism Conversation Starters",
        text: "Provide biblical and natural ways to start evangelistic conversations. Please include Scripture verses and practical examples.",
        tags: ["evangelism", "witnessing", "conversations"]
      },
      {
        id: "missions-trip-prep",
        title: "Missions Trip Preparation",
        text: "How should we prepare spiritually and practically for a missions trip? Please provide biblical foundation and practical steps.",
        tags: ["missions", "preparation", "travel"]
      },
      {
        id: "community-outreach",
        title: "Community Outreach Ideas",
        text: "What are biblical ways our church can serve and reach our local community? Please suggest practical outreach ministries.",
        tags: ["outreach", "community", "service"]
      }
    ]
  },
  {
    id: "church-planting",
    name: "Church Planting",
    icon: "🏛️",
    description: "Biblical guidance for starting and growing new churches",
    prompts: [
      {
        id: "church-planting-biblical",
        title: "Biblical Foundation for Church Planting",
        text: "What does the Bible teach about planting new churches? Please provide Scripture references from Acts and the epistles.",
        tags: ["church planting", "biblical foundation", "acts"]
      },
      {
        id: "church-leadership-structure",
        title: "Church Leadership Structure",
        text: "What does the Bible teach about church leadership roles (pastors, elders, deacons)? Help me understand biblical church governance.",
        tags: ["leadership", "elders", "deacons", "structure"]
      },
      {
        id: "church-discipline",
        title: "Church Discipline",
        text: "How should biblical church discipline be practiced according to Matthew 18? Please provide guidance on restoration and accountability.",
        tags: ["discipline", "restoration", "accountability"]
      },
      {
        id: "church-growth-principles",
        title: "Biblical Church Growth",
        text: "What are biblical principles for healthy church growth? Please distinguish between numerical growth and spiritual maturity.",
        tags: ["growth", "discipleship", "maturity"]
      }
    ]
  },
  {
    id: "health-wellness",
    name: "Health & Wellness",
    icon: "🙏",
    description: "Biblical perspective on physical, mental, and spiritual health",
    prompts: [
      {
        id: "body-temple",
        title: "Body as God's Temple",
        text: "What does the Bible teach about caring for our bodies as temples of the Holy Spirit? Please provide Scripture and practical health guidance.",
        tags: ["health", "stewardship", "temple"]
      },
      {
        id: "mental-health-biblical",
        title: "Biblical Perspective on Mental Health",
        text: "How does the Bible address anxiety, depression, and mental health struggles? Please provide Scripture and pastoral guidance.",
        tags: ["mental health", "anxiety", "depression", "hope"]
      },
      {
        id: "healing-prayer",
        title: "Prayer for Healing",
        text: "What does the Bible teach about divine healing and prayer for the sick? Please explain James 5:14-16 and God's will in healing.",
        tags: ["healing", "prayer", "sickness"]
      },
      {
        id: "grief-comfort",
        title: "Biblical Comfort in Grief",
        text: "How does the Bible provide comfort for those grieving loss? Please provide Scripture verses and pastoral guidance for mourning.",
        tags: ["grief", "comfort", "loss", "hope"]
      }
    ]
  },
  {
    id: "personal-growth",
    name: "Personal Spiritual Growth",
    icon: "📖",
    description: "Individual discipleship and spiritual development",
    prompts: [
      {
        id: "prayer-life",
        title: "Developing a Prayer Life",
        text: "How can I develop a deeper, more consistent prayer life? Please provide biblical principles and practical suggestions from Scripture.",
        tags: ["prayer", "spiritual disciplines", "growth"]
      },
      {
        id: "bible-study-methods",
        title: "Personal Bible Study Methods",
        text: "What are effective methods for personal Bible study? Please suggest biblical approaches for deeper Scripture understanding.",
        tags: ["bible study", "scripture", "methods"]
      },
      {
        id: "spiritual-disciplines",
        title: "Spiritual Disciplines",
        text: "What spiritual disciplines does the Bible teach? Please explain fasting, prayer, meditation on Scripture, and their purposes.",
        tags: ["disciplines", "fasting", "meditation", "growth"]
      },
      {
        id: "biblical-stewardship",
        title: "Biblical Financial Stewardship",
        text: "What does the Bible teach about money, tithing, and financial stewardship? Please provide Scripture and practical guidance.",
        tags: ["stewardship", "money", "tithing", "finances"]
      },
      {
        id: "overcoming-sin",
        title: "Overcoming Sin Patterns",
        text: "How does the Bible teach us to overcome persistent sin and develop holy habits? Please provide Scripture and practical steps.",
        tags: ["sin", "holiness", "victory", "habits"]
      },
      {
        id: "godly-responses",
        title: "Making Godly Responses",
        text: "When someone has hurt my feelings or made an inappropriate comment in person or during Bible study, how can I respond in a Christ-like manner? Please provide biblical guidance for gracious, wise responses that honor God.",
        tags: ["conflict", "grace", "wisdom", "responses", "relationships"]
      }
    ]
  },
  {
    id: "youth-ministry",
    name: "Youth & Children's Ministry",
    icon: "🎯",
    description: "Ministry to young people and children",
    prompts: [
      {
        id: "youth-discipleship",
        title: "Youth Discipleship",
        text: "How can we effectively disciple teenagers according to biblical principles? Please provide age-appropriate approaches and Scripture.",
        tags: ["youth", "discipleship", "teenagers"]
      },
      {
        id: "childrens-ministry",
        title: "Children's Ministry Planning",
        text: "What are biblical principles for children's ministry? Please suggest age-appropriate ways to teach Scripture to children.",
        tags: ["children", "ministry", "teaching"]
      },
      {
        id: "youth-culture-engagement",
        title: "Engaging Youth Culture",
        text: "How can we biblically engage with current youth culture while maintaining Christian values? Please provide balanced guidance.",
        tags: ["culture", "youth", "engagement", "values"]
      },
      {
        id: "family-ministry",
        title: "Family Ministry Integration",
        text: "How can our church support families in raising children with Christian values? Please suggest biblical family ministry approaches.",
        tags: ["family", "parenting", "support", "ministry"]
      }
    ]
  }
];

export const getPromptsByCategory = (categoryId: string): Prompt[] => {
  const category = promptLibrary.find(cat => cat.id === categoryId);
  return category?.prompts || [];
};

export const searchPrompts = (query: string): Prompt[] => {
  const normalizedQuery = query.toLowerCase();
  const results: Prompt[] = [];
  
  promptLibrary.forEach(category => {
    category.prompts.forEach(prompt => {
      const matchesTitle = prompt.title.toLowerCase().includes(normalizedQuery);
      const matchesText = prompt.text.toLowerCase().includes(normalizedQuery);
      const matchesTags = prompt.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));
      
      if (matchesTitle || matchesText || matchesTags) {
        results.push(prompt);
      }
    });
  });
  
  return results;
};