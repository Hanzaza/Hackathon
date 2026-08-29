import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function checkPublicUsers() {
  console.log('--- Checking auth.users ---');
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
  if (authError) {
    console.error('Error fetching auth.users:', authError);
  } else {
    console.log(`Found ${authData.users.length} in auth.users:`);
    authData.users.forEach(u => console.log(`- [${u.id}] ${u.email} (Confirmed: ${u.email_confirmed_at}) metadata:`, u.user_metadata));
  }

  console.log('\n--- Checking public.users ---');
  const { data: publicData, error: publicError } = await supabaseAdmin
    .from('users')
    .select('*');
    
  if (publicError) {
    console.error('Error fetching public.users:', publicError);
  } else {
    console.log(`Found ${publicData.length} in public.users:`);
    publicData.forEach(u => console.log(`- [${u.id}] ${u.name} ${u.lastname} | ${u.email} | Role: ${u.role}`));
  }
}

checkPublicUsers();
