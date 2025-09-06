import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, 
  Target, 
  Gift, 
  Heart, 
  Star, 
  Clock, 
  Award,
  TrendingUp,
  Bell,
  LogOut
} from 'lucide-react';
import TalentDNA from './TalentDNA';
import { 
  mockGetProfile, 
  mockGetQuests, 
  mockGetLeaderboard 
} from '../services/api';
import { TalentDNA as TalentDNAType, Quest, LeaderboardEntry } from '../types';

const AssociateDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [talentDNA, setTalentDNA] = useState<TalentDNAType | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [profileData, questsData, leaderboardData] = await Promise.all([
          mockGetProfile(user.id),
          mockGetQuests(),
          mockGetLeaderboard('associate')
        ]);

        setTalentDNA(profileData.talentDNA);
        setQuests(questsData);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your talent journey...</p>
        </div>
      </div>
    );
  }

  const activeQuests = quests.filter(q => q.status === 'active');
  const currentUserRank = leaderboard.find(entry => entry.name === user?.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
                <p className="text-sm text-gray-600">Level {talentDNA?.level} • {currentUserRank?.points} points</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors" />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </div>
              <img 
                src={user?.avatar} 
                alt={user?.name}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              />
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Talent DNA Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-500" />
                Your Talent DNA
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center">
                  {talentDNA && <TalentDNA talentDNA={talentDNA} size="large" />}
                </div>
                <div className="space-y-4">
                  {talentDNA?.segments.map((segment) => (
                    <div key={segment.id} className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-sm font-medium ${segment.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                            {segment.name}
                          </span>
                          <span className={`text-sm ${segment.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                            {segment.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${segment.progress}%`,
                              backgroundColor: segment.unlocked ? segment.color : '#D1D5DB'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Quests */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2 text-green-500" />
                Active Quests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeQuests.map((quest) => (
                  <div key={quest.id} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{quest.title}</h3>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        +{quest.reward} XP
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{quest.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Progress</span>
                        <span className="text-sm font-medium text-gray-700">
                          {quest.progress}/{quest.totalSteps}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                          style={{ width: `${(quest.progress / quest.totalSteps) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Due {quest.deadline}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <Gift className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">Mystery Box</div>
                <div className="text-sm opacity-90">Open Daily Reward</div>
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <Heart className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">Reflect & Earn</div>
                <div className="text-sm opacity-90">Share Your Journey</div>
              </button>
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">Achievements</div>
                <div className="text-sm opacity-90">View Badges</div>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Leaderboard
              </h3>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((entry) => (
                  <div 
                    key={entry.id} 
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      entry.name === user?.name 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {entry.rank}
                    </span>
                    <img 
                      src={entry.avatar} 
                      alt={entry.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {entry.name}
                      </p>
                      <p className="text-xs text-gray-500">Level {entry.level}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {entry.points.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips & Wellness */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Today's Tip</h3>
              <p className="text-sm text-gray-700 mb-4">
                Take a 5-minute break every hour to boost your focus and productivity. Your brain will thank you!
              </p>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200">
                Start Mindfulness Break
              </button>
            </div>

            {/* Notifications */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">New quest available: "Code Review Champion"</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">You earned +200 XP for wellness activities</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">Emily Chen completed "Master Public Speaking"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociateDashboard;