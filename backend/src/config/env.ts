import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  SUPABASE: {
    URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  MONGODB: {
    URI: process.env.MONGODB_URI || '',
    DB_NAME: process.env.MONGODB_DB_NAME || 'stateless_db',
  },
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT: {
    SECRET: process.env.JWT_SECRET || 'roots-super-secret-jwt-key-hackathon-2026',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },
};
