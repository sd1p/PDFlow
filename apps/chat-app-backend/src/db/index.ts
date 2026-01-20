import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './user.schema';

let dbInstance: ReturnType<typeof drizzle> | null = null;

export const db = () => {
  if (!dbInstance) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Create the connection
    const client = postgres(connectionString);

    // Create the database instance
    dbInstance = drizzle(client, { schema });
  }

  return dbInstance;
};
