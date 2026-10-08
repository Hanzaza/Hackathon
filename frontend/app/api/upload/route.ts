import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'El archivo debe ser una imagen válida (PNG, JPG, WEBP, SVG)' }, { status: 400 });
    }

    // Validar tamaño máximo (20MB)
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'La imagen excede el límite de 20MB' }, { status: 400 });
    }

    const supabase = getAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generar nombre de archivo único y limpio
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const fileName = `${folder}/${Date.now()}_${cleanName}.${extension}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error('Error al subir imagen a Supabase Storage:', error);
      return NextResponse.json({ error: `Error en Storage: ${error.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error: any) {
    console.error('Error en POST /api/upload:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al procesar la subida de imagen' },
      { status: 500 }
    );
  }
}
