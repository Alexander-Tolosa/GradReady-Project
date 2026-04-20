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

    const totalStudents = students.length;
    const totalReqs = requirements.length;
    const clearedReqs = requirements.filter((r) => r.status === 'cleared').length;
    const submittedReqs = requirements.filter((r) => r.status === 'submitted').length;
    const pendingReqs = requirements.filter((r) => r.status === 'pending').length;
    const missingReqs = requirements.filter((r) => r.status === 'missing').length;
    const revisionReqs = requirements.filter((r) => r.status === 'needs_revision').length;
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

    const departmentData = departments.map(dept => {
      const deptReqs = requirements.filter(r => r.department_id === dept.id);
      return { ...dept, requirements: deptReqs };
    });

    const mappedStudents = students.map(student => {
      const studentReqs = requirements.filter(r => r.student_auth_id === student.id);
      const studentTotalReqs = studentReqs.length;
      const studentClearedReqs = studentReqs.filter(r => r.status === 'cleared').length;
      const progress = studentTotalReqs > 0 ? Math.round((studentClearedReqs / studentTotalReqs) * 100) : 0;
      return { ...student, requirements: studentReqs, progress };
    });

    const recentRequests = requirements
      .filter(r => r.status === 'submitted' || r.status === 'pending')
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 10)
      .map(r => {
        const student = students.find(s => s.id === r.student_auth_id);
        return {
          ...r,
          studentName: student?.name ?? '—',
          studentDepartment: student?.department ?? '—',
        };
      });

    return { stats, mappedStudents, departmentData, recentRequests };
  },

  async fetchAllUsers() {
    const [
      { data: students },
      { data: admins },
      { data: faculty },
      { data: departments }
    ] = await Promise.all([
      supabase.from('students').select('id, name, program, created_at').order('name'),
      supabase.from('admins').select('id, name, role, department, created_at').order('name'),
      supabase.from('faculty').select('id, name, role, department_id, created_at').order('name'),
      supabase.from('departments').select('id, name')
    ]);

    const users = [
      ...(students || []).map(s => ({ ...s, derivedRole: 'student', assignedDepartment: s.program })),
      ...(admins || []).map(a => ({ ...a, derivedRole: a.role || 'admin', assignedDepartment: a.department })),
      ...(faculty || []).map(f => {
        const dept = (departments || []).find(d => d.id === f.department_id);
        return { ...f, derivedRole: f.role || 'faculty', assignedDepartment: dept ? dept.name : null };
      })
    ];
    return users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async updateUserRole() {
    throw new Error("Role updates are currently disabled in the UI for security.");
  },

  async updateClearanceStatus(requirementId, newStatus) {
    const { error } = await supabase
      .from('requirements')
      .update({ status: newStatus, updated_at: new Date() })
      .eq('id', requirementId);

    if (error) throw error;
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
  },

  async exportClearanceData() {
    const { data: requirements, error: reqError } = await supabase
      .from('requirements')
      .select(`
        *,
        students (
          name,
          student_id,
          program
        ),
        departments (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (reqError) throw reqError;

    // Build CSV Header
    const headers = ['Student Name', 'Student ID', 'Program/College', 'Department', 'Requirement', 'Status', 'Last Updated'];
    
    // Build CSV Rows
    const rows = (requirements || []).map(req => {
      return [
        req.students?.name || 'Unknown',
        req.students?.student_id || 'N/A',
        req.students?.program || 'N/A',
        req.departments?.name || req.department_id,
        req.description,
        req.status,
        new Date(req.updated_at || req.created_at).toLocaleDateString()
      ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(','); // Escape quotes inside CSV
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    return csvContent;
  }
};
