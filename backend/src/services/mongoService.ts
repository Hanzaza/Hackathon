import { MongoClient } from 'mongodb';
import { ENV } from '../config/env.js';

let client: MongoClient | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (!ENV.MONGODB.URI) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  if (!client) {
    client = new MongoClient(ENV.MONGODB.URI);
    await client.connect();
  }

  return client;
}

export async function getInfrastructureGeoJSON() {
  const mongoClient = await getMongoClient();
  const db = mongoClient.db(ENV.MONGODB.DB_NAME);
  const infraestructura = await db.collection('infraestructura').find({}).toArray();

  if (!infraestructura || infraestructura.length === 0) {
    return { type: 'FeatureCollection' as const, features: [] };
  }

  return {
    type: 'FeatureCollection' as const,
    features: infraestructura.map((loc) => ({
      type: 'Feature' as const,
      properties: {
        id: loc._id.toString(),
        name: loc.name || 'Punto sin nombre',
        tipo: loc.tipo || 'Desconocido',
        status: loc.status || 'Inactivo',
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [loc.coordinates?.lng || 0, loc.coordinates?.lat || 0],
      },
    })),
  };
}
