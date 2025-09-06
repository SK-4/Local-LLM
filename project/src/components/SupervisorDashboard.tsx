import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  BarChart3,
  Activity,
  Download,
  LogOut,
  Filter
} from 'lucide-react';
import TalentDNA from './TalentDNA';
import { 
  mockGetProfile, 
  mockGetLeaderboard, 
  mockGetInsights, 
  mockGetReports 
} from '../services/api';
import { TalentDNA as TalentDNAType, LeaderboardEntry, Insight, Report } from '../types';

const SupervisorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [talentDNA, setTalentDNA] = useState<TalentDNAType | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [profileData, leaderboardData, insightsData, reportsData] = await Promise.all([
          mockGetProfile(user.id),
          mockGetLeaderboard('supervisor'),
          mockGetInsights(),
          mockGetReports()
        ]);

        setTalentDNA(profileData.talentDNA);
        setLeaderboard(leaderboardData);
        setInsights(insightsData);
        setReports(reportsData);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  const criticalInsights = insights.filter(insight => 
    (insight.category === 'wellness' && insight.trend === 'up' && insight.title.includes('Burnout')) ||
    (insight.category === 'skill' && insight.trend === 'down') ||
    (insight.category === 'engagement' && insight.trend === 'down')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
              <img 
                src={user?.avatar} 
                alt={user?.name}
                className="w-8 h-8 rounded-full border-2 border-gray-200"
              />
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Critical Alerts */}
        {criticalInsights.length > 0 && (
          <div className="mb-8">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
                <h3 className="text-sm font-medium text-amber-800">Attention Required</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {criticalInsights.map((insight) => (
                  <div key={insight.id} className="text-sm text-amber-700">
                    • {insight.title}: {insight.value} 
                    {insight.trend === 'up' && insight.title.includes('Burnout') && ' (↑ Risk)'}
                    {insight.trend === 'down' && ' (↓ Declining)'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.slice(0, 6).map((insight) => (
                <div key={insight.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">{insight.title}</h3>
                    <div className={`flex items-center ${
                      insight.trend === 'up' ? 'text-green-600' : 
                      insight.trend === 'down' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{insight.value}</div>
                      <div className={`text-sm ${
                        insight.trend === 'up' && insight.change > 0 ? 'text-green-600' : 
                        insight.trend === 'down' && insight.change < 0 ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {insight.change > 0 ? '+' : ''}{insight.change}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Team Performance */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Team Performance Leaderboard
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {entry.rank}
                        </span>
                        <div>
                          <h3 className="font-medium text-gray-900">{entry.name}</h3>
                          <p className="text-sm text-gray-500">Team Performance</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {entry.points.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Total Points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reports */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Available Reports
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{report.type} • {report.size}</p>
                        <p className="text-xs text-gray-400">Updated {report.lastUpdated}</p>
                      </div>
                      <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Aggregate Talent DNA */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Team Talent DNA
              </h3>
              <div className="text-center">
                {talentDNA && <TalentDNA talentDNA={talentDNA} size="medium" interactive={false} />}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-medium">{talentDNA?.completionPercentage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average Level</span>
                  <span className="font-medium">{talentDNA?.level}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  Generate Engagement Report
                </button>
                <button className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  Schedule Team Check-in
                </button>
                <button className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  Review Skill Gaps
                </button>
                <button className="w-full text-left px-4 py-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors">
                  Wellness Assessment
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Team Alpha Quest Completion</div>
                  <div className="text-gray-500">85% completion rate</div>
                  <div className="text-xs text-gray-400">2 hours ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Skill Assessment Update</div>
                  <div className="text-gray-500">New data available</div>
                  <div className="text-xs text-gray-400">5 hours ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Wellness Alert</div>
                  <div className="text-gray-500">3 team members flagged</div>
                  <div className="text-xs text-gray-400">1 day ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;