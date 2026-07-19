import { readFile, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) continue;
      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  } catch {
    // Ignore if the env file is not available.
  }
}

loadEnvFile(path.join(rootDir, '.env.local'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials are not defined');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function loadJson(fileName) {
  const filePath = path.join(rootDir, 'public', 'data', fileName);
  const content = await new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
  return JSON.parse(content);
}

function toGeoJsonGeometry(geometry) {
  return JSON.stringify(geometry);
}

async function main() {
  try {
    const departamentosData = await loadJson('departamentos_limpios.json');
    const ciudadesData = await loadJson('ciudades_limpias.json');

    const departamentosToInsert = departamentosData.features.map((feature) => ({
      name: feature.properties?.name || null,
      slug: (feature.properties?.name || 'departamento').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: `Departamento importado desde JSON: ${feature.properties?.name || 'Sin nombre'}`,
      is_creative_region: false,
      geom: toGeoJsonGeometry(feature.geometry),
      created_at: new Date().toISOString()
    }));

    const ciudadesToInsert = ciudadesData.features.map((feature) => ({
      name: feature.properties?.nombre || null,
      slug: (feature.properties?.nombre || 'municipio').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: feature.properties?.descripcion || null,
      is_creative: (feature.properties?.tipo || '').toLowerCase() === 'creativa',
      municipality_type: feature.properties?.tipo || 'tradicional',
      geom: toGeoJsonGeometry(feature.geometry),
      department_name: feature.properties?.departamento || null,
      status: feature.properties?.status || 'active',
      created_at: new Date().toISOString()
    }));

    const { error: clearError } = await supabase.from('departments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (clearError) throw clearError;

    const { error: clearCitiesError } = await supabase.from('municipalities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (clearCitiesError) throw clearCitiesError;

    const { error: departmentsError } = await supabase.from('departments').insert(departamentosToInsert);
    if (departmentsError) throw departmentsError;

    const { error: municipalitiesError } = await supabase.from('municipalities').insert(ciudadesToInsert);
    if (municipalitiesError) throw municipalitiesError;

    console.log(`Imported ${departamentosToInsert.length} departments and ${ciudadesToInsert.length} municipalities.`);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

main();
