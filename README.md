# EDUHUB - AI-Powered Learning Platform

Better than Testbook. Unlimited AI-generated questions + Personal AI teacher.

## 🚀 Features

- ✅ **AI Question Generator** - Unlimited unique questions powered by GPT-4
- ✅ **AI Teacher Chatbot** - Personal tutor explains concepts in Hinglish
- ✅ **Smart Brain Analysis** - Tracks weak points and recommends practice
- ✅ **Battle Mode** - Real-time 1v1 PvP quiz battles
- ✅ **Leaderboard** - Global rankings
- ✅ **Achievements** - 17+ badges to unlock
- ✅ **Gamification** - XP, levels, streaks, coins
- ✅ **Premium Tier** - Razorpay payments integration
- ✅ **Mobile Responsive** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Email + Google OAuth)
- **AI**: OpenAI GPT-4o-mini
- **Real-time**: Pusher (for battle mode)
- **Payments**: Razorpay
- **Charts**: Recharts

## 📦 Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Setup Supabase**:
   - Go to [supabase.com](https://supabase.com) and create a project
   - Copy the SQL schema from `DATABASE_SCHEMA.sql` (will be created)
   - Run it in Supabase SQL Editor

3. **Setup environment variables**:
```bash
cp .env.local.example .env.local
```

Fill in your keys:
- Supabase URL and keys
- OpenAI API key
- Pusher credentials (optional, for battle mode)
- Razorpay keys (optional, for payments)

4. **Run development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

The complete database schema with all tables, RLS policies, and functions is in `DATABASE_SCHEMA.sql`.

Key tables:
- `profiles` - User data, XP, coins, streaks
- `test_results` - Test history
- `topic_performance` - Weak/strong area tracking
- `battles` - Real-time PvP data
- `achievements` - Badge system
- `payments` - Premium subscriptions

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=
PUSHER_APP_ID=
PUSHER_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_APP_URL=
```

## 📝 Project Structure

```
eduhub/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── (auth)/       # Login/Signup
│   │   ├── dashboard/    # Main dashboard
│   │   ├── test/         # Quiz pages
│   │   ├── battle/       # PvP mode
│   │   ├── leaderboard/  # Rankings
│   │   ├── achievements/ # Badges
│   │   ├── premium/      # Payment page
│   │   └── api/          # API routes
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   ├── types/            # TypeScript types
│   ├── engine/           # Question generation
│   └── store/            # State management
├── public/               # Static assets
└── DATABASE_SCHEMA.sql   # Complete DB schema
```

## 🎯 Roadmap

- [x] Core quiz engine
- [x] AI question generation
- [x] AI teacher chatbot
- [x] Battle mode
- [x] Payments
- [ ] Mobile app (React Native)
- [ ] More subjects (Physics, Chemistry, Biology)
- [ ] Video explanations
- [ ] Study groups

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Open an issue or PR.

---

Built with ❤️ for Indian students
