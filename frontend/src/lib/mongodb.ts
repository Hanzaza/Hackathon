import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

export async function getMongoClient() {
  if (!uri) {
    throw new Error('Por favor, define la variable de entorno MONGODB_URI en .env.local');
  }

  if (!clientPromise) {
    client = new MongoClient(uri, options);

    if (process.env.NODE_ENV === 'development') {
      const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
      };

      if (!globalWithMongo._mongoClientPromise) {
        globalWithMongo._mongoClientPromise = client.connect();
      }
      clientPromise = globalWithMongo._mongoClientPromise;
    } else {
      clientPromise = client.connect();
    }
  }

  return clientPromise;
}

export default getMongoClient;