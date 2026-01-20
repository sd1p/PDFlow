import { timestamp, uuid } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate UUID
const generateUuid = (): string => {
  return uuidv4();
};

// Base schema helper for common fields
export const baseSchema = {
  id: uuid('id').primaryKey().$defaultFn(generateUuid),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate((): Date => new Date()),
};
