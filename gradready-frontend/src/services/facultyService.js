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
    // Note: Due to RLS, faculty can only select requirements for their own department_id
    const { data: requirements, error: reqError } = await supabase
      .from('requirements')
      .select('*, students(name, student_id, program)')
      .eq('department_id', departmentId)
      .order('updated_at', { ascending: false });

    if (reqError) throw reqError;
    return requirements;
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

    // Send notification to student
    let message = '';
    if (status === 'cleared') {
      message = 'Your requirement has been cleared.';
    } else if (status === 'needs_revision') {
      message = `Revision requested: ${revisionNote}`;
    }

    if (message && studentId) {
       await notificationService.createNotification(studentId, 'status_update', message, requirementId).catch(console.error);
    }
  }
};
