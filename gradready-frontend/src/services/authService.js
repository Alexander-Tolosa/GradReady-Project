import { supabase } from './supabase';
export { supabase };

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

  async signUpAdmin(email, password, adminData) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('admins')
        .insert([
          {
            id: authData.user.id,
            ...adminData
          }
        ]);
        
      if (profileError) throw profileError;
      return authData.user;
    }
  },

  async signUpFaculty(email, password, facultyData) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('faculty')
        .insert([
          {
            id: authData.user.id,
            ...facultyData
          }
        ]);
        
      if (profileError) throw profileError;
      return authData.user;
    }
  },

  async getUserRole(userId) {
    if (!userId) return null;

    // Check students
    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('id', userId)
      .single();
    if (student) return 'student';

    // Check admins
    const { data: admin } = await supabase
      .from('admins')
      .select('id, role')
      .eq('id', userId)
      .single();
    if (admin) return admin.role || 'admin';

    // Check faculty
    const { data: faculty } = await supabase
      .from('faculty')
      .select('id, role')
      .eq('id', userId)
      .single();
    if (faculty) return faculty.role || 'faculty';

    return null;
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
