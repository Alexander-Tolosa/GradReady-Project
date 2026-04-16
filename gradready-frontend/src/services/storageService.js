import { supabase } from './supabase';

export const storageService = {
  async uploadDocument(file, departmentId, requirementId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Must be logged in to upload documents.");

    const userId = session.user.id;
    const fileExt = file.name.split('.').pop();
    // Unique name per user and requirement to prevent path collisions
    const fileName = `${userId}/${departmentId}/${requirementId}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('clearance-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false // Keep exact history or fail if duplicate exists, though timestamp prevents duplicates
      });

    if (error) throw error;

    // Get the public URL for the file to save into the DB
    const { data: publicData } = supabase.storage
      .from('clearance-documents')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  }
};
