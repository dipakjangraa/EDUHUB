-- ============================================
-- EDUHUB COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  exam_target TEXT DEFAULT 'SSC',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  coins INTEGER DEFAULT 0,
  gems INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_tests INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  rank_global INTEGER,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP,
  last_active TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Test Results
CREATE TABLE test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct INTEGER NOT NULL,
  accuracy FLOAT NOT NULL,
  time_taken INTEGER NOT NULL,
  xp_earned INTEGER NOT NULL,
  coins_earned INTEGER DEFAULT 0,
  questions_data JSONB NOT NULL,
  mode TEXT DEFAULT 'practice',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Topic Performance
CREATE TABLE topic_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  total_attempted INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  accuracy FLOAT DEFAULT 0,
  avg_time FLOAT DEFAULT 0,
  current_level TEXT DEFAULT 'beginner',
  weak_concepts JSONB DEFAULT '[]',
  strong_concepts JSONB DEFAULT '[]',
  last_practiced TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, topic)
);

-- AI Chats
CREATE TABLE ai_chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT,
  messages JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  coin_reward INTEGER DEFAULT 0,
  gem_reward INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common',
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL
);

-- User Achievements
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Battles
CREATE TABLE battles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player1_id UUID REFERENCES profiles(id),
  player2_id UUID REFERENCES profiles(id),
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  questions JSONB NOT NULL,
  player1_answers JSONB DEFAULT '[]',
  player2_answers JSONB DEFAULT '[]',
  player1_score INTEGER DEFAULT 0,
  player2_score INTEGER DEFAULT 0,
  winner_id UUID,
  status TEXT DEFAULT 'waiting',
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily Challenges
CREATE TABLE daily_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  topic TEXT NOT NULL,
  questions JSONB NOT NULL,
  xp_reward INTEGER DEFAULT 100,
  coin_reward INTEGER DEFAULT 20,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Daily Challenge Attempts
CREATE TABLE user_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id),
  score INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Payments
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  plan TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'Student'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read for profiles (leaderboard)
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users see own results" ON test_results FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own performance" ON topic_performance FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own chats" ON ai_chats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own achievements" ON user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Battles for participants" ON battles FOR ALL USING (auth.uid() = player1_id OR auth.uid() = player2_id);
CREATE POLICY "Public daily challenges" ON daily_challenges FOR SELECT USING (true);
CREATE POLICY "Users see own challenge attempts" ON user_challenges FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own payments" ON payments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Helpful functions
CREATE OR REPLACE FUNCTION increment_user_xp(p_user_id UUID, p_xp INTEGER, p_coins INTEGER DEFAULT 0)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET xp = xp + p_xp,
      coins = coins + p_coins,
      level = FLOOR(SQRT((xp + p_xp) / 100.0))::INTEGER + 1,
      last_active = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Seed achievements
INSERT INTO achievements (code, name, description, icon, category, xp_reward, coin_reward, rarity, condition_type, condition_value) VALUES
('first_test', 'First Steps', 'Complete your first test', '🎯', 'milestone', 50, 10, 'common', 'tests_count', 1),
('test_10', 'Getting Started', 'Complete 10 tests', '📚', 'milestone', 100, 20, 'common', 'tests_count', 10),
('test_50', 'Dedicated Learner', 'Complete 50 tests', '📖', 'milestone', 250, 50, 'rare', 'tests_count', 50),
('test_100', 'Centurion', 'Complete 100 tests', '🏆', 'milestone', 500, 100, 'epic', 'tests_count', 100),
('test_500', 'Test Master', 'Complete 500 tests', '👑', 'milestone', 2000, 500, 'legendary', 'tests_count', 500),
('streak_3', 'On Fire', '3 day streak', '🔥', 'streak', 50, 10, 'common', 'streak', 3),
('streak_7', 'Week Warrior', '7 day streak', '🔥', 'streak', 150, 30, 'rare', 'streak', 7),
('streak_30', 'Monthly Master', '30 day streak', '🔥', 'streak', 500, 100, 'epic', 'streak', 30),
('streak_100', 'Streak Legend', '100 day streak', '🔥', 'streak', 2000, 500, 'legendary', 'streak', 100),
('perfect_1', 'Perfectionist', 'Score 100% in any test', '💯', 'accuracy', 100, 25, 'rare', 'perfect_score', 1),
('perfect_10', 'Flawless', '10 perfect scores', '💎', 'accuracy', 500, 100, 'epic', 'perfect_score', 10),
('speed_demon', 'Speed Demon', 'Average <30s per question', '⚡', 'speed', 150, 30, 'rare', 'avg_time', 30),
('xp_1000', 'Rising Star', 'Earn 1000 XP', '⭐', 'xp', 100, 20, 'common', 'total_xp', 1000),
('xp_10000', 'Superstar', 'Earn 10000 XP', '🌟', 'xp', 500, 100, 'epic', 'total_xp', 10000),
('battle_win_1', 'First Victory', 'Win your first battle', '⚔️', 'battle', 100, 25, 'common', 'battle_wins', 1),
('battle_win_10', 'Battle Veteran', 'Win 10 battles', '🛡️', 'battle', 300, 75, 'rare', 'battle_wins', 10),
('battle_win_50', 'Champion', 'Win 50 battles', '👑', 'battle', 1000, 250, 'epic', 'battle_wins', 50)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- MOCK TEST SYSTEM
-- ============================================

CREATE TABLE mock_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exam TEXT NOT NULL,           -- 'upsc', 'neet', 'jee', 'nda', 'ssc'
  title TEXT NOT NULL,          -- e.g. "UPSC GS Mock Test #3"
  subjects JSONB NOT NULL,      -- which subjects/topics included
  total_questions INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  questions JSONB NOT NULL,     -- all questions
  answers JSONB DEFAULT '[]',   -- user answers
  score INTEGER DEFAULT 0,
  max_score INTEGER NOT NULL,
  accuracy FLOAT DEFAULT 0,
  time_taken INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending | in_progress | completed
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  xp_earned INTEGER DEFAULT 0,
  rank_percentile FLOAT,        -- how user ranked vs others
  section_scores JSONB DEFAULT '{}', -- score per subject
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own mock tests" ON mock_tests FOR ALL USING (auth.uid() = user_id);

-- Index for fast queries
CREATE INDEX idx_mock_tests_user_id ON mock_tests(user_id);
CREATE INDEX idx_mock_tests_exam ON mock_tests(exam);
CREATE INDEX idx_mock_tests_status ON mock_tests(status);
