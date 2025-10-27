# 🎯 QuickPoll - Real-Time Opinion Polling Platform
**A modern, real-time polling platform built with Next.js, Express, MongoDB, and Socket.IO**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Architecture](#-architecture)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Workflow Diagrams](#-workflow-diagrams)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**QuickPoll** is a real-time opinion polling platform that allows users to create polls, vote, like polls, and see live updates as other users interact. The application features a beautiful, modern UI with animations, real-time synchronization across all clients, and a robust backend API.

### Key Highlights

✨ **Real-time Updates** - Instant synchronization using Socket.IO  
🎨 **Modern UI** - Beautiful interface with Framer Motion animations  
📊 **Live Statistics** - Real-time vote percentages and counts  
❤️ **Interactive Features** - Vote, like, and see results instantly  
🔒 **User Tracking** - One vote per user per poll  
📱 **Responsive Design** - Works perfectly on all devices  
🎉 **Confetti Celebrations** - Fun animations when voting  

---

## ✨ Features

### Core Functionality

- 📝 **Create Polls** - Easy poll creation with 2-10 options
- 🗳️ **Vote on Polls** - One vote per user, change vote anytime
- ❤️ **Like Polls** - Toggle likes on/off
- 📊 **Live Statistics** - Real-time vote percentages and counts
- 🔄 **Real-time Updates** - See votes and likes update instantly
- 👤 **User Persistence** - User ID stored in localStorage
- 🎯 **Poll Filtering** - View All, Trending, or Recent polls

### UI/UX Features

- 🎨 Beautiful gradient backgrounds with animated blobs
- ✨ Smooth animations using Framer Motion
- 🎉 Confetti celebration on voting
- 🌈 Color-coded polls with unique gradients
- 📱 Fully responsive mobile-first design
- 🎭 Avatar system with user initials
- 🔔 Toast notifications for user actions
- 🏆 Leading option indicator

---

## 🛠 Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Real-time:** Socket.IO Client
- **State Management:** React Hooks

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.IO
- **Authentication:** User ID-based (localStorage)

### DevOps & Tools
- **Package Manager:** npm
- **Version Control:** Git
- **API Testing:** Postman
- **Database:** MongoDB Atlas (Cloud)

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Next.js Frontend Application                    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │   Pages    │  │ Components │  │   Hooks    │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │ API Client │  │ Socket.IO  │  │  Storage   │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Node.js/Express)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Express Server                         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │   Routes   │  │Controllers │  │ Middleware │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │   Models   │  │ Socket.IO  │  │Validation  │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Collections                             │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │   Polls    │  │   Votes    │  │   Likes    │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Real-Time Communication Flow

```
User A                    Socket.IO Server              User B
  │                              │                         │
  │──── Create Poll ────────────>│                         │
  │                              │────── poll:created ────>│
  │                              │                         │
  │<──── Confirmation ───────────│                         │
  │                              │                         │
  │──── Submit Vote ────────────>│                         │
  │                              │───── vote:updated ─────>│
  │<──── Updated Poll ───────────│                         │
  │                              │<──── Updated Poll ──────│
```

---

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas account)
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/royanish0410/quickpoll-platform.git
cd quickpoll-platform
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd apps/backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/quickpoll
EOF

# Start backend server
npm run dev
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend (new terminal)
cd apps/frontend

# Install dependencies
npm install

# Initialize shadcn/ui
npx shadcn@latest init

# Add shadcn components
npx shadcn@latest add button card badge dialog input label tabs progress avatar separator

# Install additional packages
npm install framer-motion react-confetti socket.io-client

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
EOF

# Start frontend
npm run dev
```

### Step 4: Access Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000 || https://quick-poll-platform-frontend.vercel.app/
- **Backend API:** http://localhost:4000 || https://quickpoll-backend-8298.onrender.com

---

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Endpoints

#### 1. Get All Polls

```http
GET /polls
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "polls": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "question": "What's your favorite programming language?",
      "createdBy": "John Doe",
      "isActive": true,
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T10:30:00.000Z",
      "totalVotes": 10,
      "totalLikes": 5,
      "options": [
        {
          "id": "a5cea547-f9e0-4d52-8ce0-a787813f34f1",
          "text": "JavaScript",
          "order": 0,
          "votes": 4,
          "percentage": 40
        },
        {
          "id": "28f13a57-4a30-482b-af56-646e56aab91d",
          "text": "Python",
          "order": 1,
          "votes": 6,
          "percentage": 60
        }
      ]
    }
  ]
}
```

#### 2. Get Single Poll

```http
GET /polls/:pollId
```

**Parameters:**
- `pollId` (string) - MongoDB ObjectId of the poll

**Response:**
```json
{
  "success": true,
  "poll": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "question": "Best JavaScript framework?",
    "totalVotes": 15,
    "totalLikes": 8,
    "options": [...]
  }
}
```

#### 3. Create Poll

```http
POST /polls
```

**Request Body:**
```json
{
  "question": "What's your favorite color?",
  "options": ["Red", "Blue", "Green", "Yellow"],
  "createdBy": "Jane Smith"
}
```

**Validation Rules:**
- `question` (required, string, 1-500 characters)
- `options` (required, array, 2-10 items)
- `createdBy` (optional, string, defaults to "Anonymous")

**Response:**
```json
{
  "success": true,
  "poll": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "question": "What's your favorite color?",
    "options": [...],
    "createdBy": "Jane Smith",
    "totalVotes": 0,
    "totalLikes": 0
  }
}
```

#### 4. Submit Vote

```http
POST /polls/:pollId/vote
```

**Request Body:**
```json
{
  "userId": "user_abc123xyz",
  "optionId": "a5cea547-f9e0-4d52-8ce0-a787813f34f1"
}
```

**Business Rules:**
- One vote per user per poll
- Users can change their vote
- Real-time broadcast to all connected clients

**Response:**
```json
{
  "success": true,
  "message": "Vote submitted",
  "poll": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "totalVotes": 11,
    "options": [...]
  }
}
```

#### 5. Remove Vote

```http
DELETE /polls/:pollId/vote
```

**Request Body:**
```json
{
  "userId": "user_abc123xyz"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vote removed",
  "poll": {...}
}
```

#### 6. Toggle Like

```http
POST /polls/:pollId/like
```

**Request Body:**
```json
{
  "userId": "user_abc123xyz"
}
```

**Response:**
```json
{
  "success": true,
  "liked": true,
  "totalLikes": 6
}
```

#### 7. Check User Vote

```http
GET /polls/:pollId/vote/user?userId=user_abc123xyz
```

**Response:**
```json
{
  "success": true,
  "voted": true,
  "optionId": "a5cea547-f9e0-4d52-8ce0-a787813f34f1"
}
```

#### 8. Check User Like

```http
GET /polls/:pollId/like/user?userId=user_abc123xyz
```

**Response:**
```json
{
  "success": true,
  "liked": true
}
```

#### 9. Delete Poll

```http
DELETE /polls/:pollId
```

**Response:**
```json
{
  "success": true,
  "message": "Poll deleted successfully"
}
```

### Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔌 Socket.IO Events

### Client to Server

| Event | Payload | Description |
|-------|---------|-------------|
| `request:polls` | - | Request all polls |
| `join:poll` | `pollId: string` | Join poll room for updates |
| `leave:poll` | `pollId: string` | Leave poll room |

### Server to Client

| Event | Payload | Description |
|-------|---------|-------------|
| `poll:created` | `poll: Poll` | New poll created |
| `vote:updated` | `{pollId, userId, optionId, poll}` | Vote submitted/updated |
| `vote:removed` | `{pollId, userId, poll}` | Vote removed |
| `like:updated` | `{pollId, userId, liked, poll}` | Like toggled |
| `poll:deleted` | `{pollId}` | Poll deleted |
| `polls:list` | `polls: Poll[]` | List of all polls |
| `poll:data` | `poll: Poll` | Single poll data |

---

## 🗄 Database Schema

### Polls Collection

```typescript
{
  _id: ObjectId,
  question: String (required),
  options: [
    {
      id: String (UUID),
      text: String,
      order: Number
    }
  ],
  createdBy: String (default: "Anonymous"),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ isActive: 1, createdAt: -1 }` - For efficient querying

### Votes Collection

```typescript
{
  _id: ObjectId,
  pollId: ObjectId (ref: Poll),
  userId: String (required),
  optionId: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ pollId: 1, userId: 1 }` - Unique compound index (one vote per user per poll)
- `{ pollId: 1 }` - For efficient vote counting
- `{ userId: 1 }` - For user vote history

### Likes Collection

```typescript
{
  _id: ObjectId,
  pollId: ObjectId (ref: Poll),
  userId: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ pollId: 1, userId: 1 }` - Unique compound index (one like per user per poll)
- `{ pollId: 1 }` - For efficient like counting
- `{ userId: 1 }` - For user like history

---

## 📊 Workflow Diagrams

### 1. Poll Creation Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Click "Create Poll"
     ▼
┌─────────────────┐
│  Modal Opens    │
│  - Enter Q&A    │
│  - Add Options  │
└────┬────────────┘
     │
     │ 2. Submit Form
     ▼
┌─────────────────┐
│  Frontend       │
│  Validation     │
└────┬────────────┘
     │
     │ 3. POST /api/polls
     ▼
┌─────────────────┐
│  Backend API    │
│  - Validate     │
│  - Generate IDs │
└────┬────────────┘
     │
     │ 4. Save to DB
     ▼
┌─────────────────┐
│   MongoDB       │
│  Polls Collection│
└────┬────────────┘
     │
     │ 5. Return Poll
     ▼
┌─────────────────┐
│  Socket.IO      │
│  Broadcast      │
│  "poll:created" │
└────┬────────────┘
     │
     │ 6. Update UI
     ▼
┌─────────────────┐
│  All Clients    │
│  See New Poll   │
└─────────────────┘
```

### 2. Voting Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Click Option
     ▼
┌─────────────────┐
│  Check Status   │
│  - Has Voted?   │
│  - Loading?     │
└────┬────────────┘
     │
     │ 2. POST /polls/:id/vote
     │    { userId, optionId }
     ▼
┌─────────────────┐
│  Backend        │
│  - Find Poll    │
│  - Validate     │
└────┬────────────┘
     │
     │ 3. Check Existing Vote
     ▼
┌─────────────────┐
│  Votes DB       │
│  - Update or    │
│    Insert       │
└────┬────────────┘
     │
     │ 4. Calculate Stats
     ▼
┌─────────────────┐
│  Aggregate      │
│  - Vote Counts  │
│  - Percentages  │
└────┬────────────┘
     │
     │ 5. Broadcast Update
     ▼
┌─────────────────┐
│  Socket.IO      │
│  "vote:updated" │
└────┬────────────┘
     │
     │ 6. Update All Clients
     ▼
┌─────────────────┐
│  Real-time UI   │
│  - Progress Bars│
│  - Confetti 🎉  │
└─────────────────┘
```

### 3. Real-Time Update Flow

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   User A     │         │   Server     │         │   User B     │
│  (Voter)     │         │  Socket.IO   │         │  (Observer)  │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │  1. Submit Vote        │                        │
       │───────────────────────>│                        │
       │                        │                        │
       │  2. Update Database    │                        │
       │                        │                        │
       │  3. Calculate Stats    │                        │
       │                        │                        │
       │                        │  4. Broadcast Event    │
       │<───────────────────────│───────────────────────>│
       │                        │                        │
       │  5. Show Confetti 🎉   │  6. Update UI          │
       │                        │                        │
       ▼                        ▼                        ▼
```

### 4. User Journey Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Journey                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. DISCOVER                                                     │
│     └─> Land on homepage                                         │
│         └─> See animated polls                                   │
│             └─> Browse All/Trending/Recent                       │
│                                                                  │
│  2. ENGAGE                                                       │
│     └─> Click on interesting poll                                │
│         └─> Read question & options                              │
│             └─> Vote on favorite option                          │
│                 └─> See confetti celebration 🎉                  │
│                     └─> View real-time results                   │
│                                                                  │
│  3. INTERACT                                                     │
│     └─> Like the poll ❤️                                        │
│         └─> Share thoughts                                       │
│             └─> Create own poll                                  │
│                                                                  │
│  4. CREATE                                                       │
│     └─> Click "Create Poll"                                      │
│         └─> Enter question                                       │
│             └─> Add 2-10 options                                 │
│                 └─> Submit poll                                  │
│                     └─> See it appear instantly                  │
│                         └─> Watch votes come in                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌍 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/quickpoll
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickpoll?retryWrites=true&w=majority
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Socket.IO Configuration
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

---

## 📁 Project Structure

```
quickpoll-platform/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── models/
│   │   │   │   ├── db.ts              # MongoDB connection
│   │   │   │   ├── Poll.ts            # Poll schema
│   │   │   │   ├── Vote.ts            # Vote schema
│   │   │   │   └── Like.ts            # Like schema
│   │   │   ├── routes/
│   │   │   │   └── polls.ts           # API routes
│   │   │   ├── controllers/
│   │   │   │   ├── pollController.ts
│   │   │   │   ├── voteController.ts
│   │   │   │   └── likeController.ts
│   │   │   ├── middleware/
│   │   │   │   └── errorHandler.ts
│   │   │   ├── sockets/
│   │   │   │   └── index.ts           # Socket.IO handlers
│   │   │   └── server.ts              # Express server
│   │   ├── .env
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/
│       ├── app/
│       │   ├── page.tsx               # Home page
│       │   ├── layout.tsx             # Root layout
│       │   └── globals.css            # Global styles
│       ├── components/
│       │   ├── ui/                    # shadcn components
│       │   ├── header.tsx
│       │   ├── poll-card.tsx
│       │   ├── poll-option.tsx
│       │   ├── poll-feed.tsx
│       │   └── create-poll-modal.tsx
│       ├── lib/
│       │   ├── api.ts                 # API client
│       │   ├── socket.ts              # Socket.IO client
│       │   └── utils.ts               # Utility functions
│       ├── .env.local
│       ├── package.json
│       ├── tsconfig.json
│       └── tailwind.config.ts
│
├── README.md
└── package.json
```

---

## 📖 Usage Guide

### Creating a Poll

1. Click the **"Create Poll"** button in the header
2. Enter your name (optional, defaults to "Anonymous")
3. Type your question
4. Add 2-10 options (click "+ Add Option" for more)
5. Click **"Create Poll"** to publish
6. See your poll appear instantly with confetti! 🎉

### Voting on a Poll

1. Browse polls using the All/Trending/Recent tabs
2. Click on any option to vote
3. Watch the confetti celebration! 🎊
4. See real-time results with percentages
5. Change your vote anytime by clicking another option

### Liking a Poll

1. Click the ❤️ heart button at the bottom of any poll
2. Click again to unlike
3. See the like count update in real-time

### Filtering Polls

- **All**: Shows all polls in creation order
- **Trending**: Polls sorted by most votes
- **Recent**: Polls sorted by newest first

---

## 🎨 UI Components

### Design System

**Colors:**
- Primary: Blue (#2563EB)
- Secondary: Purple (#9333EA)
- Accent: Pink (#EC4899)
- Success: Green (#10B981)
- Error: Red (#EF4444)

**Typography:**
- Font Family: Inter (from Next.js)
- Headings: Bold, 24-32px
- Body: Regular, 14-16px
- Labels: Medium, 12-14px

**Spacing:**
- Base unit: 4px
- Card padding: 24px
- Section gaps: 24px

**Animations:**
- Duration: 200-300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create a poll with 2 options
- [ ] Create a poll with 10 options
- [ ] Vote on a poll
- [ ] Change your vote
- [ ] Like a poll
- [ ] Unlike a poll
- [ ] Open in 2 browsers and see real-time updates
- [ ] Test on mobile device
- [ ] Test with slow internet
- [ ] Try creating poll with invalid data

### API Testing with Postman

1. Import the Postman collection (see [API Documentation](#-api-documentation))
2. Set environment variable `baseUrl` to `http://localhost:4000/api`
3. Run the tests in order:
   - Health Check
   - Create Poll
   - Get All Polls
   - Submit Vote
   - Toggle Like

---

## 🚀 Deployment

### Backend Deployment (Render)

```bash
# 1. Go to Render Dashboard
Visit https://render.com and log in to your account.

# 2. Create a New Web Service
Click "New +" → "Web Service" → Connect your GitHub repository.

# 3. Configure the service
- Name: quickpoll-backend
- Environment: Node
- Build Command: npm install
- Start Command: npm run start
- Region: Select the nearest one
- Branch: main (or your deployment branch)

# 4. Add Environment Variables
MONGODB_URI=your_mongodb_connection_string
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://quick-poll-platform-frontend.vercel.app

# 5. Deploy
Render will automatically build and deploy your backend.
On every new push to your GitHub repo, it redeploys automatically.

# 6. Verify Deployment
Once live, test your API:
https://quickpoll-backend-8298.onrender.com/api/health


### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Update README for new features

---

## 🐛 Known Issues

- [ ] Confetti animation may lag on low-end devices
- [ ] Socket.IO reconnection needs improvement
- [ ] Poll deletion requires confirmation modal

---

## 🗺 Roadmap

- [ ] User authentication with JWT
- [ ] Poll expiration dates
- [ ] Comment system
- [ ] Share polls on social media
- [ ] Export results as CSV/PDF
- [ ] Dark mode support
- [ ] Poll categories/tags
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [https://github.com/royanish0410)]
- LinkedIn: [https://linkedin.com/anish-anand-555b08271]
- Email: anish.anandroy@gmail.com

---