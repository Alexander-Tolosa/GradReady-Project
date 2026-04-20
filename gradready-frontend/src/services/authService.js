import { supabase } from './supabase';
export { supabase };

// Helper: wraps any promise with a timeout
function withTimeout(promise, ms = 5000, message = 'Request timed out') {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(message)), ms)
  );
  return Promise.race([promise, timeout]);
}

export const authService = {
  async signUp(email, password, studentData) {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('students')
        .insert([{ id: authData.user.id, ...studentData }]);
      if (profileError) throw profileError;
      return authData.user;
    }
  },

  async signUpAdmin(email, password, adminData) {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('admins')
        .insert([{ id: authData.user.id, ...adminData }]);
      if (profileError) throw profileError;
      return authData.user;
    }
  },

  async signUpFaculty(email, password, facultyData) {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('faculty')
        .insert([{ id: authData.user.id, ...facultyData }]);
      if (profileError) throw profileError;
      return authData.user;
    }
  },

  async getUserRole(userId) {
    if (!userId) return null;

    const { data: student } = await supabase.from('students').select('id').eq('id', userId).single();
    if (student) return 'student';

    const { data: admin } = await supabase.from('admins').select('id, role').eq('id', userId).single();
    if (admin) return admin.role || 'admin';

    const { data: faculty } = await supabase.from('faculty').select('id, role').eq('id', userId).single();
    if (faculty) return faculty.role || 'faculty';

    return null;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // ← FIXED: now has a 5 second timeout so it never hangs forever
  async getSession() {
    try {
      const { data, error } = await withTimeout(
        supabase.auth.getSession(),
        2500,
        'Supabase connection timed out. Check your API keys and network.'
      );
      if (error) throw error;
      return data.session;
    } catch (err) {
      console.warn('getSession failed, returning null:', err.message);
      return null;
    }
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
