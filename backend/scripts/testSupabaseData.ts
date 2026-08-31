import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_ANON_KEY exists:', !!supabaseAnonKey);

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log('\n--- 1. Testing Anon Client on departments ---');
  const dAnon = await supabaseAnon.from('departments').select('*');
  console.log('Anon departments count:', dAnon.data?.length, 'error:', dAnon.error);

  console.log('\n--- 2. Testing Anon Client on municipalities ---');
  const mAnon = await supabaseAnon.from('municipalities').select('*');
  console.log('Anon municipalities count:', mAnon.data?.length, 'error:', mAnon.error);

  console.log('\n--- 3. Testing Anon Client on route_places ---');
  const rAnon = await supabaseAnon.from('route_places').select('*');
  console.log('Anon route_places count:', rAnon.data?.length, 'error:', rAnon.error);

  console.log('\n--- 4. Testing Admin Client on departments ---');
  const dAdmin = await supabaseAdmin.from('departments').select('*');
  console.log('Admin departments count:', dAdmin.data?.length, 'error:', dAdmin.error);
}

run().catch(console.error);
