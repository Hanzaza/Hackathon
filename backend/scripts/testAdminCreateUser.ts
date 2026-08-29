import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testAdminCreateUser() {
  const testEmail = `test_admin_${Date.now()}@roots.ni`;
  console.log(`1. Creating user via admin for: ${testEmail}...`);
  
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email: testEmail,
    password: 'Password123!',
    email_confirm: true,
    user_metadata: {
      name: 'Admin',
      lastname: 'Tester',
      role: 'user',
      city: 'León'
    }
  });

  if (userError) {
    console.error('❌ Error creating user:', userError);
    return;
  }

  console.log('✅ Auth user created. ID:', userData.user.id);

  console.log('2. Checking if record exists in public.users...');
  const { data: publicUser, error: publicError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (publicError) {
    console.error('❌ Error checking public.users:', publicError);
  } else if (!publicUser) {
    console.warn('⚠️ User NOT FOUND in public.users! Trigger is missing or RLS blocking.');
  } else {
    console.log('✅ User FOUND in public.users:', publicUser);
  }

  // Cleanup
  console.log('3. Cleaning up...');
  await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
  console.log('Done.');
}

testAdminCreateUser();
