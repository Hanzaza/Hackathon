import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET() {
  try {
    const supabase = getAdminClient();

    const [
      usersRes,
      reqRes,
      routesRes,
      citiesRes,
      eventsRes,
      deptsRes,
      reportsRes,
      achievementsRes,
      placesRes,
    ] = await Promise.all([
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('entrepreneur_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('creative_routes').select('*, municipalities(name)').order('name', { ascending: true }),
      supabase.from('municipalities').select('*, departments(name)').order('name', { ascending: true }),
      supabase.from('entrepreneur_events').select('*, municipalities(name), departments(name)').order('start_date', { ascending: true }),
      supabase.from('departments').select('*, users:manager_id(name, lastname, email)').order('name', { ascending: true }),
      supabase.from('reports').select('*').order('created_at', { ascending: false }),
      supabase.from('achievements').select('*').order('points_reward', { ascending: true }),
      supabase.from('route_places').select('*, creative_routes(name), municipalities(name)').order('order_num', { ascending: true }),
    ]);

    const users = usersRes.data || [];
    const requests = reqRes.data || [];
    const routes = routesRes.data || [];
    const cities = citiesRes.data || [];
    const events = eventsRes.data || [];
    const departments = deptsRes.data || [];
    const reports = reportsRes.data || [];
    const achievements = achievementsRes.data || [];
    const places = placesRes.data || [];

    const stats = {
      totalUsers: users.length,
      totalEntrepreneurs: users.filter((u: any) => u.role === 'entrepreneur').length,
      pendingRequests: requests.filter((r: any) => r.status === 'pending').length,
      totalRoutes: routes.length,
      totalEvents: events.length,
      totalCities: cities.length,
      totalDepartments: departments.length,
      pendingReports: reports.filter((r: any) => r.status === 'pending').length,
      supabaseConnected: true,
    };

    return NextResponse.json({
      stats,
      departments,
      cities,
      routes,
      events,
      users,
      achievements,
      reports,
      requests,
      places,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error cargando datos administrativos' },
      { status: 500 }
    );
  }
}
