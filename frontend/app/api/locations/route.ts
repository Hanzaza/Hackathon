import { NextResponse } from 'next/server';
import getMongoClient from '../../../src/lib/mongodb';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const client = await getMongoClient();
    const db = client.db('stateless_db');
    const infraestructura = await db.collection('infraestructura').find({}).toArray();

    // 3. Si la base de datos está vacía, devolvemos un GeoJSON vacío pero válido
    if (!infraestructura || infraestructura.length === 0) {
      return NextResponse.json({ type: 'FeatureCollection', features: [] });
    }

    // 4. Convertimos los documentos de MongoDB al formato GeoJSON que MapLibre necesita
    const geojson = {
      type: 'FeatureCollection',
      features: infraestructura.map((loc) => ({
        type: 'Feature',
        properties: {
          id: loc._id.toString(),
          name: loc.name || 'Punto sin nombre',
          tipo: loc.tipo || 'Desconocido',
          status: loc.status || 'Inactivo'
        },
        geometry: {
          type: 'Point',
          // Asegúrate de que en tu BD guardes las coordenadas así: coordinates: { lng: -86.8, lat: 12.4 }
          coordinates: [loc.coordinates?.lng || 0, loc.coordinates?.lat || 0] 
        }
      }))
    };

    return NextResponse.json(geojson);
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor al consultar la base de datos' }, 
      { status: 500 }
    );
  }
}