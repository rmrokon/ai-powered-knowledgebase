# AI-Powered KnowledgeBase

A modern knowledge management system with AI-powered article summaries, smart tagging, and powerful search capabilities.

## 🌐 Live Demo

- **Frontend**: https://ai-powered-knowledgebase-two.vercel.app/
- **Backend API**: https://knowledgebase-api.up.railway.app/

## 🚀 Local Development

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Yarn or npm

### Backend Setup

```bash
cd backend
yarn install
```

Create `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/knowledgebase"
JWT_SECRET="your-jwt-secret"
PORT=3001
```

Run database setup:
```bash
yarn db:setup
```

Start development server:
```bash
yarn dev
```

Backend will run on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
yarn install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start development server:
```bash
yarn dev
```

Frontend will run on `http://localhost:3000`

## ✨ Features

- **Rich Article Editor** - Create and edit articles with ease
- **Smart Tagging** - Organize content with intelligent tags
- **Powerful Search** - Search through titles, content, and tags
- **AI Summaries** - Get instant AI-powered article summaries
- **User Authentication** - Secure login and registration
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14
- TypeScript
- Tailwind CSS
- React Query
- Zustand

**Backend:**
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

## 📝 API Documentation

The API documentation is available at the backend URL when running locally or at the live backend URL.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
