import { AchievementItem, adminService } from './adminService';
import { supabase } from '../lib/supabase';

export interface PlaceProgress {
  placeId: string;
  hasReview: boolean;
  reviewRating?: number;
  reviewComment?: string;
  hasPhoto: boolean;
  photoUrl?: string;
  isCompleted: boolean; // true ÚNICAMENTE cuando hasReview && hasPhoto son true
  completedAt?: string;
}

export interface RouteProgressData {
  routeId: string;
  totalPlaces: number;
  completedPlacesCount: number;
  places: Record<string, PlaceProgress>;
  progressPercent: number; // 0 a 100%
  isCompleted: boolean;
  unlockedAchievement?: AchievementItem | null;
  unlockedAt?: string;
}

const STORAGE_KEY_PREFIX = 'roots_user_route_progress_';
const UNLOCKED_ACHIEVEMENTS_KEY = 'roots_unlocked_achievements_';

class RouteProgressService {
  private getStorageKey(userId: string): string {
    const safeUser = userId || 'anonymous_explorer';
    return `${STORAGE_KEY_PREFIX}${safeUser}`;
  }

  private getAchievementsKey(userId: string): string {
    const safeUser = userId || 'anonymous_explorer';
    return `${UNLOCKED_ACHIEVEMENTS_KEY}${safeUser}`;
  }

  private loadStoredData(userId: string): Record<string, RouteProgressData> {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(this.getStorageKey(userId));
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveStoredData(userId: string, data: Record<string, RouteProgressData>): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(data));
    } catch (e) {
      console.error('Error saving route progress to storage:', e);
    }
  }

  // Obtener lista de IDs de logros desbloqueados por el usuario
  getUserUnlockedAchievements(userId: string): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.getAchievementsKey(userId));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private markAchievementUnlocked(userId: string, achievementId: string): void {
    if (typeof window === 'undefined' || !achievementId) return;
    try {
      const current = this.getUserUnlockedAchievements(userId);
      if (!current.includes(achievementId)) {
        current.push(achievementId);
        localStorage.setItem(this.getAchievementsKey(userId), JSON.stringify(current));
      }
    } catch (e) {
      console.error('Error storing unlocked achievement:', e);
    }
  }

  // Obtener progreso detallado de una ruta creativa para un usuario
  getRouteProgress(
    userId: string,
    routeId: string,
    routePlaces: Array<{ id: string; name?: string }>
  ): RouteProgressData {
    const allData = this.loadStoredData(userId);
    const existing = allData[routeId];

    const totalPlaces = routePlaces.length;
    const placesRecord: Record<string, PlaceProgress> = existing?.places || {};

    // Asegurar que cada lugar tenga un objeto de progreso inicial
    routePlaces.forEach((p) => {
      if (!placesRecord[p.id]) {
        placesRecord[p.id] = {
          placeId: p.id,
          hasReview: false,
          hasPhoto: false,
          isCompleted: false,
        };
      }
    });

    const completedPlacesCount = routePlaces.filter(
      (p) => placesRecord[p.id]?.hasReview && placesRecord[p.id]?.hasPhoto
    ).length;

    const progressPercent = totalPlaces > 0 ? Math.round((completedPlacesCount / totalPlaces) * 100) : 0;
    const isCompleted = totalPlaces > 0 && completedPlacesCount === totalPlaces;

    const current: RouteProgressData = {
      routeId,
      totalPlaces,
      completedPlacesCount,
      places: placesRecord,
      progressPercent,
      isCompleted,
      unlockedAchievement: existing?.unlockedAchievement || null,
      unlockedAt: existing?.unlockedAt || (isCompleted ? new Date().toISOString() : undefined),
    };

    allData[routeId] = current;
    this.saveStoredData(userId, allData);
    return current;
  }

  // Registrar paso 1: Reseña y comentario
  async submitPlaceReview(params: {
    userId: string;
    userRole?: string;
    routeId: string;
    placeId: string;
    rating: number;
    comment: string;
    authorName?: string;
    allRoutePlaces: Array<{ id: string; name?: string }>;
  }): Promise<{
    placeProgress: PlaceProgress;
    routeProgress: RouteProgressData;
    newlyUnlockedAchievement: AchievementItem | null;
  }> {
    const { userId, userRole, routeId, placeId, rating, comment, allRoutePlaces } = params;
    const allData = this.loadStoredData(userId);
    const routeProg = this.getRouteProgress(userId, routeId, allRoutePlaces);

    const prevPlace = routeProg.places[placeId] || {
      placeId,
      hasReview: false,
      hasPhoto: false,
      isCompleted: false,
    };

    const hasReview = true;
    const hasPhoto = prevPlace.hasPhoto;
    const isCompleted = hasReview && hasPhoto;

    const updatedPlace: PlaceProgress = {
      ...prevPlace,
      hasReview,
      reviewRating: rating,
      reviewComment: comment,
      isCompleted,
      completedAt: isCompleted ? (prevPlace.completedAt || new Date().toISOString()) : undefined,
    };

    routeProg.places[placeId] = updatedPlace;

    // Recalcular progreso de la ruta
    const completedCount = allRoutePlaces.filter(
      (p) => routeProg.places[p.id]?.hasReview && routeProg.places[p.id]?.hasPhoto
    ).length;

    const totalPlaces = allRoutePlaces.length;
    const routeCompleted = totalPlaces > 0 && completedCount === totalPlaces;
    const wasAlreadyCompleted = routeProg.isCompleted;

    routeProg.completedPlacesCount = completedCount;
    routeProg.progressPercent = totalPlaces > 0 ? Math.round((completedCount / totalPlaces) * 100) : 0;
    routeProg.isCompleted = routeCompleted;

    let newlyUnlockedAchievement: AchievementItem | null = null;

    // Si la ruta se acaba de completar al 100%, desbloquear la insignia vinculada
    if (routeCompleted && !wasAlreadyCompleted) {
      newlyUnlockedAchievement = await this.awardRouteAchievement(userId, userRole, routeId);
      if (newlyUnlockedAchievement) {
        routeProg.unlockedAchievement = newlyUnlockedAchievement;
        routeProg.unlockedAt = new Date().toISOString();
      }
    }

    allData[routeId] = routeProg;
    this.saveStoredData(userId, allData);

    return {
      placeProgress: updatedPlace,
      routeProgress: routeProg,
      newlyUnlockedAchievement,
    };
  }

  // Registrar paso 2: Colaboración fotográfica
  async submitPlacePhoto(params: {
    userId: string;
    userRole?: string;
    routeId: string;
    placeId: string;
    photoUrl: string;
    allRoutePlaces: Array<{ id: string; name?: string }>;
  }): Promise<{
    placeProgress: PlaceProgress;
    routeProgress: RouteProgressData;
    newlyUnlockedAchievement: AchievementItem | null;
  }> {
    const { userId, userRole, routeId, placeId, photoUrl, allRoutePlaces } = params;
    const allData = this.loadStoredData(userId);
    const routeProg = this.getRouteProgress(userId, routeId, allRoutePlaces);

    const prevPlace = routeProg.places[placeId] || {
      placeId,
      hasReview: false,
      hasPhoto: false,
      isCompleted: false,
    };

    const hasReview = prevPlace.hasReview;
    const hasPhoto = true;
    const isCompleted = hasReview && hasPhoto;

    const updatedPlace: PlaceProgress = {
      ...prevPlace,
      hasPhoto,
      photoUrl,
      isCompleted,
      completedAt: isCompleted ? (prevPlace.completedAt || new Date().toISOString()) : undefined,
    };

    routeProg.places[placeId] = updatedPlace;

    // Recalcular progreso de la ruta
    const completedCount = allRoutePlaces.filter(
      (p) => routeProg.places[p.id]?.hasReview && routeProg.places[p.id]?.hasPhoto
    ).length;

    const totalPlaces = allRoutePlaces.length;
    const routeCompleted = totalPlaces > 0 && completedCount === totalPlaces;
    const wasAlreadyCompleted = routeProg.isCompleted;

    routeProg.completedPlacesCount = completedCount;
    routeProg.progressPercent = totalPlaces > 0 ? Math.round((completedCount / totalPlaces) * 100) : 0;
    routeProg.isCompleted = routeCompleted;

    let newlyUnlockedAchievement: AchievementItem | null = null;

    // Si la ruta se acaba de completar al 100%, desbloquear la insignia vinculada
    if (routeCompleted && !wasAlreadyCompleted) {
      newlyUnlockedAchievement = await this.awardRouteAchievement(userId, userRole, routeId);
      if (newlyUnlockedAchievement) {
        routeProg.unlockedAchievement = newlyUnlockedAchievement;
        routeProg.unlockedAt = new Date().toISOString();
      }
    }

    allData[routeId] = routeProg;
    this.saveStoredData(userId, allData);

    return {
      placeProgress: updatedPlace,
      routeProgress: routeProg,
      newlyUnlockedAchievement,
    };
  }

  // Desbloquear logro vinculado a la ruta y otorgar puntos al explorador (los administradores NO reciben gamificación)
  private async awardRouteAchievement(
    userId: string,
    userRole: string | undefined,
    routeId: string
  ): Promise<AchievementItem | null> {
    try {
      const achievements = await adminService.getAchievements();
      
      // Buscar logro vinculado directamente por route_id o tipo 'ruta'
      let matchingAch = achievements.find(
        (a) => a.achievement_type === 'ruta' && (a.route_id === routeId)
      );

      // Si no hay vinculación explícita exacta, tomar el primer logro de ruta relevante
      if (!matchingAch) {
        matchingAch = achievements.find((a) => a.achievement_type === 'ruta');
      }

      if (!matchingAch) return null;

      // Registrar logro desbloqueado
      this.markAchievementUnlocked(userId, matchingAch.id);

      // IMPORTANTE: El administrador NO debe tener gamificación ni puntos
      const isAdmin = userRole === 'admin';
      const pointsToAward = isAdmin ? 0 : matchingAch.points_reward;

      if (!isAdmin && pointsToAward > 0) {
        this.addPointsToUser(userId, pointsToAward);
      }

      // Notificar evento global en el navegador para feedback sonoro o visual
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('roots:achievement-unlocked', {
          detail: {
            achievement: matchingAch,
            routeId,
            pointsAwarded: pointsToAward,
            isAdmin,
          },
        });
        window.dispatchEvent(event);
      }

      return matchingAch;
    } catch (err) {
      console.error('Error awarding route achievement:', err);
      return null;
    }
  }

  // Sumar puntos al explorador en sesión y en Supabase
  private async addPointsToUser(userId: string, points: number): Promise<void> {
    if (!userId || points <= 0) return;

    try {
      if (supabase) {
        const { data: userRecord } = await supabase
          .from('users')
          .select('id, points, level, role')
          .eq('id', userId)
          .maybeSingle();

        if (userRecord && userRecord.role !== 'admin') {
          const currentPoints = Number(userRecord.points) || 0;
          const newPoints = currentPoints + points;
          const newLevel = Math.max(1, Math.floor(newPoints / 200) + 1);

          await supabase
            .from('users')
            .update({ points: newPoints, level: newLevel })
            .eq('id', userId);
        }
      }
    } catch (err) {
      console.error('Error updating points in Supabase:', err);
    }
  }
}

export const routeProgressService = new RouteProgressService();
