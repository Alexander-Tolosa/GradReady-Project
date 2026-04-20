import { supabase } from './supabase';
export { supabase };


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

  // ← FIXED: added timeout so it never hangs forever
  async getUserRole(userId) {
    if (!userId) return null;

    try {
      const { data: student } = await withTimeout(
        supabase.from('students').select('id').eq('id', userId).single(),
        5000, 'getUserRole timed out'
      );
      if (student) return 'student';

      const { data: admin } = await withTimeout(
        supabase.from('admins').select('id, role').eq('id', userId).single(),
        5000, 'getUserRole timed out'
      );
      if (admin) return admin.role || 'admin';

      const { data: faculty } = await withTimeout(
        supabase.from('faculty').select('id, role').eq('id', userId).single(),
        5000, 'getUserRole timed out'
      );
      if (faculty) return faculty.role || 'faculty';

    } catch (err) {
      console.warn('getUserRole failed:', err.message);
      return null;
    }

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

  async getSession() {
    try {
      const { data, error } = await withTimeout(
        supabase.auth.getSession(),
        8000,
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
