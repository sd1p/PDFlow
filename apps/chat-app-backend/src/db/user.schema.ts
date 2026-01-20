import { pgTable, text } from 'drizzle-orm/pg-core';
import { baseSchema } from './base';

export const users = pgTable('users', {
  ...baseSchema,
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
