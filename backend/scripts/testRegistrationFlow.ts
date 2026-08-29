import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseAnon = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testUserRegistration() {
  const testEmail = `test_${Date.now()}@roots.ni`;
  const testPassword = 'Password123!';
  
  console.log(`1. Testing signUp with anon client for: ${testEmail}...`);
  const { data: signUpData, error: signUpError } = await supabaseAnon.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        name: 'Prueba',
        lastname: 'Automatica',
        role: 'user',
        city: 'León'
      }
    }
  });

  if (signUpError) {
    console.error('❌ Error during signUp:', signUpError);
    return;
  }

  console.log('✅ signUp success!');
  console.log('Session present?', !!signUpData.session);
  console.log('User id:', signUpData.user?.id);
  console.log('User confirmed_at:', signUpData.user?.confirmed_at || (signUpData.user as any)?.email_confirmed_at);

  console.log('\n2. Checking if record was created in public.users...');
  const { data: publicUser, error: publicError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', signUpData.user?.id)
    .maybeSingle();

  if (publicError) {
    console.error('❌ Error reading public.users:', publicError);
  } else if (!publicUser) {
    console.warn('⚠️ User NOT FOUND in public.users! The trigger on_auth_user_created might NOT be active or failing.');
  } else {
    console.log('✅ User FOUND in public.users:', publicUser);
  }

  // Cleanup
  if (signUpData.user?.id) {
    console.log('\n3. Cleaning up test user...');
    await supabaseAdmin.auth.admin.deleteUser(signUpData.user.id);
    console.log('Cleaned up.');
  }
}

testUserRegistration();
