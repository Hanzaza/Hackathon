import { supabase } from '../lib/supabase';

export interface AdminStats {
  totalUsers: number;
  totalEntrepreneurs: number;
  pendingRequests: number;
  totalRoutes: number;
  totalEvents: number;
  totalCities: number;
  totalDepartments: number;
  pendingReports: number;
  supabaseConnected: boolean;
}

export interface DepartmentItem {
  id: string;
  name: string;
  slug: string;
  code?: string;
  description?: string;
  hero_image?: string;
  is_creative_region: boolean;
  manager_id?: string;
  manager_name?: string;
  manager_email?: string;
  status: 'active' | 'inactive';
  municipalities_count?: number;
  created_at?: string;
}

export interface EntrepreneurRequestItem {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_avatar?: string;
  department_id?: string;
  department_name?: string;
  municipality_id?: string;
  municipality_name?: string;
  request_type: string;
  status: 'pending' | 'approved' | 'rejected';
  motivation: string;
  business_name: string;
  business_type: 'fisico' | 'digital' | 'hibrido';
  category?: string;
  address?: string;
  phone?: string;
  city?: string;
  lat?: number;
  lng?: number;
  documents?: string[];
  created_at: string;
}

export interface CreativeRouteItem {
  id: string;
  municipality_id?: string;
  municipality_name?: string;
  name: string;
  slug: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  cover_image?: string;
  theme?: string;
  difficulty?: 'Fácil' | 'Moderada' | 'Desafiante';
  estimated_duration?: number;
  points_award: number;
  badge_name?: string;
  badge_icon?: string;
  route_color?: string;
  is_visible_in_map: boolean;
  places_count?: number;
  created_at?: string;
}

export interface MunicipalityItem {
  id: string;
  department_id?: string;
  department_name?: string;
  name: string;
  slug: string;
  is_creative: boolean;
  municipality_type: 'creativa' | 'tradicional' | 'mixta' | 'en_desarrollo';
  status: 'active' | 'disabled' | 'pending' | 'inactive';
  description?: string;
  subtitle?: string;
  logo_url?: string;
  hero_desktop?: string;
  hero_mobile?: string;
  lat?: number;
  lng?: number;
  specialties?: string[];
  routes_count?: number;
  created_at?: string;
}

export interface RoutePlaceItem {
  id: string;
  route_id?: string;
  route_name?: string;
  municipality_id?: string;
  municipality_name?: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  icon_name?: string;
  image?: string;
  gallery?: string[];
  audio_guide_url?: string;
  vr_360_url?: string;
  is_primary_route_point: boolean; // TRUE = Hito de Ruta Dariana | FALSE = Local/Punto Secundario
  walk_time?: string;
  rating?: string;
  lat: number;
  lng: number;
  points_reward?: number;
  is_active: boolean;
  order_num?: number;
  highlight?: string;
}

export interface AdminEventItem {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location_name: string;
  city: string;
  department?: string;
  category: string;
  status: 'published' | 'draft' | 'cancelled';
  organizer?: string;
  image?: string;
  points_reward?: number;
}

export interface AdminUserItem {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: 'user' | 'entrepreneur' | 'department_manager' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  points: number;
  level: number;
  city?: string;
  department?: string;
  assigned_department_id?: string;
  avatar?: string;
  created_at: string;
}

export interface AchievementItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  achievement_type: 'ruta' | 'puntos_secundarios' | 'foto' | 'resena' | 'evento' | 'especial' | 'visita';
  icon: string;
  points_reward: number;
  required_count: number;
}

export interface ReportItem {
  id: string;
  reported_by_name: string;
  reported_by_email: string;
  target_type: 'lugar' | 'ruta' | 'comentario' | 'emprendedor';
  target_id: string;
  target_name?: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export const adminService = {
  // 1. Estadísticas Globales
  async getStats(): Promise<AdminStats> {
    let supabaseConnected = false;
    let totalUsers = 0;
    let totalEntrepreneurs = 0;
    let pendingRequests = 0;
    let totalRoutes = 0;
    let totalEvents = 0;
    let totalCities = 0;
    let totalDepartments = 0;
    let pendingReports = 0;

    try {
      if (supabase) {
        const [usersRes, reqRes, routesRes, citiesRes, eventsRes, deptsRes, reportsRes] = await Promise.allSettled([
          supabase.from('users').select('id, role', { count: 'exact' }),
          supabase.from('entrepreneur_requests').select('id', { count: 'exact' }).eq('status', 'pending'),
          supabase.from('creative_routes').select('id', { count: 'exact' }),
          supabase.from('municipalities').select('id', { count: 'exact' }),
          supabase.from('entrepreneur_events').select('id', { count: 'exact' }),
          supabase.from('departments').select('id', { count: 'exact' }),
          supabase.from('reports').select('id', { count: 'exact' }).eq('status', 'pending'),
        ]);

        if (usersRes.status === 'fulfilled' && usersRes.value.count !== null) {
          supabaseConnected = true;
          totalUsers = usersRes.value.count;
          const uData = usersRes.value.data || [];
          totalEntrepreneurs = (uData as any[]).filter((u: { role: string }) => u.role === 'entrepreneur').length;
        }

        if (reqRes.status === 'fulfilled' && reqRes.value.count !== null) {
          supabaseConnected = true;
          pendingRequests = reqRes.value.count;
        }

        if (routesRes.status === 'fulfilled' && routesRes.value.count !== null) {
          totalRoutes = routesRes.value.count;
        }

        if (citiesRes.status === 'fulfilled' && citiesRes.value.count !== null) {
          totalCities = citiesRes.value.count;
        }

        if (eventsRes.status === 'fulfilled' && eventsRes.value.count !== null) {
          totalEvents = eventsRes.value.count;
        }

        if (deptsRes.status === 'fulfilled' && deptsRes.value.count !== null) {
          totalDepartments = deptsRes.value.count;
        }

        if (reportsRes.status === 'fulfilled' && reportsRes.value.count !== null) {
          pendingReports = reportsRes.value.count;
        }
      }
    } catch (err) {
      console.error('Error fetching admin stats from Supabase:', err);
    }

    return {
      totalUsers,
      totalEntrepreneurs,
      pendingRequests,
      totalRoutes,
      totalEvents,
      totalCities,
      totalDepartments,
      pendingReports,
      supabaseConnected,
    };
  },

  // 2. Departamentos y Encargados
  async getDepartments(): Promise<DepartmentItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('departments')
          .select(`
            id,
            name,
            slug,
            code,
            description,
            hero_image,
            is_creative_region,
            manager_id,
            status,
            created_at,
            users:manager_id (
              name,
              lastname,
              email
            )
          `)
          .order('name', { ascending: true });

        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            code: d.code,
            description: d.description,
            hero_image: d.hero_image,
            is_creative_region: !!d.is_creative_region,
            manager_id: d.manager_id,
            manager_name: d.users ? `${d.users.name} ${d.users.lastname}` : undefined,
            manager_email: d.users?.email,
            status: d.status || 'active',
            created_at: d.created_at,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching departments from Supabase:', err);
    }
    return [];
  },

  async updateDepartment(id: string, updates: Partial<DepartmentItem>): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('departments')
          .update({
            name: updates.name,
            code: updates.code,
            description: updates.description,
            is_creative_region: updates.is_creative_region,
            manager_id: updates.manager_id || null,
            status: updates.status,
          })
          .eq('id', id);
        return !error;
      }
    } catch (err) {
      console.error('Error updating department in Supabase:', err);
    }
    return false;
  },

  async assignDepartmentManager(departmentId: string, userId: string | null): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('departments')
          .update({ manager_id: userId })
          .eq('id', departmentId);

        if (userId) {
          await supabase
            .from('users')
            .update({ role: 'department_manager', assigned_department_id: departmentId })
            .eq('id', userId);
        }
        return !error;
      }
    } catch (err) {
      console.error('Error assigning manager in Supabase:', err);
    }
    return false;
  },

  // 3. Municipios / Ciudades Creativas
  async getCities(): Promise<MunicipalityItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('municipalities')
          .select(`
            id,
            department_id,
            name,
            slug,
            subtitle,
            description,
            is_creative,
            municipality_type,
            hero_image,
            logo_url,
            lat,
            lng,
            status,
            created_at,
            departments (
              name
            )
          `)
          .order('name', { ascending: true });

        if (!error && data) {
          return data.map((m: any) => ({
            id: m.id,
            department_id: m.department_id,
            department_name: m.departments?.name || 'Nicaragua',
            name: m.name,
            slug: m.slug,
            subtitle: m.subtitle,
            description: m.description,
            is_creative: !!m.is_creative,
            municipality_type: m.municipality_type || 'tradicional',
            hero_desktop: m.hero_image,
            logo_url: m.logo_url,
            lat: m.lat ? parseFloat(m.lat) : 12.4350,
            lng: m.lng ? parseFloat(m.lng) : -86.8782,
            status: m.status || 'active',
            created_at: m.created_at,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching cities from Supabase:', err);
    }
    return [];
  },

  async toggleCityCreativeStatus(id: string, isCreative: boolean): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('municipalities')
          .update({
            is_creative: isCreative,
            municipality_type: isCreative ? 'creativa' : 'tradicional',
          })
          .eq('id', id);
        return !error;
      }
    } catch (err) {
      console.error('Error toggling creative status:', err);
    }
    return false;
  },

  async toggleCityStatus(id: string, status: 'active' | 'inactive' | 'disabled' | 'pending'): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('municipalities')
          .update({ status })
          .eq('id', id);
        return !error;
      }
    } catch (err) {
      console.error('Error toggling city status:', err);
    }
    return false;
  },

  async deleteCity(id: string): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase.from('municipalities').delete().eq('id', id);
        return !error;
      }
    } catch (err) {
      console.error('Error deleting city:', err);
    }
    return false;
  },

  async setMunicipalityStatus(
    departmentId: string,
    departmentName: string,
    municipalityName: string,
    status: 'active' | 'disabled' | 'inactive'
  ): Promise<boolean> {
    try {
      if (supabase) {
        const cleanName = municipalityName.trim();
        const slug = cleanName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        // Buscar si ya existe por slug o nombre
        const { data: existing } = await supabase
          .from('municipalities')
          .select('id, department_id, name, slug')
          .or(`slug.eq.${slug},name.ilike.${cleanName}`)
          .limit(1)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from('municipalities')
            .update({
              status,
              department_id: departmentId || existing.department_id,
            })
            .eq('id', existing.id);
          return !error;
        } else {
          // Crear nuevo registro para el municipio
          const { error } = await supabase.from('municipalities').insert([
            {
              department_id: departmentId || null,
              name: cleanName,
              slug,
              status,
              is_creative: false,
              municipality_type: 'tradicional',
              description: `Municipio de ${cleanName}, Departamento de ${departmentName}.`,
            },
          ]);
          return !error;
        }
      }
    } catch (err) {
      console.error('Error setting municipality status:', err);
    }
    return false;
  },

  async setDepartmentAllMunicipalities(
    departmentId: string,
    departmentName: string,
    municipalityNames: string[],
    status: 'active' | 'disabled'
  ): Promise<boolean> {
    try {
      const promises = municipalityNames.map((name) =>
        this.setMunicipalityStatus(departmentId, departmentName, name, status)
      );
      const results = await Promise.all(promises);
      return results.every((r) => r === true);
    } catch (err) {
      console.error('Error batch setting municipalities:', err);
      return false;
    }
  },

  async createCity(data: Partial<MunicipalityItem>): Promise<boolean> {
    try {
      if (supabase) {
        // Encontrar o asignar departamento por defecto
        let deptId = data.department_id;
        if (!deptId && data.department_name) {
          const { data: dept } = await supabase.from('departments').select('id').ilike('name', `%${data.department_name}%`).limit(1).single();
          if (dept) deptId = dept.id;
        }
        if (!deptId) {
          const { data: firstDept } = await supabase.from('departments').select('id').limit(1).single();
          deptId = firstDept?.id;
        }

        const { error } = await supabase.from('municipalities').insert([
          {
            department_id: deptId,
            name: data.name,
            slug: data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            subtitle: data.subtitle,
            description: data.description,
            is_creative: data.is_creative || false,
            municipality_type: data.municipality_type || 'tradicional',
            lat: data.lat || 12.4350,
            lng: data.lng || -86.8782,
            hero_image: data.hero_desktop,
            logo_url: data.logo_url,
            status: data.status || 'active',
          },
        ]);
        return !error;
      }
    } catch (err) {
      console.error('Error creating city in Supabase:', err);
    }
    return false;
  },

  async updateCity(id: string, updates: Partial<MunicipalityItem>): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('municipalities')
          .update({
            name: updates.name,
            subtitle: updates.subtitle,
            description: updates.description,
            is_creative: updates.is_creative,
            municipality_type: updates.municipality_type,
            lat: updates.lat,
            lng: updates.lng,
            hero_image: updates.hero_desktop,
            logo_url: updates.logo_url,
            status: updates.status,
          })
          .eq('id', id);
        return !error;
      }
    } catch (err) {
      console.error('Error updating city in Supabase:', err);
    }
    return false;
  },

  // 4. Circuitos y Rutas Creativas
  async getRoutes(): Promise<CreativeRouteItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('creative_routes')
          .select(`
            id,
            municipality_id,
            name,
            slug,
            description,
            theme,
            difficulty,
            estimated_duration,
            points_award,
            badge_name,
            badge_icon,
            cover_image,
            route_color,
            status,
            is_visible_in_map,
            created_at,
            municipalities (
              name
            )
          `)
          .order('name', { ascending: true });

        if (!error && data) {
          return data.map((r: any) => ({
            id: r.id,
            municipality_id: r.municipality_id,
            municipality_name: r.municipalities?.name || 'León',
            name: r.name,
            slug: r.slug,
            description: r.description || '',
            theme: r.theme,
            difficulty: r.difficulty || 'Fácil',
            estimated_duration: r.estimated_duration || 120,
            points_award: r.points_award || 200,
            badge_name: r.badge_name,
            badge_icon: r.badge_icon,
            cover_image: r.cover_image,
            route_color: r.route_color || '#7c3aed',
            status: r.status || 'published',
            is_visible_in_map: r.is_visible_in_map ?? true,
            created_at: r.created_at,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching routes from Supabase:', err);
    }
    return [];
  },

  async createRoute(data: Partial<CreativeRouteItem>): Promise<boolean> {
    try {
      if (supabase) {
        let munId = data.municipality_id;
        if (!munId && data.municipality_name) {
          const { data: mun } = await supabase.from('municipalities').select('id').ilike('name', `%${data.municipality_name}%`).limit(1).single();
          if (mun) munId = mun.id;
        }
        if (!munId) {
          const { data: firstMun } = await supabase.from('municipalities').select('id').limit(1).single();
          munId = firstMun?.id;
        }

        const { error } = await supabase.from('creative_routes').insert([
          {
            municipality_id: munId,
            name: data.name,
            slug: data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: data.description,
            theme: data.theme,
            difficulty: data.difficulty || 'Fácil',
            estimated_duration: data.estimated_duration || 120,
            points_award: data.points_award || 200,
            badge_name: data.badge_name,
            badge_icon: data.badge_icon,
            cover_image: data.cover_image,
            route_color: data.route_color || '#7c3aed',
            status: data.status || 'published',
            is_visible_in_map: data.is_visible_in_map ?? true,
          },
        ]);
        return !error;
      }
    } catch (err) {
      console.error('Error creating route in Supabase:', err);
    }
    return false;
  },

  async updateRoute(id: string, updates: Partial<CreativeRouteItem>): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('creative_routes')
          .update(updates)
          .eq('id', id);
        return !error;
      }
    } catch (err) {
      console.error('Error updating route in Supabase:', err);
    }
    return false;
  },

  async deleteRoute(id: string): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase.from('creative_routes').delete().eq('id', id);
        return !error;
      }
    } catch (err) {
      console.error('Error deleting route from Supabase:', err);
    }
    return false;
  },

  // 5. Paradas y Puntos del Mapa Inmersivo (Principales vs Secundarios)
  async getRoutePlaces(routeId?: string): Promise<RoutePlaceItem[]> {
    try {
      if (supabase) {
        let query = supabase
          .from('route_places')
          .select(`
            id,
            route_id,
            municipality_id,
            name,
            slug,
            description,
            category,
            icon_name,
            image_url,
            gallery,
            audio_guide_url,
            vr_360_url,
            is_primary_route_point,
            order_num,
            walk_time,
            address,
            lat,
            lng,
            points_reward,
            status,
            creative_routes (
              name
            )
          `)
          .order('order_num', { ascending: true });

        if (routeId) {
          query = query.eq('route_id', routeId);
        }

        const { data, error } = await query;
        if (!error && data) {
          return data.map((p: any) => ({
            id: p.id,
            route_id: p.route_id,
            route_name: p.creative_routes?.name,
            municipality_id: p.municipality_id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            category: p.category || 'Patrimonio Cultural',
            icon_name: p.icon_name || 'MapPin',
            image: p.image_url,
            gallery: p.gallery || [],
            audio_guide_url: p.audio_guide_url,
            vr_360_url: p.vr_360_url,
            is_primary_route_point: p.is_primary_route_point ?? true,
            walk_time: p.walk_time || 'A pie',
            rating: '4.9 ★',
            lat: p.lat ? parseFloat(p.lat) : 12.4350,
            lng: p.lng ? parseFloat(p.lng) : -86.8782,
            points_reward: p.points_reward || 50,
            is_active: p.status === 'active',
            order_num: p.order_num || 1,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching route places from Supabase:', err);
    }
    return [];
  },

  async createRoutePlace(data: Partial<RoutePlaceItem>): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase.from('route_places').insert([
          {
            route_id: data.route_id,
            municipality_id: data.municipality_id,
            name: data.name,
            slug: data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: data.description,
            category: data.category || 'Patrimonio Cultural',
            icon_name: data.icon_name || 'MapPin',
            image_url: data.image,
            gallery: data.gallery || [],
            audio_guide_url: data.audio_guide_url,
            vr_360_url: data.vr_360_url,
            is_primary_route_point: data.is_primary_route_point ?? true,
            walk_time: data.walk_time || '5 min a pie',
            lat: data.lat || 12.4350,
            lng: data.lng || -86.8782,
            points_reward: data.points_reward || 50,
            order_num: data.order_num || 1,
            status: 'active',
          },
        ]);
        return !error;
      }
    } catch (err) {
      console.error('Error creating route place in Supabase:', err);
    }
    return false;
  },

  async updateRoutePlace(id: string, updates: Partial<RoutePlaceItem>): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('route_places')
          .update({
            name: updates.name,
            description: updates.description,
            category: updates.category,
            icon_name: updates.icon_name,
            image_url: updates.image,
            gallery: updates.gallery,
            audio_guide_url: updates.audio_guide_url,
            vr_360_url: updates.vr_360_url,
            is_primary_route_point: updates.is_primary_route_point,
            walk_time: updates.walk_time,
            lat: updates.lat,
            lng: updates.lng,
            points_reward: updates.points_reward,
            order_num: updates.order_num,
          })
          .eq('id', id);
        return !error;
      }
    } catch (err) {
      console.error('Error updating place in Supabase:', err);
    }
    return false;
  },

  async togglePrimaryRoutePlace(placeId: string, isPrimary: boolean): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('route_places')
          .update({ is_primary_route_point: isPrimary })
          .eq('id', placeId);
        return !error;
      }
    } catch (err) {
      console.error('Error toggling primary place in Supabase:', err);
    }
    return false;
  },

  async deleteRoutePlace(id: string): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase.from('route_places').delete().eq('id', id);
        return !error;
      }
    } catch (err) {
      console.error('Error deleting place from Supabase:', err);
    }
    return false;
  },

  // 6. Solicitudes de Emprendedor y Aprobación en 1 Clic
  async getEntrepreneurRequests(): Promise<EntrepreneurRequestItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('entrepreneur_requests')
          .select(`
            id,
            user_id,
            department_id,
            municipality_id,
            business_name,
            business_type,
            category,
            motivation,
            description,
            address,
            phone,
            lat,
            lng,
            documents,
            status,
            created_at,
            users (
              name,
              lastname,
              email,
              avatar,
              city
            ),
            departments (
              name
            ),
            municipalities (
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((item: any) => ({
            id: item.id,
            user_id: item.user_id,
            user_name: item.users ? `${item.users.name} ${item.users.lastname}` : 'Emprendedor',
            user_email: item.users?.email || 'sin-correo',
            user_avatar: item.users?.avatar,
            department_id: item.department_id,
            department_name: item.departments?.name,
            municipality_id: item.municipality_id,
            municipality_name: item.municipalities?.name,
            request_type: 'entrepreneur',
            status: item.status || 'pending',
            motivation: item.motivation || '',
            business_name: item.business_name || 'Negocio Tradicional',
            business_type: item.business_type || 'fisico',
            category: item.category || 'Artesanías & Tradición',
            address: item.address,
            phone: item.phone,
            city: item.users?.city || 'León',
            lat: item.lat ? parseFloat(item.lat) : undefined,
            lng: item.lng ? parseFloat(item.lng) : undefined,
            documents: item.documents || [],
            created_at: item.created_at,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching requests from Supabase:', err);
    }
    return [];
  },

  async approveEntrepreneurRequest(requestId: string): Promise<{ success: boolean; message: string }> {
    try {
      if (supabase) {
        // 1. Obtener la solicitud
        const { data: req, error: reqErr } = await supabase
          .from('entrepreneur_requests')
          .select('*')
          .eq('id', requestId)
          .single();

        if (reqErr || !req) {
          return { success: false, message: 'No se encontró la solicitud en Supabase.' };
        }

        // 2. Actualizar estado de solicitud
        await supabase
          .from('entrepreneur_requests')
          .update({ status: 'approved', reviewed_at: new Date().toISOString() })
          .eq('id', requestId);

        // 3. Ascender rol del usuario a 'entrepreneur' y darle bono de 200 puntos
        await supabase
          .from('users')
          .update({ role: 'entrepreneur', points: 250 })
          .eq('id', req.user_id);

        // 4. Crear o actualizar ficha de emprendedor en public.entrepreneurs
        await supabase.from('entrepreneurs').upsert({
          user_id: req.user_id,
          municipality_id: req.municipality_id,
          business_name: req.business_name,
          business_type: req.business_type || 'fisico',
          category: req.category || 'Artesanías & Tradición',
          description: req.description || req.motivation,
          address: req.address,
          phone: req.phone,
          is_verified: true,
          status: 'active',
        }, { onConflict: 'user_id' });

        // 5. Crear automáticamente punto secundario en el mapa si tiene coordenadas
        if (req.lat && req.lng) {
          await supabase.from('route_places').insert([{
            municipality_id: req.municipality_id,
            name: req.business_name,
            slug: req.business_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: req.description || req.motivation,
            category: req.category || 'Comercio Local',
            is_primary_route_point: false, // Punto secundario comercial/cultural
            lat: req.lat,
            lng: req.lng,
            address: req.address,
            points_reward: 50,
            status: 'active',
          }]);
        }

        return { success: true, message: `¡Solicitud de ${req.business_name} aprobada con éxito!` };
      }
    } catch (err: any) {
      console.error('Error approving request in Supabase:', err);
      return { success: false, message: err.message || 'Error en la aprobación.' };
    }
    return { success: false, message: 'No hay conexión con Supabase.' };
  },

  async rejectEntrepreneurRequest(requestId: string, reason: string): Promise<{ success: boolean; message: string }> {
    try {
      if (supabase) {
        await supabase
          .from('entrepreneur_requests')
          .update({ status: 'rejected', admin_notes: reason, reviewed_at: new Date().toISOString() })
          .eq('id', requestId);
        return { success: true, message: 'Solicitud rechazada.' };
      }
    } catch (err: any) {
      return { success: false, message: err.message };
    }
    return { success: false, message: 'No hay conexión con Supabase.' };
  },

  // 7. Eventos Culturales
  async getEvents(): Promise<AdminEventItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('entrepreneur_events')
          .select(`
            id,
            title,
            description,
            category,
            start_date,
            end_date,
            location_name,
            image_url,
            points_reward,
            status,
            municipalities (
              name
            ),
            departments (
              name
            )
          `)
          .order('start_date', { ascending: true });

        if (!error && data) {
          return data.map((e: any) => ({
            id: e.id,
            title: e.title,
            description: e.description || '',
            start_date: e.start_date,
            end_date: e.end_date,
            location_name: e.location_name || 'Nicaragua',
            city: e.municipalities?.name || 'León',
            department: e.departments?.name || 'León',
            category: e.category || 'Tradición & Folclore',
            status: e.status || 'published',
            image: e.image_url,
            points_reward: e.points_reward || 100,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching events from Supabase:', err);
    }
    return [];
  },

  async createEvent(event: Partial<AdminEventItem>): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase.from('entrepreneur_events').insert([{
          title: event.title,
          description: event.description,
          category: event.category || 'Tradición & Folclore',
          start_date: event.start_date || new Date().toISOString(),
          end_date: event.end_date || new Date().toISOString(),
          location_name: event.location_name,
          image_url: event.image,
          points_reward: event.points_reward || 100,
          status: event.status || 'published',
        }]);
        return !error;
      }
    } catch (err) {
      console.error('Error creating event in Supabase:', err);
    }
    return false;
  },

  async deleteEvent(id: string): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase.from('entrepreneur_events').delete().eq('id', id);
        return !error;
      }
    } catch (err) {
      console.error('Error deleting event from Supabase:', err);
    }
    return false;
  },

  // 8. Usuarios y Roles
  async getUsers(): Promise<AdminUserItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('users')
          .select(`
            id,
            name,
            lastname,
            email,
            role,
            status,
            points,
            level,
            city,
            department,
            assigned_department_id,
            avatar,
            created_at
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((u: any) => ({
            id: u.id,
            name: u.name || 'Usuario',
            lastname: u.lastname || '',
            email: u.email,
            role: u.role || 'user',
            status: u.status || 'active',
            points: u.points || 0,
            level: u.level || 1,
            city: u.city || 'León',
            department: u.department || 'León',
            assigned_department_id: u.assigned_department_id,
            avatar: u.avatar,
            created_at: u.created_at,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching users from Supabase:', err);
    }
    return [];
  },

  async updateUserRole(userId: string, role: 'user' | 'entrepreneur' | 'department_manager' | 'admin', departmentId?: string): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('users')
          .update({
            role,
            assigned_department_id: departmentId || null,
          })
          .eq('id', userId);
        return !error;
      }
    } catch (err) {
      console.error('Error updating user role in Supabase:', err);
    }
    return false;
  },

  async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'pending'): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('users')
          .update({ status })
          .eq('id', userId);
        return !error;
      }
    } catch (err) {
      console.error('Error updating user status in Supabase:', err);
    }
    return false;
  },

  async adjustUserPoints(userId: string, deltaPoints: number): Promise<boolean> {
    try {
      if (supabase) {
        const { data: u } = await supabase.from('users').select('points').eq('id', userId).single();
        const currentPoints = u?.points || 0;
        const newPoints = Math.max(0, currentPoints + deltaPoints);
        const { error } = await supabase
          .from('users')
          .update({ points: newPoints })
          .eq('id', userId);
        return !error;
      }
    } catch (err) {
      console.error('Error adjusting points in Supabase:', err);
    }
    return false;
  },

  // 9. Logros de Gamificación
  async getAchievements(): Promise<AchievementItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .order('points_reward', { ascending: false });

        if (!error && data) {
          return data.map((a: any) => ({
            id: a.id,
            name: a.name,
            slug: a.slug,
            description: a.description,
            achievement_type: a.achievement_type || 'ruta',
            icon: a.icon || '🏆',
            points_reward: a.points_reward || 100,
            required_count: a.required_count || 1,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching achievements from Supabase:', err);
    }
    return [];
  },

  async createAchievement(data: Partial<AchievementItem>): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase.from('achievements').insert([{
          name: data.name,
          slug: data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: data.description,
          achievement_type: data.achievement_type || 'ruta',
          icon: data.icon || '🏆',
          points_reward: data.points_reward || 100,
          required_count: data.required_count || 1,
        }]);
        return !error;
      }
    } catch (err) {
      console.error('Error creating achievement in Supabase:', err);
    }
    return false;
  },

  // 10. Reportes y Moderación
  async getReports(): Promise<ReportItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('reports')
          .select(`
            id,
            reported_by,
            target_type,
            target_id,
            reason,
            status,
            created_at,
            users:reported_by (
              name,
              lastname,
              email
            )
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((r: any) => ({
            id: r.id,
            reported_by_name: r.users ? `${r.users.name} ${r.users.lastname}` : 'Usuario',
            reported_by_email: r.users?.email || '',
            target_type: r.target_type,
            target_id: r.target_id,
            reason: r.reason,
            status: r.status,
            created_at: r.created_at,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching reports from Supabase:', err);
    }
    return [];
  },

  async resolveReport(id: string, status: 'resolved' | 'dismissed'): Promise<boolean> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('reports')
          .update({ status })
          .eq('id', id);
        return !error;
      }
    } catch (err) {
      console.error('Error resolving report in Supabase:', err);
    }
    return false;
  },

  async confirmEventAttendance(userId: string, eventId: string, pointsReward: number = 100): Promise<{ success: boolean; message: string; pointsEarned: number }> {
    try {
      if (supabase && userId) {
        // Otorgar puntos al usuario
        await this.adjustUserPoints(userId, pointsReward);
        return {
          success: true,
          message: `¡Asistencia confirmada con éxito! Has ganado +${pointsReward} puntos de explorador cultural.`,
          pointsEarned: pointsReward,
        };
      }
    } catch (err: any) {
      console.error('Error confirming attendance:', err);
      return { success: false, message: 'No se pudo registrar la asistencia.', pointsEarned: 0 };
    }
    return { success: false, message: 'Inicia sesión para ganar puntos por asistir.', pointsEarned: 0 };
  },
};
