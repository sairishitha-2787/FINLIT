import { supabase } from '../config/supabase';

// Fetch profile by auth user id (user_id column)
export const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  // PGRST116 = no rows found — not an error, just means onboarding not done yet
  if (error && error.code === 'PGRST116') return { data: null, error: null };
  return { data, error };
};

// Insert or update the profile row for the given auth user
export const saveProfile = async (userId, dbFields) => {
  // Check if row already exists
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (existing) {
    // Update existing row
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...dbFields, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    return { data, error };
  } else {
    // Insert new row
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{ user_id: userId, ...dbFields }])
      .select()
      .single();
    return { data, error };
  }
};

// Partial update of an existing profile row
export const updateProfileFields = async (userId, dbFields) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...dbFields, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();
  return { data, error };
};
