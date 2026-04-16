import { supabase } from './supabase';

export const authService = {
  async signUp(email, password, studentData) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create student profile
      const { error: profileError } = await supabase
        .from('students')
        .insert([
          {
            id: authData.user.id,
            ...studentData // { name, student_id, program, college, year_level, semester }
          }
        ]);
        
      if (profileError) throw profileError;

      return authData.user;
    }
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
