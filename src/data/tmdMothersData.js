export const tmdMothersWorkbook = {
  id: 'tmd-mothers',
  title: 'TMD Mothers Workbook',
  subtitle: 'Teach Me, Dad (TMD) - Empowering the Marital & Motherhood Team',
  edition: 'April 2024 Edition',
  author: 'TWNAF Women’s Team & Susan Hunt',
  badge: 'Wives / Mothers',
  coverColor: '#9333ea',
  description: 'Comprehensive 12-chapter training manual for wives and mothers on letting your husband shine, enhancing closeness, fulfilling female design, nurturing compassion, and creating spaces of worship.',
  chapters: [
    {
      id: 'tmd-ch1',
      number: 1,
      title: 'Satan Came to Earth, Sir!',
      subtitle: 'Reclaiming Biblical Territory and Intercession',
      scripture: {
        text: 'The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you; the Lord turn his face toward you and give you peace.',
        ref: 'Numbers 6:24-26'
      },
      essence: 'Women of biblical faith must reclaim territory by displaying the divine design of female creation and faithfully blessing their husbands and children.',
      sections: [
        {
          type: 'interactive',
          id: 'tmd_ch1_prayer_blessing',
          label: 'Personalized Daily Blessing Prayer',
          tag: 'Daily Prayer',
          prompt: 'Enter your husband\'s / father figure\'s name to pray Numbers 6:24-26 over him:',
          fieldType: 'prayer-insert',
          template: 'May the Lord bless {NAME} and protect {NAME}. May the Lord smile on {NAME} and be gracious to {NAME}. May the Lord show His favour and give {NAME} His peace.'
        },
        {
          type: 'interactive',
          id: 'tmd_ch1_reflection',
          label: 'Heart of a Mother & Wife',
          tag: 'Reflection',
          prompt: 'What are your deepest hopes and prayers for your family during this fellowship season?',
          fieldType: 'textarea',
          placeholder: 'My prayer and hope is...'
        }
      ]
    },
    {
      id: 'tmd-ch2',
      number: 2,
      title: 'The Cry of the Children',
      subtitle: 'The Mother’s Heart for Societal Restoration',
      scripture: {
        text: 'Pour out your heart like water before the presence of the Lord! Lift your hands to him for the lives of your children.',
        ref: 'Lamentations 2:19'
      },
      essence: 'When mothers stand in the gap and understand the impact of brokenness, they become catalysts for generational healing.',
      sections: [
        {
          type: 'interactive',
          id: 'tmd_ch2_family_culture',
          label: 'Discussing Today’s Family Culture',
          tag: 'Group Discussion',
          prompt: 'What does today’s prevailing culture communicate about marriage and mothering? How can we counter it with God’s design?',
          fieldType: 'textarea',
          placeholder: 'Today’s culture teaches... but God’s word calls us to...'
        }
      ]
    },
    {
      id: 'tmd-ch3',
      number: 3,
      title: 'Every Season Counts',
      subtitle: 'Nurturing Children & Marriage Across Every Stage',
      scripture: {
        text: 'She looks well to the ways of her household and does not eat the bread of idleness.',
        ref: 'Proverbs 31:27'
      },
      essence: 'A mother’s care shifts gracefully as children grow from infants needing attachment to adolescents stepping into independence.',
      sections: [
        {
          type: 'interactive',
          id: 'tmd_ch3_season_adaptation',
          label: 'Seasonal Focus Worksheet',
          tag: 'Assessment',
          prompt: 'How are you balancing the needs of your husband and your children in your current season of life?',
          fieldType: 'textarea',
          placeholder: 'In this season, I am focusing on...'
        }
      ]
    },
    {
      id: 'tmd-ch4',
      number: 4,
      title: 'The Father & Mother Wound Revealed',
      subtitle: 'Healing From Past Deficits and Finding Grace',
      scripture: {
        text: 'Can a mother forget the baby at her breast and have no compassion on the child she has borne? Though she may forget, I will not forget you!',
        ref: 'Isaiah 49:15'
      },
      essence: 'Both father and mother wounds can distort our view of self and God. Healing brings freedom to love without fear.',
      sections: [
        {
          type: 'text',
          heading: 'Common Mother Wounds',
          body: `• The Overprotective/Smothering Mother: Hinders independence and risk-taking.\n• The Emotionally Distant/Critical Mother: Creates insecurity and fear of rejection.\n• The Inconsistent Mother: Unpredictable emotional climate.`
        },
        {
          type: 'interactive',
          id: 'tmd_ch4_wound_release',
          label: 'Personal Healing Reflection',
          tag: 'Heart Check',
          prompt: 'What wounds or negative patterns from your family of origin are you asking God to heal and break in your new marriage?',
          fieldType: 'textarea',
          placeholder: 'I release and surrender...'
        }
      ]
    },
    {
      id: 'tmd-ch5',
      number: 5,
      title: 'Real Fatherhood: Understanding Your Husband',
      subtitle: 'Supporting the Man God Called to Lead',
      scripture: {
        text: 'The heart of her husband trusts in her, and he will have no lack of gain.',
        ref: 'Proverbs 31:11'
      },
      essence: 'Understanding a man’s unique vulnerabilities and God-given weight of responsibility allows a wife to be a powerful, life-giving ally.',
      sections: [
        {
          type: 'interactive',
          id: 'tmd_ch5_understanding',
          label: 'Empathy for Your Husband’s Journey',
          tag: 'Reflection',
          prompt: 'What are the main pressures, fears, or workloads your husband is carrying right now? How can you show him you are his #1 supporter?',
          fieldType: 'textarea',
          placeholder: 'My husband carries pressures regarding... I can support him by...'
        }
      ]
    },
    {
      id: 'tmd-ch6',
      number: 6,
      title: 'A Father Establishes Moral Authority',
      subtitle: 'Presenting an Unshakable United Front',
      scripture: {
        text: 'Every wise woman builds her house, but the foolish one tears it down with her own hands.',
        ref: 'Proverbs 14:1'
      },
      essence: 'A mother validates the father’s moral authority by supporting his leadership in front of the children and never criticizing him publicly.',
      sections: [
        {
          type: 'interactive',
          id: 'tmd_ch6_united_front',
          label: 'Guarding the United Front',
          tag: 'Commitment',
          prompt: 'How do you handle disagreements about decisions or discipline? How can you ensure discussions happen privately rather than in front of kids or peers?',
          fieldType: 'textarea',
          placeholder: 'Our strategy for a united front is...'
        }
      ]
    },
    {
      id: 'tmd-ch7',
      number: 7,
      title: 'A Father Confers Identity',
      subtitle: 'Reinforcing Godly Gender & Belonging in the Home',
      scripture: {
        text: 'Children are a heritage from the Lord, offspring a reward from him.',
        ref: 'Psalm 127:3'
      },
      essence: 'Mothers reinforce identity by echoing the father’s blessing and cultivating an environment where each child knows they are uniquely treasured.',
      sections: [
        {
          type: 'interactive',
          id: 'tmd_ch7_affirmation_echo',
          label: 'Echoing Identity and Worth',
          tag: 'Action Plan',
          prompt: 'How do you verbally affirm your husband’s identity and your children’s unique God-given callings?',
          fieldType: 'textarea',
          placeholder: 'I affirm their identity by...'
        }
      ]
    },
    {
      id: 'tmd-ch8',
      number: 8,
      title: 'A Father Provides Security',
      subtitle: 'Cultivating the Emotional Haven of the Home',
      scripture: {
        text: 'Peace be to your house, and peace be to all that you have.',
        ref: '1 Samuel 25:6'
      },
      essence: 'While fathers provide structural and protective security, mothers provide emotional warmth and relational safety.',
      sections: [
        {
          type: 'interactive',
          id: 'tmd_ch8_haven',
          label: 'Creating an Atmosphere of Peace',
          tag: 'Home Atmosphere',
          prompt: 'What practical steps can you take to make your home a sanctuary of peace, laughter, and rest when your family walks through the door?',
          fieldType: 'textarea',
          placeholder: 'I can cultivate peace by...'
        }
      ]
    },
    {
      id: 'tmd-ch9',
      number: 9,
      title: 'A Father Affirms Potential',
      subtitle: 'Nurturing the Seeds of Greatness',
      scripture: {
        text: 'She opens her mouth with wisdom, and the teaching of kindness is on her tongue.',
        ref: 'Proverbs 31:26'
      },
      essence: 'A mother’s intuitive insight spots hidden potential, and by cheering her husband on, she enables him to affirm their children boldly.',
      sections: [
        {
          type: 'interactive',
          id: 'tmd_ch9_cheerleading',
          label: 'Words of Encouragement',
          tag: 'Encouragement',
          prompt: 'Write down 3 specific praises you will speak over your husband’s hard work and character this week.',
          fieldType: 'textarea',
          placeholder: '1. I appreciate your...\n2. Thank you for...\n3. I admire how you...'
        }
      ]
    },
    {
      id: 'tmd-ch10a',
      number: 10,
      title: 'Restoring Damage & Overcoming Resentment',
      subtitle: 'Rooting Out Bitterness and Walking in Grace',
      scripture: {
        text: 'See to it that no one fails to obtain the grace of God; that no root of bitterness springs up and causes trouble.',
        ref: 'Hebrews 12:15'
      },
      essence: 'Resentment and silent grudges poison intimacy. Radical forgiveness and humility restore the flow of God’s grace.',
      sections: [
        {
          type: 'interactive',
          id: 'tmd_ch10_resentment_release',
          label: 'Resentment Release & Mother Teresa’s Prayer',
          tag: 'Personal Surrender',
          prompt: 'Is there any harboring resentment or silent grievance you need to release to Jesus today? Name it and surrender it in prayer.',
          fieldType: 'textarea',
          placeholder: 'Lord Jesus, I surrender my desire to hold onto...'
        }
      ]
    },
    {
      id: 'tmd-ch11',
      number: 11,
      title: 'The Brilliant Wife and Mother',
      subtitle: 'The 5 Responsibilities & The C-H-A-I-R-S Respect Rubric',
      scripture: {
        text: 'A man must love his wife as a part of himself; and the wife must see to it that she deeply respects her husband.',
        ref: 'Ephesians 5:33'
      },
      essence: 'Women need love; men desperately need respect. Mastering the 5 responsibilities and the C-H-A-I-R-S rubric transforms marital oneness.',
      sections: [
        {
          type: 'text',
          heading: 'The 5 Responsibilities of a Mother',
          body: `1. Letting the Father Shine (Validation & Respect)\n2. Fulfilling the Female Design (Life-giver, Nurturer, Relational Glue)\n3. Enhancing Closeness (Eye contact, room of the feeling, prayer)\n4. Developing Connectedness & Compassion\n5. Creating a Space of Worship & Gratitude`
        },
        {
          type: 'text',
          heading: 'How a Wife Spells Respect: C-H-A-I-R-S',
          body: `• C – Conquest: Supporting his endeavors and standing behind his work.\n• H – Hierarchy: Appreciating his drive to protect and lead.\n• A – Authority: Recognizing his spiritual responsibility without usurping.\n• I – Insight: Trusting his analytical mind and logical judgment.\n• R – Relationship: Spending unhurried shoulder-to-shoulder time.\n• S – Sexuality: Honoring the physical bond that brings emotional closeness.`
        },
        {
          type: 'interactive',
          id: 'tmd_ch11_chairs_eval',
          label: 'C-H-A-I-R-S Respect Self-Audit',
          tag: 'Interactive Rubric',
          prompt: 'Rate yourself and write an action step for the C-H-A-I-R-S area where you want to show deeper respect to your husband:',
          fieldType: 'textarea',
          placeholder: 'I will intentionally demonstrate respect in...'
        }
      ]
    },
    {
      id: 'tmd-ch12',
      number: 12,
      title: 'Fighting This Fight Together',
      subtitle: 'Standing Strong as a Generational Kingdom Team',
      scripture: {
        text: 'Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken.',
        ref: 'Ecclesiastes 4:12'
      },
      essence: 'Marriage is spiritual teamwork. When husband and wife fight together on their knees, generational victory is secured.',
      sections: [
        {
          type: 'interactive',
          id: 'tmd_ch12_covenant_prayer',
          label: 'Covenant Teamwork Commitment',
          tag: 'Fellowship Covenant',
          prompt: 'Write your couple or personal prayer commitment for the future of your family and fellowship group.',
          fieldType: 'textarea',
          placeholder: 'Lord, we commit our marriage and home to...'
        }
      ]
    }
  ]
};
