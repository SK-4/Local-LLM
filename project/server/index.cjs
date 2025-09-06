const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'talent-helix-secret-key';

// Mock Database (in production, use MongoDB/PostgreSQL)
const db = require('./data/mockDb');

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: { code: 'NO_TOKEN', message: 'Access token required' } });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } });
    }
    req.user = user;
    next();
  });
};

// Role Guard Middleware
const roleGuard = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: { code: 'INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' } });
    }
    next();
  };
};

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  // Send periodic notifications (demo)
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'notification',
        data: {
          id: Date.now(),
          title: 'New Achievement Unlocked!',
          message: 'You\'ve made progress on your Communication skill',
          timestamp: new Date().toISOString()
        }
      }));
    }
  }, 30000);

  ws.on('close', () => {
    clearInterval(interval);
  });
});

// Broadcast to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = db.users.find(u => u.username === username);
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    return res.status(401).json({ 
      success: false, 
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' } 
    });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, teamId: user.teamId },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        teamId: user.teamId,
        avatar: user.avatar
      }
    }
  });
});

app.post('/api/auth/refresh', authenticateToken, (req, res) => {
  const token = jwt.sign(
    { id: req.user.id, username: req.user.username, role: req.user.role, teamId: req.user.teamId },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    data: { token }
  });
});

app.get('/api/users/me', authenticateToken, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      teamId: user.teamId,
      privacyPreferences: user.privacyPreferences || { shareProfile: true }
    }
  });
});

app.get('/api/users/:id', authenticateToken, roleGuard(['supervisor', 'admin']), (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
  }

  // Privacy-aware response
  if (!user.privacyPreferences?.shareProfile && req.user.role !== 'admin') {
    return res.json({
      success: true,
      data: { sensitive: true, message: 'User has restricted profile sharing' }
    });
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      teamId: user.teamId
    }
  });
});

// Talent DNA Routes
app.get('/api/talent-dna/associate', authenticateToken, roleGuard(['associate']), (req, res) => {
  const userDNA = db.talentDNA.find(dna => dna.userId === req.user.id);
  
  res.json({
    success: true,
    data: {
      segments: userDNA?.segments || [],
      helixMeta: {
        levels: 5,
        colorMap: 'progress',
        completionPercentage: userDNA?.completionPercentage || 0,
        level: userDNA?.level || 1
      }
    }
  });
});

app.get('/api/talent-dna/team', authenticateToken, roleGuard(['supervisor', 'admin']), (req, res) => {
  const teamMembers = db.users.filter(u => u.teamId === req.user.teamId);
  const teamDNA = teamMembers.map(member => 
    db.talentDNA.find(dna => dna.userId === member.id)
  ).filter(Boolean);

  // Aggregate segments
  const aggregatedSegments = db.skillCategories.map(category => {
    const categorySegments = teamDNA.flatMap(dna => 
      dna.segments.filter(seg => seg.category === category.name)
    );
    
    return {
      id: category.id,
      label: category.name,
      completionRate: categorySegments.length > 0 
        ? Math.round(categorySegments.reduce((sum, seg) => sum + seg.progress, 0) / categorySegments.length)
        : 0,
      avgScore: categorySegments.length > 0
        ? Math.round(categorySegments.reduce((sum, seg) => sum + seg.progress, 0) / categorySegments.length)
        : 0
    };
  });

  res.json({
    success: true,
    data: {
      segments: aggregatedSegments,
      heatmap: {
        totalMembers: teamMembers.length,
        avgCompletion: Math.round(teamDNA.reduce((sum, dna) => sum + dna.completionPercentage, 0) / teamDNA.length)
      }
    }
  });
});

app.post('/api/talent-dna/segment/:segmentId/claim', authenticateToken, roleGuard(['associate']), (req, res) => {
  const userDNA = db.talentDNA.find(dna => dna.userId === req.user.id);
  const segment = userDNA?.segments.find(seg => seg.id === req.params.segmentId);
  
  if (!segment) {
    return res.status(404).json({ success: false, error: { code: 'SEGMENT_NOT_FOUND', message: 'Segment not found' } });
  }

  // Simulate milestone claim
  segment.progress = Math.min(100, segment.progress + 10);
  if (segment.progress >= 50 && !segment.unlocked) {
    segment.unlocked = true;
    
    // Broadcast achievement
    broadcast({
      type: 'achievement',
      data: {
        userId: req.user.id,
        segmentId: segment.id,
        message: `${req.user.username} unlocked ${segment.name}!`
      }
    });
  }

  res.json({
    success: true,
    data: segment
  });
});

// Quests Routes
app.get('/api/quests', authenticateToken, (req, res) => {
  const { status } = req.query;
  let quests = db.quests;
  
  if (status) {
    quests = quests.filter(q => q.status === status);
  }

  res.json({
    success: true,
    data: quests,
    meta: { total: quests.length }
  });
});

app.get('/api/quests/:id', authenticateToken, (req, res) => {
  const quest = db.quests.find(q => q.id === req.params.id);
  if (!quest) {
    return res.status(404).json({ success: false, error: { code: 'QUEST_NOT_FOUND', message: 'Quest not found' } });
  }

  res.json({
    success: true,
    data: quest
  });
});

app.post('/api/quests/:id/enroll', authenticateToken, roleGuard(['associate']), (req, res) => {
  const quest = db.quests.find(q => q.id === req.params.id);
  if (!quest) {
    return res.status(404).json({ success: false, error: { code: 'QUEST_NOT_FOUND', message: 'Quest not found' } });
  }

  // Add user to quest enrollment
  if (!quest.enrolledUsers) quest.enrolledUsers = [];
  if (!quest.enrolledUsers.includes(req.user.id)) {
    quest.enrolledUsers.push(req.user.id);
    quest.status = 'active';
  }

  res.json({
    success: true,
    data: { message: 'Successfully enrolled in quest', questId: quest.id }
  });
});

app.post('/api/quests/:id/progress', authenticateToken, roleGuard(['associate']), (req, res) => {
  const { stepId, progressDelta } = req.body;
  const quest = db.quests.find(q => q.id === req.params.id);
  
  if (!quest) {
    return res.status(404).json({ success: false, error: { code: 'QUEST_NOT_FOUND', message: 'Quest not found' } });
  }

  // Update progress
  quest.progress = Math.min(quest.totalSteps, quest.progress + (progressDelta || 1));

  res.json({
    success: true,
    data: {
      questId: quest.id,
      currentProgress: quest.progress,
      totalSteps: quest.totalSteps
    }
  });
});

app.post('/api/quests/:id/complete', authenticateToken, roleGuard(['associate']), (req, res) => {
  const quest = db.quests.find(q => q.id === req.params.id);
  
  if (!quest) {
    return res.status(404).json({ success: false, error: { code: 'QUEST_NOT_FOUND', message: 'Quest not found' } });
  }

  quest.status = 'completed';
  quest.progress = quest.totalSteps;

  // Award rewards
  const user = db.users.find(u => u.id === req.user.id);
  if (user) {
    user.xp = (user.xp || 0) + quest.reward;
  }

  // Broadcast completion
  broadcast({
    type: 'quest_complete',
    data: {
      userId: req.user.id,
      questId: quest.id,
      reward: quest.reward
    }
  });

  res.json({
    success: true,
    data: {
      questId: quest.id,
      reward: quest.reward,
      totalXP: user.xp
    }
  });
});

app.post('/api/quests/:id/invite', authenticateToken, roleGuard(['associate']), (req, res) => {
  const { userIds } = req.body;
  const quest = db.quests.find(q => q.id === req.params.id);
  
  if (!quest) {
    return res.status(404).json({ success: false, error: { code: 'QUEST_NOT_FOUND', message: 'Quest not found' } });
  }

  // Create notifications for invited users
  userIds.forEach(userId => {
    db.notifications.push({
      id: `notif_${Date.now()}_${userId}`,
      userId,
      type: 'quest_invite',
      title: 'Quest Invitation',
      message: `${req.user.username} invited you to join "${quest.title}"`,
      questId: quest.id,
      read: false,
      timestamp: new Date().toISOString()
    });
  });

  res.json({
    success: true,
    data: { message: `Invited ${userIds.length} users to quest`, questId: quest.id }
  });
});

// Mystery Boxes Routes
app.get('/api/mystery-boxes', authenticateToken, roleGuard(['associate']), (req, res) => {
  res.json({
    success: true,
    data: db.mysteryBoxes
  });
});

app.post('/api/mystery-boxes/:id/open', authenticateToken, roleGuard(['associate']), (req, res) => {
  const box = db.mysteryBoxes.find(b => b.id === req.params.id);
  
  if (!box) {
    return res.status(404).json({ success: false, error: { code: 'BOX_NOT_FOUND', message: 'Mystery box not found' } });
  }

  // Random reward logic
  const rewards = [
    { type: 'badge', id: 'early_bird', name: 'Early Bird' },
    { type: 'xp', amount: 100 },
    { type: 'badge', id: 'explorer', name: 'Explorer' }
  ];
  
  const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

  res.json({
    success: true,
    data: {
      success: true,
      rewards: [randomReward]
    }
  });
});

// Pulse & Journals Routes
app.get('/api/pulse/latest', authenticateToken, roleGuard(['associate']), (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'pulse_' + Date.now(),
      prompt: 'How are you feeling about your work-life balance this week?',
      questions: [
        { id: 'q1', text: 'Rate your energy level (1-10)', type: 'scale' },
        { id: 'q2', text: 'What challenged you most this week?', type: 'text' }
      ]
    }
  });
});

app.post('/api/pulse/submit', authenticateToken, roleGuard(['associate']), (req, res) => {
  const { answers, moodScore, tags } = req.body;
  
  db.pulseEntries.push({
    id: 'pulse_entry_' + Date.now(),
    userId: req.user.id,
    answers,
    moodScore,
    tags,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    data: { message: 'Pulse entry submitted successfully' }
  });
});

app.get('/api/journals', authenticateToken, roleGuard(['associate']), (req, res) => {
  const userJournals = db.journals.filter(j => j.userId === req.user.id);
  
  res.json({
    success: true,
    data: userJournals,
    meta: { total: userJournals.length }
  });
});

app.post('/api/journals', authenticateToken, roleGuard(['associate']), (req, res) => {
  const { title, text, mood } = req.body;
  
  const journal = {
    id: 'journal_' + Date.now(),
    userId: req.user.id,
    title,
    text,
    mood,
    timestamp: new Date().toISOString()
  };
  
  db.journals.push(journal);

  res.json({
    success: true,
    data: journal
  });
});

// Badges Routes
app.get('/api/badges', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: db.badges
  });
});

app.get('/api/users/:id/badges', authenticateToken, (req, res) => {
  const userBadges = db.userBadges.filter(ub => ub.userId === req.params.id);
  const badges = userBadges.map(ub => db.badges.find(b => b.id === ub.badgeId)).filter(Boolean);
  
  res.json({
    success: true,
    data: badges
  });
});

app.post('/api/badges/award', authenticateToken, roleGuard(['admin']), (req, res) => {
  const { userId, badgeId } = req.body;
  
  db.userBadges.push({
    id: 'user_badge_' + Date.now(),
    userId,
    badgeId,
    awardedAt: new Date().toISOString()
  });

  res.json({
    success: true,
    data: { message: 'Badge awarded successfully' }
  });
});

// Leaderboard Routes
app.get('/api/leaderboard', authenticateToken, (req, res) => {
  const { scope = 'team', limit = 10 } = req.query;
  
  let users = db.users;
  if (scope === 'team') {
    users = users.filter(u => u.teamId === req.user.teamId);
  }
  
  // Sort by XP and add rank
  const leaderboard = users
    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
    .slice(0, parseInt(limit))
    .map((user, index) => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      points: user.xp || 0,
      level: Math.floor((user.xp || 0) / 1000) + 1,
      rank: index + 1
    }));

  res.json({
    success: true,
    data: leaderboard
  });
});

app.get('/api/leaderboard/history', authenticateToken, (req, res) => {
  // Mock historical data
  const history = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    topUsers: [
      { userId: 'u1', points: Math.floor(Math.random() * 1000) + 2000 },
      { userId: 'u2', points: Math.floor(Math.random() * 1000) + 1500 }
    ]
  }));

  res.json({
    success: true,
    data: history
  });
});

app.post('/api/social/share', authenticateToken, (req, res) => {
  const shareId = 'share_' + Date.now();
  const shareUrl = `${req.protocol}://${req.get('host')}/share/${shareId}`;
  
  res.json({
    success: true,
    data: { shareUrl, shareId }
  });
});

// Notifications Routes
app.get('/api/notifications', authenticateToken, (req, res) => {
  const userNotifications = db.notifications.filter(n => n.userId === req.user.id);
  
  res.json({
    success: true,
    data: userNotifications,
    meta: { 
      total: userNotifications.length,
      unread: userNotifications.filter(n => !n.read).length
    }
  });
});

app.post('/api/notifications/mark-read', authenticateToken, (req, res) => {
  const { notificationIds } = req.body;
  
  db.notifications.forEach(notification => {
    if (notificationIds.includes(notification.id) && notification.userId === req.user.id) {
      notification.read = true;
    }
  });

  res.json({
    success: true,
    data: { message: 'Notifications marked as read' }
  });
});

// Supervisor Analytics Routes
app.get('/api/supervisor/engagement', authenticateToken, roleGuard(['supervisor', 'admin']), (req, res) => {
  const { range = '30d' } = req.query;
  
  // Mock engagement data
  const days = range === '30d' ? 30 : range === '90d' ? 90 : 365;
  const trend = Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    engagementScore: Math.floor(Math.random() * 30) + 70,
    wellbeingScore: Math.floor(Math.random() * 20) + 75
  }));

  res.json({
    success: true,
    data: {
      trend: trend.reverse(),
      avgEngagement: 82,
      avgWellbeing: 78
    }
  });
});

app.get('/api/supervisor/skill-gaps', authenticateToken, roleGuard(['supervisor', 'admin']), (req, res) => {
  const skillGaps = [
    { skill: 'Data Analysis', requiredLevel: 8, currentAvg: 6.2, gap: 1.8 },
    { skill: 'Leadership', requiredLevel: 7, currentAvg: 5.8, gap: 1.2 },
    { skill: 'Communication', requiredLevel: 9, currentAvg: 7.5, gap: 1.5 }
  ];

  res.json({
    success: true,
    data: skillGaps
  });
});

app.get('/api/supervisor/training-uptake', authenticateToken, roleGuard(['supervisor', 'admin']), (req, res) => {
  res.json({
    success: true,
    data: {
      totalCourses: 25,
      completedCourses: 18,
      uptakeRate: 72,
      trending: [
        { course: 'Leadership Fundamentals', completions: 12, trend: 'up' },
        { course: 'Data Literacy', completions: 8, trend: 'stable' }
      ]
    }
  });
});

app.get('/api/supervisor/alerts', authenticateToken, roleGuard(['supervisor', 'admin']), (req, res) => {
  const alerts = [
    {
      id: 'alert_1',
      userId: 'u3',
      userName: 'John Doe',
      type: 'burnout_risk',
      reason: 'Low mood scores and declining engagement',
      confidence: 0.85,
      timestamp: new Date().toISOString()
    },
    {
      id: 'alert_2',
      userId: 'u4',
      userName: 'Jane Smith',
      type: 'low_engagement',
      reason: 'No quest activity in 2 weeks',
      confidence: 0.72,
      timestamp: new Date().toISOString()
    }
  ];

  res.json({
    success: true,
    data: alerts
  });
});

app.post('/api/supervisor/intervention', authenticateToken, roleGuard(['supervisor', 'admin']), (req, res) => {
  const { userId, interventionType, notes } = req.body;
  
  // Log intervention
  db.interventions.push({
    id: 'intervention_' + Date.now(),
    userId,
    supervisorId: req.user.id,
    type: interventionType,
    notes,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    data: { message: 'Intervention logged successfully' }
  });
});

// Reports Routes
app.get('/api/reports', authenticateToken, roleGuard(['supervisor', 'admin']), (req, res) => {
  const { type, format } = req.query;
  
  let reports = db.reports;
  if (type) {
    reports = reports.filter(r => r.type === type);
  }

  res.json({
    success: true,
    data: reports,
    meta: { total: reports.length }
  });
});

app.post('/api/reports/generate', authenticateToken, roleGuard(['supervisor', 'admin']), (req, res) => {
  const { type, format, filters } = req.body;
  
  const jobId = 'job_' + Date.now();
  const downloadLink = `${req.protocol}://${req.get('host')}/api/reports/download/${jobId}`;
  
  // Simulate report generation
  setTimeout(() => {
    db.reports.push({
      id: jobId,
      name: `${type} Report - ${new Date().toLocaleDateString()}`,
      type,
      format,
      lastUpdated: new Date().toISOString(),
      size: '2.4 MB',
      downloadLink
    });
  }, 2000);

  res.json({
    success: true,
    data: { jobId, downloadLink, status: 'generating' }
  });
});

// Dev Routes
app.post('/api/dev/seed', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, error: { message: 'Not available in production' } });
  }
  
  // Reset and seed database
  Object.assign(db, require('./data/mockDb'));
  
  res.json({
    success: true,
    data: { message: 'Database seeded successfully' }
  });
});

app.get('/api/dev/mock/:resource', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, error: { message: 'Not available in production' } });
  }
  
  const resource = req.params.resource;
  if (db[resource]) {
    res.json({
      success: true,
      data: db[resource]
    });
  } else {
    res.status(404).json({
      success: false,
      error: { message: 'Resource not found' }
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Talent Helix API Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for real-time notifications`);
});