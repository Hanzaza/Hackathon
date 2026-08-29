import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testSupabaseWithPasswordHash() {
  console.log('Testing Supabase REST with password_hash: ""...');

  const testId = '00000000-0000-0000-0000-000000000002';
  const { data: insertData, error: insertError } = await supabaseAdmin
    .from('users')
    .insert([
      {
        id: testId,
        name: 'Prueba',
        lastname: 'Exitosa',
        email: 'test_exitosa@roots.ni',
        password_hash: '',
        role: 'user',
        city: 'León',
        points: 50,
        level: 1,
        status: 'active'
      }
    ])
    .select();

  if (insertError) {
    console.error('❌ Insert error:', insertError);
  } else {
    console.log('✅ Insert SUCCESS! Row created:', insertData);
    // Cleanup
    await supabaseAdmin.from('users').delete().eq('id', testId);
    console.log('Cleaned up test row.');
  }
}

testSupabaseWithPasswordHash();
