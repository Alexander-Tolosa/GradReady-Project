import { supabase } from './supabase';
import { notificationService } from './notificationService';

export const facultyService = {
  async fetchFacultyProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase
      .from('faculty')
      .select('*, departments(name, icon)')
      .eq('id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async fetchDepartmentSubmissions(departmentId) {
    // Step 1: Fetch requirements for the department
    const { data: requirements, error: reqError } = await supabase
      .from('requirements')
      .select('*')
      .eq('department_id', departmentId)
      .order('updated_at', { ascending: false });

    if (reqError) throw reqError;
    if (!requirements || requirements.length === 0) return [];

    // Step 2: Get unique student_auth_ids from requirements
    const studentAuthIds = [...new Set(requirements.map(r => r.student_auth_id).filter(Boolean))];

    // Step 3: Fetch student profiles from the students table using auth ids
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, name, student_id, program')
      .in('id', studentAuthIds);

    if (studentsError) {
      console.error('Failed to fetch students:', studentsError);
    }

    // Step 4: Build a lookup map for quick access
    const studentMap = {};
    (students || []).forEach(s => {
      studentMap[s.id] = s;
    });

    // Step 5: Attach student data to each requirement
    const enriched = requirements.map(req => ({
      ...req,
      students: studentMap[req.student_auth_id] || null,
    }));

    return enriched;
  },

  async updateRequirementStatus(requirementId, status, revisionNote = null, studentId) {
    const updatePayload = {
      status,
      updated_at: new Date()
    };
    if (status === 'needs_revision' && revisionNote) {
      updatePayload.revision_note = revisionNote;
    } else if (status === 'cleared') {
      updatePayload.revision_note = null;
    }

    const { error } = await supabase
      .from('requirements')
      .update(updatePayload)
      .eq('id', requirementId);

    if (error) throw error;

    // Send notification to student dashboard and mock dispatch email
    let message = '';
    if (status === 'cleared') {
      message = 'Clearance granted: Your requirement has been marked as cleared.';
    } else if (status === 'needs_revision') {
      message = `Revision requested by faculty: ${revisionNote}`;
    }

    if (message && studentId) {
      await notificationService.createNotification(studentId, 'status_update', message, requirementId).catch(console.error);
      console.log(`[MOCK EMAIL DISPATCH] Sent to student ${studentId}: User dashboard alert initialized. Content: "${message}"`);
    }
  }
};