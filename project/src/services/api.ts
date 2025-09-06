import { User, TalentDNA, Quest, LeaderboardEntry, Insight, Report } from '../types';

// Mock delay to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users
const mockUsers: Record<string, User> = {
  'associate@test.com': {
    id: '1',
    email: 'associate@test.com',
    name: 'Alex Thompson',
    role: 'associate',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  'supervisor@test.com': {
    id: '2',
    email: 'supervisor@test.com',
    name: 'Sarah Mitchell',
    role: 'supervisor',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
};

// 1. Auth API
export const mockLogin = async (email: string, password: string): Promise<User | null> => {
  await delay(800);
  if (password === 'pass123' && mockUsers[email]) {
    return mockUsers[email];
  }
  return null;
};

// 2. Profile & DNA API
export const mockGetProfile = async (userId: string): Promise<{ user: User; talentDNA: TalentDNA }> => {
  await delay(600);
  const user = Object.values(mockUsers).find(u => u.id === userId);
  if (!user) throw new Error('User not found');

  const talentDNA: TalentDNA = {
    segments: [
      { id: '1', name: 'Leadership', category: 'Soft Skills', progress: 85, unlocked: true, color: '#3B82F6' },
      { id: '2', name: 'Problem Solving', category: 'Cognitive', progress: 92, unlocked: true, color: '#8B5CF6' },
      { id: '3', name: 'Communication', category: 'Interpersonal', progress: 78, unlocked: true, color: '#06B6D4' },
      { id: '4', name: 'Technical Skills', category: 'Hard Skills', progress: 65, unlocked: true, color: '#10B981' },
      { id: '5', name: 'Creativity', category: 'Innovation', progress: 45, unlocked: user.role === 'associate', color: '#F59E0B' },
      { id: '6', name: 'Strategic Thinking', category: 'Executive', progress: 30, unlocked: false, color: '#EF4444' }
    ],
    completionPercentage: 66,
    level: 7
  };

  return { user, talentDNA };
};

// 3. Quests API
export const mockGetQuests = async (): Promise<Quest[]> => {
  await delay(500);
  return [
    {
      id: '1',
      title: 'Master Public Speaking',
      description: 'Complete 3 presentation challenges and receive peer feedback',
      type: 'skill',
      progress: 2,
      totalSteps: 3,
      reward: 500,
      deadline: '2025-02-15',
      status: 'active'
    },
    {
      id: '2',
      title: 'Wellness Warrior',
      description: 'Log 7 wellness activities this week',
      type: 'wellness',
      progress: 5,
      totalSteps: 7,
      reward: 200,
      deadline: '2025-01-31',
      status: 'active'
    },
    {
      id: '3',
      title: 'Team Collaboration',
      description: 'Participate in cross-functional project',
      type: 'collaboration',
      progress: 1,
      totalSteps: 5,
      reward: 800,
      deadline: '2025-03-01',
      status: 'active'
    },
    {
      id: '4',
      title: 'Code Review Champion',
      description: 'Provide meaningful code reviews',
      type: 'skill',
      progress: 0,
      totalSteps: 10,
      reward: 300,
      deadline: '2025-02-28',
      status: 'locked'
    }
  ];
};

// 4. Leaderboard API
export const mockGetLeaderboard = async (role: 'associate' | 'supervisor'): Promise<LeaderboardEntry[]> => {
  await delay(400);
  
  const associateBoard: LeaderboardEntry[] = [
    { id: '1', name: 'Alex Thompson', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop', points: 2850, level: 7, rank: 1 },
    { id: '2', name: 'Emily Chen', avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop', points: 2420, level: 6, rank: 2 },
    { id: '3', name: 'Marcus Johnson', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop', points: 2180, level: 6, rank: 3 },
    { id: '4', name: 'Sofia Rodriguez', avatar: 'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop', points: 1950, level: 5, rank: 4 },
    { id: '5', name: 'David Kim', avatar: 'https://images.pexels.com/photos/2696271/pexels-photo-2696271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop', points: 1720, level: 5, rank: 5 }
  ];

  const supervisorBoard: LeaderboardEntry[] = [
    { id: '1', name: 'Team Alpha', avatar: '', points: 12850, level: 0, rank: 1 },
    { id: '2', name: 'Team Beta', avatar: '', points: 11420, level: 0, rank: 2 },
    { id: '3', name: 'Team Gamma', avatar: '', points: 10180, level: 0, rank: 3 },
    { id: '4', name: 'Team Delta', avatar: '', points: 9950, level: 0, rank: 4 },
    { id: '5', name: 'Team Epsilon', avatar: '', points: 8720, level: 0, rank: 5 }
  ];

  return role === 'associate' ? associateBoard : supervisorBoard;
};

// 5. Insights API (Supervisor)
export const mockGetInsights = async (): Promise<Insight[]> => {
  await delay(700);
  return [
    { id: '1', title: 'Active Participants', value: '87%', change: 5.2, trend: 'up', category: 'engagement' },
    { id: '2', title: 'Skill Development', value: '64%', change: -2.1, trend: 'down', category: 'skill' },
    { id: '3', title: 'Wellness Score', value: '8.4/10', change: 0.8, trend: 'up', category: 'wellness' },
    { id: '4', title: 'Quest Completion', value: '73%', change: 3.5, trend: 'up', category: 'engagement' },
    { id: '5', title: 'Critical Skills Gap', value: '23%', change: -1.2, trend: 'down', category: 'skill' },
    { id: '6', title: 'Burnout Risk', value: '15%', change: 2.3, trend: 'up', category: 'wellness' }
  ];
};

// 6. Reports API
export const mockGetReports = async (): Promise<Report[]> => {
  await delay(500);
  return [
    { id: '1', name: 'Quarterly Engagement Report', type: 'engagement', lastUpdated: '2025-01-20', size: '2.4 MB' },
    { id: '2', name: 'Skills Assessment Summary', type: 'skills', lastUpdated: '2025-01-18', size: '1.8 MB' },
    { id: '3', name: 'Wellness Analytics', type: 'wellness', lastUpdated: '2025-01-22', size: '956 KB' },
    { id: '4', name: 'Performance Insights', type: 'performance', lastUpdated: '2025-01-19', size: '3.1 MB' },
    { id: '5', name: 'Team Development Metrics', type: 'engagement', lastUpdated: '2025-01-21', size: '2.7 MB' }
  ];
};