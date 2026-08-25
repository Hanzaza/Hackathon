import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { getSupabaseClient } from './supabaseService.js';
import {
  RegisterDTO,
  LoginDTO,
  AuthResponse,
  UserProfile,
  UserEntity,
  JWTPayload,
} from '../types/index.js';

// Cache en memoria para entornos locales / offline
const memoryUsers = new Map<string, UserEntity>();

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, ENV.JWT.SECRET, {
    expiresIn: ENV.JWT.EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function sanitizeUser(user: UserEntity): UserProfile {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...profile } = user;
  return profile;
}

export async function registerUser(dto: RegisterDTO): Promise<AuthResponse> {
  const email = dto.email.trim().toLowerCase();

  // Validaciones básicas
  if (!email || !dto.password || !dto.name || !dto.lastname) {
    throw new Error('Todos los campos obligatorios (nombre, apellido, email, contraseña) deben estar presentes.');
  }

  if (dto.password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres.');
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(dto.password, salt);

  const newUser: UserEntity = {
    id: crypto.randomUUID(),
    name: dto.name.trim(),
    lastname: dto.lastname.trim(),
    email,
    password_hash,
    avatar: dto.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
    role: dto.role || 'user',
    status: 'active',
    points: 0,
    level: 1,
    bio: '',
    country: dto.country || 'Nicaragua',
    city: dto.city || 'León',
    favorite_categories: dto.favorite_categories || [],
    notifications_enabled: true,
    created_at: new Date().toISOString(),
  };

  // Intentar guardar en Supabase si está disponible
  try {
    const supabase = getSupabaseClient();
    
    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }

    const { error: insertError } = await supabase
      .from('users')
      .insert([newUser]);

    if (insertError) {
      console.warn('Advertencia al insertar en Supabase users, guardando en memoria:', insertError.message);
      memoryUsers.set(email, newUser);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('ya se encuentra registrado')) {
      throw err;
    }
    console.warn('Supabase no conectado o tabla no inicializada. Usando almacenamiento local en memoria:', message);
    if (memoryUsers.has(email)) {
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }
    memoryUsers.set(email, newUser);
  }

  const token = generateToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  return {
    user: sanitizeUser(newUser),
    token,
    expiresIn: ENV.JWT.EXPIRES_IN,
  };
}

export async function loginUser(dto: LoginDTO): Promise<AuthResponse> {
  const email = dto.email.trim().toLowerCase();

  if (!email || !dto.password) {
    throw new Error('El correo electrónico y la contraseña son requeridos.');
  }

  let user: UserEntity | null = null;

  // 1. Buscar en Supabase
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!error && data) {
      user = data as UserEntity;
    }
  } catch {
    console.warn('No se pudo consultar Supabase para login, verificando almacenamiento local en memoria...');
  }

  // 2. Fallback a memoria si no se encontró en Supabase
  if (!user && memoryUsers.has(email)) {
    user = memoryUsers.get(email)!;
  }

  if (!user) {
    throw new Error('Credenciales inválidas. Por favor verifica tu correo y contraseña.');
  }

  if (user.status === 'inactive') {
    throw new Error('Tu cuenta se encuentra inactiva. Contacta al administrador.');
  }

  // 3. Comparar contraseña
  const isMatch = await bcrypt.compare(dto.password, user.password_hash);
  if (!isMatch) {
    throw new Error('Credenciales inválidas. Por favor verifica tu correo y contraseña.');
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: sanitizeUser(user),
    token,
    expiresIn: ENV.JWT.EXPIRES_IN,
  };
}

export async function getUserById(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      return sanitizeUser(data as UserEntity);
    }
  } catch {
    // Silently continue to memory check
  }

  for (const user of memoryUsers.values()) {
    if (user.id === userId) {
      return sanitizeUser(user);
    }
  }

  return null;
}
