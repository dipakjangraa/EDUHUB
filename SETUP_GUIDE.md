# 🚀 EDUHUB Complete Setup Guide

## Step 1: Install Dependencies

```bash
cd eduhub
npm install
```

## Step 2: Setup Supabase

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name it "eduhub"
4. Wait for database to be ready (~2 minutes)

### Copy Your Keys

Go to **Settings → API**:
- Copy `Project URL` → This is `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon public` key → This is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role` key → This is `SUPABASE_SERVICE_ROLE_KEY`

### Run Database Schema

1. Go to **SQL Editor** in Supabase
2. Click "New Query"
3. Copy entire content from `DATABASE_SCHEMA.sql`
4. Paste and click "Run"
5. You should see "Success. No rows returned"

### Enable Google OAuth (Optional)

1. Go to **Authentication → Providers**
2. Enable Google
3. Add your Google OAuth credentials

## Step 3: Setup OpenAI

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account / Login
3. Go to **API Keys**
4. Click "Create new secret key"
5. Copy the key → This is `OPENAI_API_KEY`

## Step 4: Setup Pusher (Optional - for Battle Mode)

1. Go to [pusher.com](https://pusher.com)
2. Sign up / Login
3. Create new app
4. Copy:
   - `app_id` → `PUSHER_APP_ID`
   - `key` → `NEXT_PUBLIC_PUSHER_KEY`
   - `secret` → `PUSHER_SECRET`
   - `cluster` → `NEXT_PUBLIC_PUSHER_CLUSTER`

## Step 5: Setup Razorpay (Optional - for Payments)

1. Go to [razorpay.com](https://razorpay.com)
2. Sign up / Login
3. Go to **Settings → API Keys**
4. Generate Test Keys
5. Copy:
   - `Key ID` → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `Key Secret` → `RAZORPAY_KEY_SECRET`

## Step 6: Create .env.local

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your keys:

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# OpenAI (REQUIRED)
OPENAI_API_KEY=sk-proj-xxx

# Pusher (Optional - skip if not using Battle Mode)
NEXT_PUBLIC_PUSHER_KEY=xxx
NEXT_PUBLIC_PUSHER_CLUSTER=ap2
PUSHER_APP_ID=xxx
PUSHER_SECRET=xxx

# Razorpay (Optional - skip if not using Payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 7: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 8: Test the App

1. Click "Sign Up"
2. Create account with email
3. Check Supabase → **Table Editor → profiles** → You should see your profile
4. Go to Dashboard
5. Click "Practice" → Select topic → Start test
6. AI will generate questions (takes ~5-10 seconds first time)

## 🎯 What Works Without Optional Services

### Without Pusher:
- ✅ All quiz features
- ✅ AI teacher
- ✅ Dashboard
- ✅ Leaderboard
- ❌ Battle Mode (will show error)

### Without Razorpay:
- ✅ All features work
- ❌ Premium page (will show error)

## 🐛 Troubleshooting

### "Supabase client error"
- Check your `.env.local` has correct Supabase URL and keys
- Make sure you ran the database schema

### "OpenAI API error"
- Check your OpenAI API key is valid
- Make sure you have credits in your OpenAI account

### "Questions not generating"
- Check browser console for errors
- Verify OpenAI API key
- Check if you have OpenAI credits

### "Can't sign up"
- Check Supabase is running
- Verify database schema was executed
- Check browser console for errors

## 📊 Verify Database Setup

Go to Supabase → **Table Editor**

You should see these tables:
- profiles
- test_results
- topic_performance
- ai_chats
- achievements
- user_achievements
- battles
- daily_challenges
- user_challenges
- payments
- notifications

## 🚀 Deploy to Production

### Vercel (Recommended)

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/eduhub.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Add all environment variables from `.env.local`
6. Click "Deploy"

### Update Environment Variables

In Vercel, update:
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 💰 Cost Breakdown

### Free Tier (Good for 1000+ users):
- Supabase: Free (500MB DB, 50K users)
- Vercel: Free (unlimited deploys)
- OpenAI: ~$0.001 per question generated

### Estimated Monthly Cost:
- 1,000 users: ~$15-20 (mostly OpenAI)
- 10,000 users: ~$150-200

## 🎉 You're Done!

Your app is now running. Next steps:
1. Customize branding
2. Add more question topics
3. Test all features
4. Deploy to production
5. Start marketing!

Need help? Check the main README.md or open an issue.
