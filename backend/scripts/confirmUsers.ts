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

async function confirmAllUsers() {
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) {
    console.error('Error listing users:', error);
    return;
  }
  
  for (const u of users) {
    if (!u.email_confirmed_at) {
      console.log(`Confirming user: ${u.email}...`);
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(u.id, {
        email_confirm: true
      });
      if (updateErr) {
        console.error(`Error confirming ${u.email}:`, updateErr);
      } else {
        console.log(`✅ ${u.email} successfully confirmed!`);
      }
    } else {
      console.log(`User ${u.email} was already confirmed.`);
    }
  }
}

confirmAllUsers();
