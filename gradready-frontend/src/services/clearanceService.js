import { supabase } from './supabase';


const DEFAULT_REQUIREMENTS = [
  { department_id: 'library', description: 'Return all borrowed books', due_date: '2025-03-15' },
  { department_id: 'library', description: 'Settle overdue fines', due_date: '2025-03-20' },
  { department_id: 'registrar', description: 'Updated academic records', due_date: '2025-03-10' },
  { department_id: 'registrar', description: 'Enrollment verification', due_date: '2025-03-12' },
  { department_id: 'dean', description: 'Course completion certificate', due_date: '2025-03-08' },
  { department_id: 'dean', description: 'OJT completion report', due_date: '2025-03-20' },
  { department_id: 'accounting', description: 'Full tuition payment', due_date: '2025-02-28' },
  { department_id: 'accounting', description: 'Lab fee settlement', due_date: '2025-03-01' },
  { department_id: 'student-affairs', description: 'Community service completion', due_date: '2025-03-05' },
  { department_id: 'it-office', description: 'Thesis/Capstone approval', due_date: '2025-03-10' },
  { department_id: 'it-office', description: 'Return borrowed IT equipment', due_date: '2025-03-12' },
  { department_id: 'it-office', description: 'Grade Consultation', due_date: '2025-03-15' },
];

export const clearanceService = {
  async fetchStudentProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async initializeStudentRequirements() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: existing, error: checkError } = await supabase
      .from('requirements')
      .select('id')
      .eq('student_auth_id', session.user.id)
      .limit(1);

    if (checkError) throw checkError;
    if (existing && existing.length > 0) return;


    const insertData = DEFAULT_REQUIREMENTS.map(req => ({
      ...req,
      student_auth_id: session.user.id,
      status: 'pending'
    }));

    const { error: insertError } = await supabase
      .from('requirements')
      .insert(insertData);

    if (insertError) throw insertError;
  },

  async fetchClearanceData() {

    const [{ data: departments, error: deptError }, { data: requirements, error: reqError }] = await Promise.all([
      supabase.from('departments').select('*').order('name'),
      supabase.from('requirements').select('*').order('due_date')
    ]);

    if (deptError) throw deptError;
    if (reqError) throw reqError;


    return departments.map(dept => ({
      ...dept,
      requirements: requirements.filter(r => r.department_id === dept.id)
    }));
  },

  async updateRequirementStatus(requirementId, status, uploadedFileUrl = null) {
    const updatePayload = { status, updated_at: new Date() };
    if (uploadedFileUrl) updatePayload.uploaded_file_url = uploadedFileUrl;

    const { error } = await supabase
      .from('requirements')
      .update(updatePayload)
      .eq('id', requirementId);

    if (error) throw error;
  },

  async fetchOffices() {
    const { data, error } = await supabase
      .from('offices')
      .select('*')
      .order('name');

    if (error) throw error;
    
    // Data normalization for Library Head (Ensures UI is updated even if DB is stale)
    return (data || []).map(office => ({
      ...office,
      head: office.id === 'library' ? 'Mr. Michael Tolosa' : office.head
    }));
  }
};
