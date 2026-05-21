import { supabaseAdmin } from './supabase';

export async function checkAndUnlockAchievements(userId: string) {
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) return [];

    const { data: achievements } = await supabaseAdmin
      .from('achievements')
      .select('*');

    const { data: unlocked } = await supabaseAdmin
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    const unlockedIds = new Set(unlocked?.map((u) => u.achievement_id) || []);
    const newlyUnlocked = [];

    for (const ach of achievements || []) {
      if (unlockedIds.has(ach.id)) continue;

      let conditionMet = false;
      switch (ach.condition_type) {
        case 'tests_count':
          conditionMet = profile.total_tests >= ach.condition_value;
          break;
        case 'streak':
          conditionMet = profile.streak >= ach.condition_value;
          break;
        case 'total_xp':
          conditionMet = profile.xp >= ach.condition_value;
          break;
        case 'perfect_score':
          const { count } = await supabaseAdmin
            .from('test_results')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('accuracy', 100);
          conditionMet = (count || 0) >= ach.condition_value;
          break;
      }

      if (conditionMet) {
        await supabaseAdmin.from('user_achievements').insert({
          user_id: userId,
          achievement_id: ach.id,
        });
        
        await supabaseAdmin.rpc('increment_user_xp', {
          p_user_id: userId,
          p_xp: ach.xp_reward,
          p_coins: ach.coin_reward,
        });
        
        await supabaseAdmin.from('notifications').insert({
          user_id: userId,
          type: 'achievement',
          title: '🏆 Achievement Unlocked!',
          message: `${ach.icon} ${ach.name}: ${ach.description}`,
        });
        
        newlyUnlocked.push(ach);
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error('Achievement check error:', error);
    return [];
  }
}
