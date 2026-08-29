import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testSupabaseTables() {
  console.log('Testing Supabase REST API directly at:', process.env.SUPABASE_URL);

  // 1. Try to insert into public.users via Supabase REST API
  const testId = '00000000-0000-0000-0000-000000000001';
  const { data: insertData, error: insertError } = await supabaseAdmin
    .from('users')
    .insert([
      {
        id: testId,
        name: 'Test',
        lastname: 'Direct',
        email: 'test_direct@roots.ni',
        role: 'user',
        city: 'León'
      }
    ])
    .select();

  if (insertError) {
    console.error('❌ Insert error on Supabase REST:', insertError);
  } else {
    console.log('✅ Insert SUCCESS on Supabase REST:', insertData);
    // Cleanup
    await supabaseAdmin.from('users').delete().eq('id', testId);
    console.log('Cleaned up test row.');
  }

  // 2. Select from users
  const { data: selectData, error: selectError } = await supabaseAdmin
    .from('users')
    .select('*');

  if (selectError) {
    console.error('❌ Select error on Supabase REST:', selectError);
  } else {
    console.log(`✅ Current users count in Supabase REST: ${selectData.length}`);
  }
}

testSupabaseTables();
