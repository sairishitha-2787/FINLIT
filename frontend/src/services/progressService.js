import { supabase } from '../config/supabase';

// Save a completed topic to the progress table
export const saveTopicProgress = async (userId, { topic, score, totalQuestions }) => {
  const { data, error } = await supabase
    .from('progress')
    .insert([{
      user_id: userId,
      topic,
      score: score ?? null,
      total_questions: totalQuestions ?? null,
      completed_at: new Date().toISOString(),
    }])
    .select()
    .single();
  return { data, error };
};

// Record that a user completed a quiz on a topic
export const saveQuizResult = async (userId, topic) => {
  const { data, error } = await supabase
    .from('quiz_results')
    .insert([{
      user_id: userId,
      topic,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();
  return { data, error };
};

// Fetch all progress rows for a user
export const fetchUserProgress = async (userId) => {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  return { data: data || [], error };
};
