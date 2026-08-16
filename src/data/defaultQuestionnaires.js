export const defaultQuestionnaires = [
  {
    id: 'quest-1',
    title: 'Weekly Fellowship Task: Moral Authority & Core Boundaries',
    description: 'A pre-fellowship check-in worksheet for young married couples to review their family standards, conflict resolution, and united front.',
    category: 'Weekly Fellowship',
    dueDate: '2026-08-23',
    createdBy: 'Fellowship Admin',
    questions: [
      {
        id: 'q1_1',
        type: 'rating',
        label: 'How united do you and your spouse feel regarding decisions and boundaries in your home?',
        min: 1,
        max: 5,
        labels: ['Struggling / Divided', 'Mostly Aligned', '100% United Front']
      },
      {
        id: 'q1_2',
        type: 'textarea',
        label: 'What is one specific boundary or family rule that helped bring peace to your home this month?',
        placeholder: 'Describe your boundary or rule...'
      },
      {
        id: 'q1_3',
        type: 'textarea',
        label: 'In which area do you need more prayer or fellowship support regarding moral authority or leadership?',
        placeholder: 'We would love prayer for...'
      },
      {
        id: 'q1_4',
        type: 'prayer',
        label: 'Prayer Commitment for This Week',
        placeholder: 'Lord, give us wisdom and grace as we lead our household...'
      }
    ]
  },
  {
    id: 'quest-2',
    title: 'Couple Intimacy & Heart-to-Heart Assessment',
    description: 'Interactive questionnaire assessing eye-to-eye connection, listening skills, and shared spiritual devotions.',
    category: 'Couple Alignment',
    dueDate: '2026-08-30',
    createdBy: 'Fellowship Admin',
    questions: [
      {
        id: 'q2_1',
        type: 'rating',
        label: 'How often did you spend unhurried face-to-face time or deep conversation together this past week?',
        min: 1,
        max: 5,
        labels: ['Rarely', 'A few times', 'Every day']
      },
      {
        id: 'q2_2',
        type: 'textarea',
        label: 'What was a moment this week when you felt truly heard and validated by your spouse?',
        placeholder: 'Share a memorable moment...'
      },
      {
        id: 'q2_3',
        type: 'textarea',
        label: 'What is one practical date or connection activity you have planned for this coming weekend?',
        placeholder: 'Our plan is to...'
      }
    ]
  },
  {
    id: 'quest-3',
    title: 'Post-Fellowship Takeaway & 7-Day Action Plan',
    description: 'Quick debrief questionnaire filled out after our group fellowship session to turn learnings into immediate habits.',
    category: 'Debrief & Action',
    dueDate: 'Open',
    createdBy: 'Fellowship Admin',
    questions: [
      {
        id: 'q3_1',
        type: 'text',
        label: 'What was your biggest key insight or "aha!" moment during today’s fellowship discussion?',
        placeholder: 'My biggest takeaway was...'
      },
      {
        id: 'q3_2',
        type: 'textarea',
        label: 'What is ONE concrete action step you commit to practicing over the next 7 days?',
        placeholder: 'Starting tomorrow, I will...'
      }
    ]
  }
];
