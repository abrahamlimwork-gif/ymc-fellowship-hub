export const ymcJointWorkbook = {
  id: 'ymc-joint',
  title: 'Young Married Couples (YMC) Track',
  subtitle: '6-Week Covenant Foundation & Fellowship Curriculum',
  edition: '2026 TWNAF YMC Edition',
  author: 'TWNAF & YMC Fellowship Leaders',
  badge: 'Husbands & Wives Together',
  coverColor: '#059669',
  description: 'Specialized 6-week joint study designed specifically for young married couples. Synthesizes fatherhood leadership and motherly wisdom to build unbreakable marital oneness and generational legacy.',
  chapters: [
    {
      id: 'ymc-w1',
      number: 1,
      title: 'Week 1: Covenant Foundations & Leaving/Cleaving',
      subtitle: 'Building On Unshakable Bedrock',
      scripture: {
        text: 'For this reason a man shall leave his father and mother and be joined to his wife, and the two shall become one flesh.',
        ref: 'Genesis 2:24'
      },
      essence: 'Marriage is not a 50/50 contract but a 100/100 covenant under God. Establishing independence and unified priority protects the new home.',
      sections: [
        {
          type: 'interactive',
          id: 'ymc_w1_leaving_cleaving',
          label: 'Leaving and Cleaving Alignment',
          tag: 'Couple Discussion',
          prompt: 'Are there any extended family expectations, financial dependencies, or boundaries that you need to align on to ensure your marriage comes first?',
          fieldType: 'textarea',
          placeholder: 'Our boundaries and agreements are...'
        },
        {
          type: 'interactive',
          id: 'ymc_w1_vision',
          label: 'Our Couple Mission Statement',
          tag: 'Family Vision',
          prompt: 'Draft a short 2-3 sentence mission statement for your marriage (What is God calling your household to represent?):',
          fieldType: 'textarea',
          placeholder: 'As a couple, our mission is to...'
        }
      ]
    },
    {
      id: 'ymc-w2',
      number: 2,
      title: 'Week 2: Healing Generational Wounds Together',
      subtitle: 'Bonding Through Vulnerability & Shared Pain',
      scripture: {
        text: 'Bear one another\'s burdens, and so fulfill the law of Christ.',
        ref: 'Galatians 6:2'
      },
      essence: 'We are attracted by strength, but we bond through weakness. Transparently sharing our family backgrounds prevents projecting past hurt onto our spouse.',
      sections: [
        {
          type: 'interactive',
          id: 'ymc_w2_vulnerability',
          label: 'Vulnerability & Heart Check',
          tag: 'Deep Reflection',
          prompt: 'What is one fear or habit from your childhood home that you want your spouse to understand and help you grow out of?',
          fieldType: 'textarea',
          placeholder: 'One thing I want to share with grace is...'
        }
      ]
    },
    {
      id: 'ymc-w3',
      number: 3,
      title: 'Week 3: The Dance of Love and Respect',
      subtitle: 'Mastering C-O-U-P-L-E and C-H-A-I-R-S',
      scripture: {
        text: 'However, each one of you also must love his wife as he loves himself, and the wife must respect her husband.',
        ref: 'Ephesians 5:33'
      },
      essence: 'When a husband loves sacrificially, a wife finds it natural to respect him. When a wife respects him deeply, a husband is inspired to love her with all his heart.',
      sections: [
        {
          type: 'interactive',
          id: 'ymc_w3_husband_plan',
          label: 'Husband’s Love Focus (C-O-U-P-L-E)',
          tag: 'Husband Step',
          prompt: 'Husband: Choose one area (Closeness, Openness, Understanding, Peacemaking, Loyalty, Esteem) to focus on this week:',
          fieldType: 'textarea',
          placeholder: 'My love action step is...'
        },
        {
          type: 'interactive',
          id: 'ymc_w3_wife_plan',
          label: 'Wife’s Respect Focus (C-H-A-I-R-S)',
          tag: 'Wife Step',
          prompt: 'Wife: Choose one area (Conquest, Hierarchy, Authority, Insight, Relationship, Sexuality) to bless your husband with this week:',
          fieldType: 'textarea',
          placeholder: 'My respect action step is...'
        }
      ]
    },
    {
      id: 'ymc-w4',
      number: 4,
      title: 'Week 4: Moral Authority & Financial Harmony',
      subtitle: 'Rules of Engagement, Budgets, and Conflict Resolution',
      scripture: {
        text: 'Do not let the sun go down while you are still angry.',
        ref: 'Ephesians 4:26'
      },
      essence: 'Healthy couples do not avoid conflict; they master righteous conflict resolution without insult, stonewalling, or financial secrecy.',
      sections: [
        {
          type: 'interactive',
          id: 'ymc_w4_conflict_rules',
          label: 'Our "Rules of Engagement" in Conflict',
          tag: 'Agreement',
          prompt: 'What are 3 ground rules you agree to follow when disagreements arise (e.g. no yelling, take 10min pause if needed, pray before sleeping)?',
          fieldType: 'textarea',
          placeholder: 'Rule 1: ...\nRule 2: ...\nRule 3: ...'
        },
        {
          type: 'interactive',
          id: 'ymc_w4_finances',
          label: 'Financial Transparency & Generosity',
          tag: 'Stewardship',
          prompt: 'What is our shared commitment regarding budgeting, debt freedom, savings, and Kingdom tithing?',
          fieldType: 'textarea',
          placeholder: 'Our financial commitments are...'
        }
      ]
    },
    {
      id: 'ymc-w5',
      number: 5,
      title: 'Week 5: Deep Intimacy & Spiritual Rhythms',
      subtitle: 'Getting into the "Room of the Feeling" & Praying Together',
      scripture: {
        text: 'Where two or three gather in my name, there am I with them.',
        ref: 'Matthew 18:20'
      },
      essence: 'Intimacy is emotional, physical, and spiritual oneness. Couples that hold hands and pray out loud daily build unbreakable emotional resilience.',
      sections: [
        {
          type: 'interactive',
          id: 'ymc_w5_daily_rhythm',
          label: 'Our Daily & Weekly Couple Rhythms',
          tag: 'Habit Builder',
          prompt: 'What time of day will you commit 5-10 minutes to hold hands, check in on feelings, and pray together daily?',
          fieldType: 'textarea',
          placeholder: 'We will pray together at (time/routine)...'
        }
      ]
    },
    {
      id: 'ymc-w6',
      number: 6,
      title: 'Week 6: Generational Legacy & Parenting Preparation',
      subtitle: 'Navigating Seasons and Blessing the Next Generation',
      scripture: {
        text: 'One generation shall praise your works to another, and shall declare your mighty acts.',
        ref: 'Psalm 145:4'
      },
      essence: 'Whether expecting children or preparing for future family milestones, a young couple’s united leadership transforms the spiritual heritage of their children.',
      sections: [
        {
          type: 'interactive',
          id: 'ymc_w6_legacy_blessing',
          label: 'Our Generational Blessing',
          tag: 'Prophetic Blessing',
          prompt: 'Write a dedicated blessing over the future of your marriage, your future/current children, and your fellowship community.',
          fieldType: 'textarea',
          placeholder: 'In Jesus’ name, we declare over our family that...'
        }
      ]
    }
  ]
};
