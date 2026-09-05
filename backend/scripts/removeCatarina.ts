import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://zgjzwnbtfmkixqmnmxkw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function removeCatarina() {
  console.log('Eliminando/Actualizando Catarina de la lista de Ciudades Creativas...');

  // Buscar municipio catarina
  const { data: catarinaMun, error: findErr } = await supabase
    .from('municipalities')
    .select('id, name, slug')
    .ilike('slug', '%catarina%');

  if (findErr) {
    console.error('Error buscando Catarina:', findErr.message);
    return;
  }

  if (catarinaMun && catarinaMun.length > 0) {
    for (const mun of catarinaMun) {
      console.log(`Eliminando rutas para municipio ${mun.name} (${mun.id})...`);
      await supabase.from('creative_routes').delete().eq('municipality_id', mun.id);
      
      console.log(`Eliminando municipio ${mun.name} (${mun.id})...`);
      const { error: delErr } = await supabase.from('municipalities').delete().eq('id', mun.id);
      if (delErr) {
        console.log(`No se pudo eliminar por FK, actualizando a is_creative = false, status = disabled:`, delErr.message);
        await supabase.from('municipalities').update({
          is_creative: false,
          municipality_type: 'tradicional',
          status: 'disabled',
        }).eq('id', mun.id);
      } else {
        console.log(`Municipio ${mun.name} eliminado correctamente de la base de datos.`);
      }
    }
  } else {
    console.log('No se encontró Catarina en municipalities.');
  }

  console.log('¡Catarina removida exitosamente!');
}

removeCatarina()
  .catch(console.error)
  .finally(() => process.exit(0));
