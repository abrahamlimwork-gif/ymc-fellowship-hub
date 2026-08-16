export const masterMentorWorkbook = {
  id: 'master-mentor',
  title: 'Master Mentor Workbook',
  subtitle: 'The World Needs A Father (TWNAF) Leadership & Fatherhood Manual',
  edition: 'May 2024 Edition',
  author: 'Cassie Carstens & TWNAF Global Team',
  badge: 'Men / Husbands / Mentors',
  coverColor: '#1e3a8a',
  description: 'Comprehensive 13-chapter training manual for fathers, husbands, and mentors covering moral authority, conferring identity, providing security, affirming potential, and healing wounds.',
  chapters: [
    {
      id: 'mm-ch1',
      number: 1,
      title: 'Satan Came To Earth, Sir!',
      subtitle: 'The Mandate of Reconciliation and Turning Hearts',
      scripture: {
        text: 'He will turn the hearts of the fathers to their children, and the hearts of the children to their fathers; or else I will come and strike the land with a curse.',
        ref: 'Malachi 4:6'
      },
      essence: 'Fatherlessness has a devastating impact on our world. Trainers and leaders must have a compelling reason and a heart filled with compassion.',
      sections: [
        {
          type: 'text',
          heading: 'The Mandate of John the Baptist',
          body: `John the Baptist had three specific missions according to Luke 1:17:\n1. To turn the hearts of the fathers to their children\n2. To turn the disobedient to the wisdom of the righteous\n3. To make ready a people prepared for the Lord.\n\nWhen fathers turn their hearts to their families, societal transformation begins at home.`
        },
        {
          type: 'interactive',
          id: 'mm_ch1_calling',
          label: 'Personal Calling & Commitment',
          tag: 'Reflection',
          prompt: 'Why are you involved in this fellowship and fatherhood journey? What is your heart’s desire for your family and community?',
          fieldType: 'textarea',
          placeholder: 'Write your personal motivation and calling here...'
        },
        {
          type: 'interactive',
          id: 'mm_ch1_prayer',
          label: 'Prayer of Dedication (Numbers 6:24-26)',
          tag: 'Prayer Commitment',
          prompt: 'Write a dedicated blessing prayer over your household, naming each person before God.',
          fieldType: 'textarea',
          placeholder: 'Lord, may You bless and keep my spouse, children, and home...'
        }
      ]
    },
    {
      id: 'mm-ch2',
      number: 2,
      title: 'The Cry of the Children',
      subtitle: 'Researching the Curse of Fatherlessness',
      scripture: {
        text: 'A father to the fatherless, a defender of widows, is God in his holy dwelling.',
        ref: 'Psalm 68:5'
      },
      essence: 'Dysfunctional family life and fatherlessness correlate with virtually every major societal pathology. Understanding this fuels our urgency.',
      sections: [
        {
          type: 'text',
          heading: 'The Magnitude of the Problem',
          body: `Global research shows that:\n• 63% of suicides come from fatherless homes.\n• 70% of juveniles in state institutions come from fatherless homes.\n• 85% of children with behavioral challenges come from fatherless homes.\n• 90%+ of violent crimes and offenses against families are committed by broken men who lacked fatherly mentorship.`
        },
        {
          type: 'interactive',
          id: 'mm_ch2_community_effects',
          label: 'Group Discussion & Observations',
          tag: 'Fellowship Discussion',
          prompt: 'What are the specific effects of fatherlessness or broken family structures that you observe in your own family background or community?',
          fieldType: 'textarea',
          placeholder: 'Describe the challenges you have seen...'
        }
      ]
    },
    {
      id: 'mm-ch3',
      number: 3,
      title: 'Every Season Counts',
      subtitle: 'Navigating the 5 Developmental Stages of Family Life',
      scripture: {
        text: 'To everything there is a season, a time for every purpose under heaven.',
        ref: 'Ecclesiastes 3:1'
      },
      essence: 'Parenting and marriage require different leadership postures in different seasons.',
      sections: [
        {
          type: 'text',
          heading: 'The 5 Seasons of Growth',
          body: `• Season 1 (Ages 0–2): Discipline of Nature / Bonding & Attachment. Total tenderness, security, mother support.\n• Season 2 (Ages 3–5): Discipline of Habit / Boundaries. Consistency, obedience, routine.\n• Season 3 (Ages 6–11): Discipline of Instruction / Skills & Character. Teaching God's word, work ethic, and social wisdom.\n• Season 4 (Ages 12–18): Discipline of Rites of Passage / Mentorship. Transitioning into manhood/womanhood.\n• Season 5 (Ages 19+): Discipline of Friendship / Adult Peer Relationship.`
        },
        {
          type: 'interactive',
          id: 'mm_ch3_current_season',
          label: 'Identifying Your Current Season',
          tag: 'Assessment',
          prompt: 'What season is your marriage and family currently in? What is the primary focus you need to give to your spouse or children in this specific season?',
          fieldType: 'textarea',
          placeholder: 'Our current season is...'
        }
      ]
    },
    {
      id: 'mm-ch4',
      number: 4,
      title: 'The Father Wound Revealed & Healed',
      subtitle: 'Breaking Generational Cycles Through Vulnerability',
      scripture: {
        text: 'He heals the brokenhearted and binds up their wounds.',
        ref: 'Psalm 147:3'
      },
      essence: 'We are attracted by strength, but we bond through weakness. Healing our own father wound is prerequisite to becoming whole leaders.',
      sections: [
        {
          type: 'text',
          heading: 'The 4 Types of Father Wounds',
          body: `1. The Absent Father: Physically or emotionally absent; leaves feelings of abandonment.\n2. The Abusive / Critical Father: Verbal, emotional, or physical harshness; creates deep shame or anger.\n3. The Passive Father: Present physically but yields leadership; creates lack of direction or indecision.\n4. The Conditional / Performance Father: Love must be earned by achievements; creates burnout and perfectionism.`
        },
        {
          type: 'interactive',
          id: 'mm_ch4_wound_eval',
          label: 'Father Wound Self-Audit',
          tag: 'Personal Worksheet',
          prompt: 'Which of the 4 father styles did you experience most growing up? How did your father’s atmosphere at home affect you?',
          fieldType: 'textarea',
          placeholder: 'Growing up, the atmosphere at my home was... and I felt...'
        },
        {
          type: 'interactive',
          id: 'mm_ch4_forgiveness',
          label: 'Step of Forgiveness & Freedom',
          tag: 'Prayer & Release',
          prompt: 'Write a prayer of forgiveness releasing any resentment against your earthly father, claiming God as your perfect Heavenly Father.',
          fieldType: 'textarea',
          placeholder: 'Lord, today I choose to forgive my father for...'
        }
      ]
    },
    {
      id: 'mm-ch5',
      number: 5,
      title: 'Real Manhood, Real Fatherhood',
      subtitle: 'The Definition of Godly Masculine Leadership',
      scripture: {
        text: 'Be watchful, stand firm in the faith, act like men, be strong. Let all that you do be done in love.',
        ref: '1 Corinthians 16:13-14'
      },
      essence: 'True manhood is not defined by machismo or worldly power, but by sacrificial love, taking responsibility, and servant leadership.',
      sections: [
        {
          type: 'interactive',
          id: 'mm_ch5_manhood_traits',
          label: 'Character Traits of a Real Man',
          tag: 'Reflection',
          prompt: 'What are 3 practical ways you can demonstrate Christlike servant leadership in your home this week?',
          fieldType: 'textarea',
          placeholder: '1. ...\n2. ...\n3. ...'
        }
      ]
    },
    {
      id: 'mm-ch6',
      number: 6,
      title: 'A Father Establishes Moral Authority',
      subtitle: 'Setting Boundaries, Vision, and Disciplinary Responsibility',
      scripture: {
        text: 'As for me and my house, we will serve the Lord.',
        ref: 'Joshua 24:15'
      },
      essence: 'Moral authority is earned through integrity and consistent love. The father must take ultimate responsibility for boundaries and discipline.',
      sections: [
        {
          type: 'text',
          heading: 'The 4 Keys to Moral Authority',
          body: `1. Clarity of Purpose: A written family vision and moral compass.\n2. Living the Standard: Leading by example, not "do as I say, not as I do".\n3. Disciplinary Responsibility: Assuming the burden of gentle, consistent discipline without anger.\n4. United Front with Mom: Never contradicting each other in front of the children.`
        },
        {
          type: 'interactive',
          id: 'mm_ch6_family_rules',
          label: 'Our Family Core Moral Standards',
          tag: 'Family Manifesto',
          prompt: 'What are the top 3-5 non-negotiable moral standards and core values of your household?',
          fieldType: 'textarea',
          placeholder: '1. Honesty & Truth\n2. Respectful communication\n3. Put God first\n4. ...'
        }
      ]
    },
    {
      id: 'mm-ch7',
      number: 7,
      title: 'A Father Confers Identity',
      subtitle: 'Primary and Secondary Identity in Christ',
      scripture: {
        text: 'And a voice from heaven said, "This is my beloved Son, with whom I am well pleased."',
        ref: 'Matthew 3:17'
      },
      essence: 'Identity is conferred, not achieved. A father is the key agent who bestows belonging, worth, and purpose.',
      sections: [
        {
          type: 'text',
          heading: 'Primary vs Secondary Identity',
          body: `• Primary Identity: Beloved Child of God. Immutable, unconditional, rooted in grace.\n• Secondary Identity: Family heritage, unique spiritual gifts, God-given gender design, and vocational purpose.`
        },
        {
          type: 'interactive',
          id: 'mm_ch7_identity_words',
          label: 'Conferring Words of Identity',
          tag: 'Action Step',
          prompt: 'What specific affirming words of identity will you speak into your spouse and children this week?',
          fieldType: 'textarea',
          placeholder: 'I want my family to know they are...'
        }
      ]
    },
    {
      id: 'mm-ch8',
      number: 8,
      title: 'A Father Provides Security',
      subtitle: 'Spiritual, Emotional, Financial, and Physical Safety',
      scripture: {
        text: 'The righteous man walks in his integrity; his children are blessed after him.',
        ref: 'Proverbs 20:7'
      },
      essence: 'Security is the soil in which trust and love flourish. A home free from fear enables bold, healthy growth.',
      sections: [
        {
          type: 'interactive',
          id: 'mm_ch8_security_audit',
          label: '4 Dimensions Security Checklist',
          tag: 'Audit',
          prompt: 'Evaluate your home in these 4 areas (Spiritual, Emotional, Financial, Physical). Where do you need to strengthen safety?',
          fieldType: 'textarea',
          placeholder: 'Spiritual: ...\nEmotional: ...\nFinancial: ...\nPhysical: ...'
        }
      ]
    },
    {
      id: 'mm-ch9',
      number: 9,
      title: 'A Father Affirms Potential',
      subtitle: 'Speaking Life and Calling Forth Greatness',
      scripture: {
        text: 'Death and life are in the power of the tongue.',
        ref: 'Proverbs 18:21'
      },
      essence: 'Fathers possess unique prophetic power to unlock the destiny of their family members through unconditional affirmation.',
      sections: [
        {
          type: 'interactive',
          id: 'mm_ch9_affirmations',
          label: 'Personal Affirmation Plan',
          tag: 'Commitment',
          prompt: 'Write down 3 specific strengths or potential areas you see in your spouse or children that you will celebrate verbally this week.',
          fieldType: 'textarea',
          placeholder: 'I affirm my spouse for...\nI affirm my children for...'
        }
      ]
    },
    {
      id: 'mm-ch10',
      number: 10,
      title: 'Restoring Damage',
      subtitle: 'The Art of Sincere Apology, Reconciliation, and Restitution',
      scripture: {
        text: 'Therefore confess your sins to each other and pray for each other so that you may be healed.',
        ref: 'James 5:16'
      },
      essence: 'Great leaders are not flawless; they are quick to apologize and relentless in reconciliation.',
      sections: [
        {
          type: 'interactive',
          id: 'mm_ch10_restoration',
          label: 'Steps Toward Reconciliation',
          tag: 'Action Step',
          prompt: 'Is there an unresolved offense or hurt in your home? What humble step of apology or restitution will you take?',
          fieldType: 'textarea',
          placeholder: 'I will take responsibility and say...'
        }
      ]
    },
    {
      id: 'mm-ch11',
      number: 11,
      title: 'What About Mom?',
      subtitle: 'Empowering the Marital Team by Loving as One',
      scripture: {
        text: 'Husbands, love your wives, just as Christ loved the church and gave himself up for her.',
        ref: 'Ephesians 5:25'
      },
      essence: 'The marital relationship is the foundation of the home. Honoring and loving your wife empowers the entire family ecosystem.',
      sections: [
        {
          type: 'text',
          heading: 'Loving Your Wife: The C-O-U-P-L-E Principle',
          body: `• C – Closeness: Face-to-face attention, unhurried time.\n• O – Openness: Emotional transparency and vulnerability.\n• U – Understanding: Listening without immediate judging or fixing.\n• P – Peacemaking: Prompt apologies and gentle resolution.\n• L – Loyalty: Putting her above career, friends, and family of origin.\n• E – Esteem: Honoring her in public and private.`
        },
        {
          type: 'interactive',
          id: 'mm_ch11_couple_action',
          label: 'Husband’s Love Action Step',
          tag: 'Marriage Commitment',
          prompt: 'Which letter of C-O-U-P-L-E do you most need to practice toward your wife this month? What will you do specifically?',
          fieldType: 'textarea',
          placeholder: 'I will focus on...'
        }
      ]
    },
    {
      id: 'mm-ch12',
      number: 12,
      title: 'The Single Mother & The Mentor Family',
      subtitle: 'Bridging the Gap for Fatherless Children',
      scripture: {
        text: 'Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress.',
        ref: 'James 1:27'
      },
      essence: 'The church and mentor couples must step in as spiritual surrogate fathers and aunties to support single mothers with dignity and respect.',
      sections: [
        {
          type: 'interactive',
          id: 'mm_ch12_mentorship',
          label: 'Outreach & Mentorship Commitment',
          tag: 'Fellowship Outreach',
          prompt: 'How can our fellowship group actively support, mentor, and bless single mothers or fatherless youth in our sphere of influence?',
          fieldType: 'textarea',
          placeholder: 'We can support by...'
        }
      ]
    },
    {
      id: 'mm-ch13',
      number: 13,
      title: 'The World Needs A Father Movement',
      subtitle: 'Multiplying Generations of Restored Families',
      scripture: {
        text: 'And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others.',
        ref: '2 Timothy 2:2'
      },
      essence: 'Transformation multiplies when trained mentors invest into new couples and fathers.',
      sections: [
        {
          type: 'interactive',
          id: 'mm_ch13_multiplication',
          label: 'Personal Multiplication Commitment',
          tag: 'Mission Plan',
          prompt: 'Who are 2-3 young men or couples you can invite, mentor, or share these life-giving principles with?',
          fieldType: 'textarea',
          placeholder: 'Names of people I will mentor...'
        }
      ]
    }
  ]
};
