export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  is_premium: boolean;
}

export interface TopicStat {
  topic: string;
  accuracy: number;
  totalAttempted: number;
  level: string;
}
