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

async function testFullRegistrationAndDbSave() {
  const email = `usuario_${Date.now()}@roots.ni`;
  const password = 'Password123!';

  console.log(`1. Registrando en Supabase Auth: ${email}...`);
  const { data: authData, error: authErr } = await supabaseAnon.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: 'Carlos',
        lastname: 'Martínez',
        role: 'user',
        city: 'León'
      }
    }
  });

  if (authErr) {
    console.error('❌ Error en signUp:', authErr.message);
    return;
  }

  const userId = authData.user?.id;
  console.log(`✅ Usuario creado en Auth con ID: ${userId}`);

  // 2. Simular lo que hace AuthContext: upsert en public.users
  console.log('2. Guardando perfil en public.users (como hace el frontend)...');
  const { error: upsertErr } = await supabaseAnon.from('users').upsert([
    {
      id: userId,
      name: 'Carlos',
      lastname: 'Martínez',
      email: email,
      password_hash: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
      role: 'user',
      status: 'active',
      points: 50,
      level: 1,
      country: 'Nicaragua',
      city: 'León'
    }
  ]);

  if (upsertErr) {
    console.error('❌ Error en upsert de public.users:', upsertErr.message);
  } else {
    console.log('✅ Perfil guardado con éxito en public.users!');
  }

  // 3. Consultar la tabla public.users para verificar que existe
  console.log('3. Consultando public.users para confirmar persistencia...');
  const { data: userProfile, error: queryErr } = await supabaseAnon
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (queryErr) {
    console.error('❌ Error consultando usuario:', queryErr.message);
  } else {
    console.log('🎉 USUARIO CONFIRMADO EN BASE DE DATOS:', userProfile);
  }

  // Cleanup
  console.log('4. Limpiando usuario de prueba...');
  if (userId) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    await supabaseAdmin.from('users').delete().eq('id', userId);
  }
  console.log('Test finalizado.');
}

testFullRegistrationAndDbSave();
