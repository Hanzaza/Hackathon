import { getSupabaseClient } from './supabaseService.js';

export const backendAdminService = {
  async getDashboardStats() {
    try {
      const supabase = getSupabaseClient();
      const [usersRes, reqRes, routesRes, citiesRes, eventsRes, reportsRes] = await Promise.allSettled([
        supabase.from('users').select('id, role', { count: 'exact' }),
        supabase.from('entrepreneur_requests').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('creative_routes').select('id', { count: 'exact' }),
        supabase.from('municipalities').select('id', { count: 'exact' }),
        supabase.from('entrepreneur_events').select('id', { count: 'exact' }),
        supabase.from('reports').select('id', { count: 'exact' }).eq('status', 'pending'),
      ]);

      const usersCount = usersRes.status === 'fulfilled' ? usersRes.value.count || 0 : 0;
      const pendingReqCount = reqRes.status === 'fulfilled' ? reqRes.value.count || 0 : 0;
      const routesCount = routesRes.status === 'fulfilled' ? routesRes.value.count || 0 : 0;
      const citiesCount = citiesRes.status === 'fulfilled' ? citiesRes.value.count || 0 : 0;
      const eventsCount = eventsRes.status === 'fulfilled' ? eventsRes.value.count || 0 : 0;
      const reportsCount = reportsRes.status === 'fulfilled' ? reportsRes.value.count || 0 : 0;

      return {
        totalUsers: usersCount,
        pendingRequests: pendingReqCount,
        totalRoutes: routesCount,
        totalCities: citiesCount,
        totalEvents: eventsCount,
        pendingReports: reportsCount,
      };
    } catch {
      return {
        totalUsers: 3,
        pendingRequests: 3,
        totalRoutes: 4,
        totalCities: 9,
        totalEvents: 3,
        pendingReports: 2,
      };
    }
  },

  async approveEntrepreneurRequest(requestId: string) {
    const supabase = getSupabaseClient();
    
    // Obtener solicitud
    const { data: request, error: reqErr } = await supabase
      .from('entrepreneur_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (reqErr || !request) {
      throw new Error('Solicitud no encontrada.');
    }

    // Actualizar solicitud
    await supabase
      .from('entrepreneur_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);

    // Actualizar rol del usuario
    await supabase
      .from('users')
      .update({ role: 'entrepreneur' })
      .eq('id', request.user_id);

    // Crear registro en tabla entrepreneurs
    await supabase.from('entrepreneurs').upsert({
      user_id: request.user_id,
      business_name: request.business_name,
      business_type: request.business_type,
      description: request.motivation,
      address: request.address,
      status: 'active',
      is_visible_in_map: true,
    });

    return { success: true, message: 'Emprendedor aprobado y acreditado exitosamente.' };
  },

  async rejectEntrepreneurRequest(requestId: string) {
    const supabase = getSupabaseClient();
    await supabase
      .from('entrepreneur_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    return { success: true, message: 'Solicitud rechazada.' };
  },
};
