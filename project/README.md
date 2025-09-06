# Talent Helix - Gamification & Insights Platform

A comprehensive platform that provides gamified experiences for associates and analytics-focused dashboards for supervisors, centered around an interactive Talent DNA visualization.

## Features

### Associate Experience
- **Talent DNA Visualization**: Interactive helix showing skill progression and unlockable segments
- **Gamified Quests**: Complete challenges to earn XP and unlock new abilities
- **Mystery Boxes**: Daily rewards and surprise achievements
- **Reflect & Earn**: Journal entries and pulse surveys for personal growth
- **Leaderboards**: Compete with team members and track progress
- **Real-time Notifications**: Get updates on achievements and team activities

### Supervisor Experience
- **Team Analytics**: Aggregate Talent DNA views and skill gap analysis
- **Engagement Insights**: Track team wellbeing and participation metrics
- **Burnout Alerts**: Early warning system for team member wellness
- **Comprehensive Reports**: Generate and export detailed analytics
- **Intervention Tools**: Log and track team support activities

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Authentication**: JWT with role-based access control
- **Real-time**: WebSocket for live notifications
- **Database**: Mock JSON data (production-ready for MongoDB/PostgreSQL)

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
# Terminal 1: Start the API server
npm run server

# Terminal 2: Start the frontend (in a new terminal)
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Demo Accounts

**Associate Account:**
- Username: `associate_demo`
- Password: `associate123`

**Supervisor Account:**
- Username: `supervisor_demo` 
- Password: `supervisor123`

**Admin Account:**
- Username: `admin_demo`
- Password: `admin123`

## API Documentation

### Authentication
- `POST /api/auth/login` - Authenticate user and return JWT
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/users/me` - Get current user profile

### Talent DNA
- `GET /api/talent-dna/associate` - Get individual DNA segments
- `GET /api/talent-dna/team` - Get aggregated team DNA (supervisor only)
- `POST /api/talent-dna/segment/:segmentId/claim` - Claim milestone progress

### Quests & Challenges
- `GET /api/quests` - List available quests
- `GET /api/quests/:id` - Get quest details
- `POST /api/quests/:id/enroll` - Enroll in quest
- `POST /api/quests/:id/progress` - Update quest progress
- `POST /api/quests/:id/complete` - Complete quest and claim rewards
- `POST /api/quests/:id/invite` - Invite team members to quest

### Mystery Boxes & Rewards
- `GET /api/mystery-boxes` - Get available mystery boxes
- `POST /api/mystery-boxes/:id/open` - Open mystery box for rewards

### Pulse & Journals
- `GET /api/pulse/latest` - Get latest pulse survey
- `POST /api/pulse/submit` - Submit pulse survey response
- `GET /api/journals` - List user journal entries
- `POST /api/journals` - Create new journal entry

### Badges & Achievements
- `GET /api/badges` - Get all available badges
- `GET /api/users/:id/badges` - Get user's earned badges
- `POST /api/badges/award` - Award badge to user (admin only)

### Leaderboard & Social
- `GET /api/leaderboard` - Get leaderboard snapshot
- `GET /api/leaderboard/history` - Get historical leaderboard data
- `POST /api/social/share` - Share progress with team

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/mark-read` - Mark notifications as read
- `WS /ws/notifications` - Real-time notification stream

### Supervisor Analytics
- `GET /api/supervisor/engagement` - Team engagement metrics
- `GET /api/supervisor/skill-gaps` - Skill gap analysis
- `GET /api/supervisor/training-uptake` - Training completion rates
- `GET /api/supervisor/alerts` - Burnout and engagement alerts
- `POST /api/supervisor/intervention` - Log team intervention

### Reports
- `GET /api/reports` - List available reports
- `POST /api/reports/generate` - Generate new report

### Development Tools
- `POST /api/dev/seed` - Seed database with mock data (dev only)
- `GET /api/dev/mock/:resource` - Get mock data for resource (dev only)

## API Response Format

All API responses follow a consistent envelope format:

```json
{
  "success": boolean,
  "data": <payload>,
  "meta": {
    "pagination": {...},
    "total": number
  },
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## Real-time Features

The platform includes WebSocket support for real-time notifications:

- Quest completions and progress updates
- Badge awards and achievements
- Leaderboard changes
- Team activity notifications

Connect to `/ws/notifications` to receive real-time updates.

## Security Features

- JWT-based authentication with role claims
- Role-based access control (RBAC)
- Privacy-aware data sharing
- Rate limiting headers
- CORS protection

## Development

### Project Structure
```
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── services/          # API service functions
│   └── types/             # TypeScript type definitions
├── server/                # Backend API server
│   ├── data/              # Mock database
│   └── index.js           # Express server
└── dist/                  # Built frontend assets
```

### Building for Production

```bash
npm run build
npm run start
```

This builds the frontend and starts the production server on port 3001.

### Environment Variables

The following environment variables can be configured:

- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - JWT signing secret
- `NODE_ENV` - Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.