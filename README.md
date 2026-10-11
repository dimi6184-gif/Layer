# 🤖 Layer - Ultimate Discord Bot

> Transform your Discord server with AI-powered moderation, leveling, music, tickets, and live stream notifications.

[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen)](./PRODUCTION_READY_CHECKLIST.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-14-5865F2)](https://discord.js.org/)

---

## ✨ Features

### 🛡️ Moderation
- **AI-Powered Anti-Scam** - Detects scam links, phishing, and malicious content
- **OCR Scanning** - Analyzes images for scam content
- **Auto-Moderation** - Banned words, spam detection
- **Moderation Commands** - Ban, kick, mute, warn, clear

### 📊 Leveling System
- **XP & Levels** - Reward active members
- **Level Rewards** - Auto-assign roles on level up
- **Leaderboard** - See top members
- **Customizable** - Set XP rates and rewards

### 🎵 Music Player
- **YouTube Integration** - Play music from YouTube
- **Queue System** - Manage song queue
- **DJ Role** - Restrict controls to specific roles
- **Full Controls** - Play, pause, skip, stop, volume

### 🎫 Ticket System
- **AI Ticket Moderator** - Automatically responds to tickets
- **Custom Reasons** - Dropdown or button selection
- **Support Roles** - Assign staff to tickets
- **Analytics** - Track ticket metrics

### 🔴 Stream Notifications
- **Twitch Integration** - Get notified when streamers go live
- **YouTube Integration** - Live stream notifications
- **Custom Messages** - Personalize notifications
- **Role Pings** - Mention specific roles

### 🤖 AI Features
- **Gemini AI** - Natural conversations
- **Custom Personality** - Set bot personality per server
- **Context Awareness** - Remembers conversation context
- **Token Tracking** - Monitor AI usage

### 👥 Team Management
- **Role-Based Access Control** - Granular permissions
- **Team Invitations** - Invite members to manage server
- **Permission System** - Control who can access what
- **Audit Logs** - Track all team actions

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Discord Bot Token
- Discord OAuth Application

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Discordbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Database**
   ```bash
   cd packages/db
   npx prisma migrate deploy
   npx prisma generate
   ```

4. **Configure Environment Variables**
   
   **Web App** (`apps/web/.env`):
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   DISCORD_CLIENT_ID="your_client_id"
   DISCORD_CLIENT_SECRET="your_client_secret"
   DISCORD_BOT_TOKEN="your_bot_token"
   ```

   **Bot** (`apps/bot/.env`):
   ```env
   DISCORD_TOKEN="your_bot_token"
   CLIENT_ID="your_client_id"
   DEV_GUILD_ID="your_test_server_id"
   DATABASE_URL="postgresql://..."
   GEMINI_API_KEY="your_gemini_key"
   HUGGINGFACE_API_KEY="your_huggingface_key"
   TWITCH_CLIENT_ID="your_twitch_client_id"
   TWITCH_CLIENT_SECRET="your_twitch_client_secret"
   YOUTUBE_API_KEY="your_youtube_api_key"
   ```

5. **Start Development**
   ```bash
   # Terminal 1 - Web App
   cd apps/web
   npm run dev

   # Terminal 2 - Bot
   cd apps/bot
   npm run dev
   ```

6. **Access Dashboard**
   - Open http://localhost:3000
   - Login with Discord
   - Select your server

---

## 📚 Documentation

- 📖 [Production Deployment Guide](./PRODUCTION_DEPLOYMENT.md)
- 📖 [Production Ready Checklist](./PRODUCTION_READY_CHECKLIST.md)
- 📖 [Monitoring Guide](./MONITORING.md)
- 📖 [Social Notifications Setup](./SOCIAL_NOTIFICATIONS_SETUP.md)
- 📖 [Anti-Scam Setup](./ANTI_SCAM_SETUP.md)
- 📖 [Token Tracking](./TOKEN_TRACKING_SUMMARY.md)
- 📖 [Logs & Stats Guide](./LOGS_AND_STATS_GUIDE.md)

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **NextAuth** - Authentication

### Backend
- **Node.js** - Runtime
- **Discord.js** - Discord API
- **Prisma** - ORM
- **PostgreSQL** - Database

### AI & APIs
- **Google Gemini** - AI Chat
- **Hugging Face** - Image Analysis
- **Twitch API** - Stream Notifications
- **YouTube API** - Stream Notifications

---

## 📦 Project Structure

```
Discordbot/
├── apps/
│   ├── bot/                 # Discord Bot
│   │   ├── src/
│   │   │   ├── commands/    # Slash Commands
│   │   │   ├── events/      # Event Handlers
│   │   │   ├── utils/       # Utilities
│   │   │   └── index.ts     # Bot Entry Point
│   │   └── package.json
│   │
│   └── web/                 # Web Dashboard
│       ├── src/
│       │   ├── app/         # Next.js App Router
│       │   ├── components/  # React Components
│       │   ├── actions/     # Server Actions
│       │   └── lib/         # Utilities
│       └── package.json
│
├── packages/
│   └── db/                  # Shared Database
│       ├── prisma/
│       │   └── schema.prisma
│       └── index.ts
│
└── docs/                    # Documentation
```

---

## 🔒 Security

- ✅ **Security Headers** - HSTS, CSP, X-Frame-Options
- ✅ **Rate Limiting** - API abuse protection
- ✅ **Input Validation** - All user inputs validated
- ✅ **SQL Injection Protection** - Prisma ORM
- ✅ **XSS Protection** - React auto-escaping
- ✅ **CSRF Protection** - NextAuth built-in
- ✅ **Environment Variables** - Secrets not in code

---

## 📊 Performance

- ✅ **Image Optimization** - Next.js Image Component
- ✅ **Code Splitting** - Automatic by Next.js
- ✅ **Compression** - Gzip/Brotli
- ✅ **Database Indexing** - Optimized queries
- ✅ **Caching** - Browser & CDN caching
- ✅ **Lazy Loading** - Components on demand

---

## 🚀 Deployment

### Vercel (Recommended for Web App)
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy!

### Docker
```bash
docker-compose up -d
```

### VPS
```bash
# Install dependencies
npm ci

# Build
npm run build

# Start with PM2
pm2 start npm --name "web" -- start
pm2 start npm --name "bot" -- start
```

See [Production Deployment Guide](./PRODUCTION_DEPLOYMENT.md) for detailed instructions.

---

## 📈 Monitoring

- **Health Check**: `/api/health`
- **Audit Logs**: Database
- **Error Tracking**: Console & Database
- **Performance Metrics**: Response times

See [Monitoring Guide](./MONITORING.md) for setup instructions.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - Discord API wrapper
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Google Gemini](https://ai.google.dev/) - AI API
- [Hugging Face](https://huggingface.co/) - ML models

---

## 📞 Support

- 📧 Email: support@yourdomain.com
- 💬 Discord: [Join our server](https://discord.gg/your-invite)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

## 🎉 Status

**✅ PRODUCTION READY**

All features implemented, security hardened, performance optimized, and monitoring prepared.

Ready to deploy! 🚀

---

Made with ❤️ by the Layer Bot Team
