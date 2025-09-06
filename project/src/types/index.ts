export interface User {
  id: string;
  email: string;
  name: string;
  role: 'associate' | 'supervisor';
  avatar: string;
}

export interface TalentDNA {
  segments: DNASegment[];
  completionPercentage: number;
  level: number;
}

export interface DNASegment {
  id: string;
  name: string;
  category: string;
  progress: number;
  unlocked: boolean;
  color: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'skill' | 'wellness' | 'collaboration';
  progress: number;
  totalSteps: number;
  reward: number;
  deadline: string;
  status: 'active' | 'completed' | 'locked';
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  rank: number;
}

export interface Insight {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  category: 'engagement' | 'skill' | 'wellness';
}

export interface Report {
  id: string;
  name: string;
  type: 'engagement' | 'skills' | 'wellness' | 'performance';
  lastUpdated: string;
  size: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}