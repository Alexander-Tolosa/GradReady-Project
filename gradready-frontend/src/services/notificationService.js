import { supabase } from './supabase';

export const notificationService = {
  async fetchNotifications() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async markAllAsRead() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', session.user.id);

    if (error) throw error;
  },

  async createNotification(userId, type, message, requirementId = null) {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        type,
        message,
        related_requirement_id: requirementId
      }]);

    if (error) throw error;
  }
};
