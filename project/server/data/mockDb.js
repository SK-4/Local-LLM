const bcrypt = require('bcryptjs');

// Hash passwords for demo accounts
const hashPassword = (password) => bcrypt.hashSync(password, 10);

const mockDb = {
  users: [
    {
      id: 'u1',
      username: 'associate_demo',
      name: 'Aman Kumar',
      role: 'associate',
      teamId: 't1',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      passwordHash: hashPassword('associate123'),
      xp: 2850,
      privacyPreferences: { shareProfile: true }
    },
    {
      id: 'u2',
      username: 'supervisor_demo',
      name: 'Maya Patel',
      role: 'supervisor',
      teamId: 't1',
      avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      passwordHash: hashPassword('supervisor123'),
      xp: 5200,
      privacyPreferences: { shareProfile: true }
    },
    {
      id: 'u3',
      username: 'admin_demo',
      name: 'Admin User',
      role: 'admin',
      teamId: 't1',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      passwordHash: hashPassword('admin123'),
      xp: 10000,
      privacyPreferences: { shareProfile: true }
    },
    {
      id: 'u4',
      username: 'emily_chen',
      name: 'Emily Chen',
      role: 'associate',
      teamId: 't1',
      avatar: 'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      passwordHash: hashPassword('demo123'),
      xp: 2420,
      privacyPreferences: { shareProfile: true }
    },
    {
      id: 'u5',
      username: 'marcus_johnson',
      name: 'Marcus Johnson',
      role: 'associate',
      teamId: 't1',
      avatar: 'https://images.pexels.com/photos/2696271/pexels-photo-2696271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      passwordHash: hashPassword('demo123'),
      xp: 2180,
      privacyPreferences: { shareProfile: false }
    }
  ],

  skillCategories: [
    { id: 'sc1', name: 'Leadership', color: '#3B82F6' },
    { id: 'sc2', name: 'Communication', color: '#06B6D4' },
    { id: 'sc3', name: 'Technical Skills', color: '#10B981' },
    { id: 'sc4', name: 'Problem Solving', color: '#8B5CF6' },
    { id: 'sc5', name: 'Creativity', color: '#F59E0B' },
    { id: 'sc6', name: 'Strategic Thinking', color: '#EF4444' }
  ],

  talentDNA: [
    {
      userId: 'u1',
      segments: [
        { id: 's1', name: 'Leadership', category: 'Leadership', progress: 85, unlocked: true, color: '#3B82F6' },
        { id: 's2', name: 'Problem Solving', category: 'Problem Solving', progress: 92, unlocked: true, color: '#8B5CF6' },
        { id: 's3', name: 'Communication', category: 'Communication', progress: 78, unlocked: true, color: '#06B6D4' },
        { id: 's4', name: 'Technical Skills', category: 'Technical Skills', progress: 65, unlocked: true, color: '#10B981' },
        { id: 's5', name: 'Creativity', category: 'Creativity', progress: 45, unlocked: true, color: '#F59E0B' },
        { id: 's6', name: 'Strategic Thinking', category: 'Strategic Thinking', progress: 30, unlocked: false, color: '#EF4444' }
      ],
      completionPercentage: 66,
      level: 7
    },
    {
      userId: 'u2',
      segments: [
        { id: 's1', name: 'Leadership', category: 'Leadership', progress: 95, unlocked: true, color: '#3B82F6' },
        { id: 's2', name: 'Problem Solving', category: 'Problem Solving', progress: 88, unlocked: true, color: '#8B5CF6' },
        { id: 's3', name: 'Communication', category: 'Communication', progress: 90, unlocked: true, color: '#06B6D4' },
        { id: 's4', name: 'Technical Skills', category: 'Technical Skills', progress: 75, unlocked: true, color: '#10B981' },
        { id: 's5', name: 'Creativity', category: 'Creativity', progress: 70, unlocked: true, color: '#F59E0B' },
        { id: 's6', name: 'Strategic Thinking', category: 'Strategic Thinking', progress: 85, unlocked: true, color: '#EF4444' }
      ],
      completionPercentage: 84,
      level: 12
    }
  ],

  quests: [
    {
      id: 'q1',
      title: 'Master Public Speaking',
      description: 'Complete 3 presentation challenges and receive peer feedback',
      type: 'skill',
      progress: 2,
      totalSteps: 3,
      reward: 500,
      deadline: '2025-02-15',
      status: 'active',
      steps: [
        { id: 'step1', title: 'Watch presentation fundamentals', type: 'video', completed: true },
        { id: 'step2', title: 'Practice 5-minute presentation', type: 'practice', completed: true },
        { id: 'step3', title: 'Present to team and get feedback', type: 'presentation', completed: false }
      ],
      enrolledUsers: ['u1']
    },
    {
      id: 'q2',
      title: 'Wellness Warrior',
      description: 'Log 7 wellness activities this week',
      type: 'wellness',
      progress: 5,
      totalSteps: 7,
      reward: 200,
      deadline: '2025-01-31',
      status: 'active',
      steps: [
        { id: 'step1', title: 'Morning meditation', type: 'wellness', completed: true },
        { id: 'step2', title: 'Lunch break walk', type: 'wellness', completed: true },
        { id: 'step3', title: 'Hydration check', type: 'wellness', completed: true },
        { id: 'step4', title: 'Stretching session', type: 'wellness', completed: true },
        { id: 'step5', title: 'Gratitude journal', type: 'wellness', completed: true },
        { id: 'step6', title: 'Team social activity', type: 'wellness', completed: false },
        { id: 'step7', title: 'Weekend self-care', type: 'wellness', completed: false }
      ],
      enrolledUsers: ['u1', 'u4']
    },
    {
      id: 'q3',
      title: 'Team Collaboration',
      description: 'Participate in cross-functional project',
      type: 'collaboration',
      progress: 1,
      totalSteps: 5,
      reward: 800,
      deadline: '2025-03-01',
      status: 'active',
      steps: [
        { id: 'step1', title: 'Join project team', type: 'collaboration', completed: true },
        { id: 'step2', title: 'Attend kickoff meeting', type: 'collaboration', completed: false },
        { id: 'step3', title: 'Complete assigned tasks', type: 'collaboration', completed: false },
        { id: 'step4', title: 'Provide peer feedback', type: 'collaboration', completed: false },
        { id: 'step5', title: 'Present final results', type: 'collaboration', completed: false }
      ],
      enrolledUsers: ['u1']
    },
    {
      id: 'q4',
      title: 'Code Review Champion',
      description: 'Provide meaningful code reviews',
      type: 'skill',
      progress: 0,
      totalSteps: 10,
      reward: 300,
      deadline: '2025-02-28',
      status: 'locked',
      steps: [],
      enrolledUsers: []
    }
  ],

  mysteryBoxes: [
    {
      id: 'mb1',
      name: 'Daily Surprise',
      description: 'Open once per day for random rewards',
      unlockCriteria: 'daily_login',
      available: true,
      cooldown: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    },
    {
      id: 'mb2',
      name: 'Achievement Box',
      description: 'Unlocked after completing any quest',
      unlockCriteria: 'quest_completion',
      available: false,
      cooldown: 0
    }
  ],

  badges: [
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Complete morning activities consistently',
      icon: '🌅',
      rarity: 'common'
    },
    {
      id: 'team_player',
      name: 'Team Player',
      description: 'Collaborate effectively with team members',
      icon: '🤝',
      rarity: 'common'
    },
    {
      id: 'explorer',
      name: 'Explorer',
      description: 'Try new learning activities',
      icon: '🗺️',
      rarity: 'uncommon'
    },
    {
      id: 'mentor',
      name: 'Mentor',
      description: 'Help other team members grow',
      icon: '🎓',
      rarity: 'rare'
    },
    {
      id: 'innovator',
      name: 'Innovator',
      description: 'Contribute creative solutions',
      icon: '💡',
      rarity: 'epic'
    }
  ],

  userBadges: [
    { id: 'ub1', userId: 'u1', badgeId: 'early_bird', awardedAt: '2025-01-15T08:00:00Z' },
    { id: 'ub2', userId: 'u1', badgeId: 'team_player', awardedAt: '2025-01-18T14:30:00Z' },
    { id: 'ub3', userId: 'u2', badgeId: 'mentor', awardedAt: '2025-01-20T10:15:00Z' },
    { id: 'ub4', userId: 'u4', badgeId: 'explorer', awardedAt: '2025-01-22T16:45:00Z' }
  ],

  notifications: [
    {
      id: 'notif1',
      userId: 'u1',
      type: 'quest_progress',
      title: 'Quest Progress',
      message: 'You\'re making great progress on "Master Public Speaking"!',
      read: false,
      timestamp: '2025-01-23T09:30:00Z'
    },
    {
      id: 'notif2',
      userId: 'u1',
      type: 'badge_earned',
      title: 'New Badge Earned!',
      message: 'Congratulations! You earned the "Team Player" badge.',
      read: false,
      timestamp: '2025-01-22T15:20:00Z'
    },
    {
      id: 'notif3',
      userId: 'u1',
      type: 'leaderboard',
      title: 'Leaderboard Update',
      message: 'You\'ve moved up to #1 on the team leaderboard!',
      read: true,
      timestamp: '2025-01-21T12:00:00Z'
    }
  ],

  pulseEntries: [
    {
      id: 'pulse1',
      userId: 'u1',
      answers: [
        { questionId: 'q1', answer: '8' },
        { questionId: 'q2', answer: 'Managing multiple priorities was challenging' }
      ],
      moodScore: 75,
      tags: ['productive', 'focused'],
      timestamp: '2025-01-23T17:00:00Z'
    }
  ],

  journals: [
    {
      id: 'journal1',
      userId: 'u1',
      title: 'Reflection on Leadership Growth',
      text: 'Today I realized that effective leadership is more about listening than speaking. During our team meeting, I focused on understanding everyone\'s perspectives before sharing my own thoughts.',
      mood: 'positive',
      timestamp: '2025-01-23T19:30:00Z'
    },
    {
      id: 'journal2',
      userId: 'u1',
      title: 'Learning from Challenges',
      text: 'The presentation didn\'t go as planned, but I learned valuable lessons about preparation and handling unexpected questions. Next time I\'ll practice more scenarios.',
      mood: 'reflective',
      timestamp: '2025-01-22T20:15:00Z'
    }
  ],

  interventions: [
    {
      id: 'intervention1',
      userId: 'u5',
      supervisorId: 'u2',
      type: 'check_in',
      notes: 'Scheduled 1:1 to discuss workload and provide support',
      timestamp: '2025-01-23T14:00:00Z'
    }
  ],

  reports: [
    {
      id: 'report1',
      name: 'Quarterly Engagement Report',
      type: 'engagement',
      format: 'pdf',
      lastUpdated: '2025-01-20T10:00:00Z',
      size: '2.4 MB',
      downloadLink: '/api/reports/download/report1'
    },
    {
      id: 'report2',
      name: 'Skills Assessment Summary',
      type: 'skills',
      format: 'csv',
      lastUpdated: '2025-01-18T15:30:00Z',
      size: '1.8 MB',
      downloadLink: '/api/reports/download/report2'
    },
    {
      id: 'report3',
      name: 'Wellness Analytics',
      type: 'wellness',
      format: 'pdf',
      lastUpdated: '2025-01-22T09:45:00Z',
      size: '956 KB',
      downloadLink: '/api/reports/download/report3'
    },
    {
      id: 'report4',
      name: 'Performance Insights',
      type: 'performance',
      format: 'pdf',
      lastUpdated: '2025-01-19T16:20:00Z',
      size: '3.1 MB',
      downloadLink: '/api/reports/download/report4'
    },
    {
      id: 'report5',
      name: 'Team Development Metrics',
      type: 'engagement',
      format: 'csv',
      lastUpdated: '2025-01-21T11:10:00Z',
      size: '2.7 MB',
      downloadLink: '/api/reports/download/report5'
    }
  ]
};

module.exports = mockDb;