import { supabase } from './supabase';

export const adminService = {
  async fetchAdminProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async fetchSystemData() {
    // Fetch all students, all requirements, and all departments
    const [
      { data: students, error: studentsError },
      { data: requirements, error: reqError },
      { data: departments, error: deptError }
    ] = await Promise.all([
      supabase.from('students').select('*').order('name'),
      supabase.from('requirements').select('*'),
      supabase.from('departments').select('*').order('name')
    ]);

    if (studentsError) throw studentsError;
    if (reqError) throw reqError;
    if (deptError) throw deptError;

    // Calculate System Stats
    const totalStudents = students.length;
    const totalReqs = requirements.length;
    const clearedReqs = requirements.filter((r) => r.status === 'cleared').length;
    const submittedReqs = requirements.filter((r) => r.status === 'submitted').length;
    const pendingReqs = requirements.filter((r) => r.status === 'pending').length;
    const missingReqs = requirements.filter((r) => r.status === 'missing').length;
    const revisionReqs = requirements.filter((r) => r.status === 'needs_revision').length;
    
    // Overall Progress
    const overallProgress = totalReqs > 0 ? Math.round((clearedReqs / totalReqs) * 100) : 0;

    const stats = {
      totalStudents,
      totalReqs,
      clearedReqs,
      submittedReqs,
      pendingReqs,
      missingReqs,
      revisionReqs,
      overallProgress
    };

    // Calculate Department Level Data (aggregate)
    const departmentData = departments.map(dept => {
      const deptReqs = requirements.filter(r => r.department_id === dept.id);
      return {
        ...dept,
        requirements: deptReqs // We map this even though it's all students' requirements for that dept
      };
    });

    // Map requirements to students for Student Roster
    const mappedStudents = students.map(student => {
      const studentReqs = requirements.filter(r => r.student_auth_id === student.id);
      const studentTotalReqs = studentReqs.length;
      const studentClearedReqs = studentReqs.filter(r => r.status === 'cleared').length;
      const progress = studentTotalReqs > 0 ? Math.round((studentClearedReqs / studentTotalReqs) * 100) : 0;
      
      return {
        ...student,
        requirements: studentReqs,
        progress
      };
    });

    return { stats, mappedStudents, departmentData };
  },

  async fetchAllUsers() {
    const [
      { data: students },
      { data: admins },
      { data: faculty }
    ] = await Promise.all([
      supabase.from('students').select('id, name, created_at').order('name'),
      supabase.from('admins').select('id, name, role, created_at').order('name'),
      supabase.from('faculty').select('id, name, role, created_at').order('name')
    ]);

    const users = [
      ...(students || []).map(s => ({ ...s, derivedRole: 'student' })),
      ...(admins || []).map(a => ({ ...a, derivedRole: a.role || 'admin' })),
      ...(faculty || []).map(f => ({ ...f, derivedRole: f.role || 'faculty' }))
    ];
    return users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async updateUserRole() {
     // NOTE: User roles are determined by which table they are in.
     // Moving a user requires deleting from one table and inserting to another.
     // This is a complex secure operation that typically requires a backend function.
     throw new Error("Role updates are currently disabled in the UI for security.");
  },

  async undoStatusChange(requirementId, prevStatus = 'pending') {
    const { error } = await supabase
      .from('requirements')
      .update({ status: prevStatus, updated_at: new Date() })
      .eq('id', requirementId);

    if (error) throw error;
  },

  async batchClearRequirements(studentId) {
    const { error } = await supabase
      .from('requirements')
      .update({ status: 'cleared', updated_at: new Date() })
      .eq('student_auth_id', studentId)
      .neq('status', 'cleared');

    if (error) throw error;
  }
};
