import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { users } from '../db/user.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  async createUser(clerkId: string, email: string) {
    const [user] = await db()
      .insert(users)
      .values({
        clerkId,
        email,
      })
      .returning();

    return user;
  }

  async updateUser(clerkId: string, data: { email?: string }) {
    const [user] = await db()
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, clerkId))
      .returning();

    return user;
  }

  async deleteUser(clerkId: string) {
    await db().delete(users).where(eq(users.clerkId, clerkId));
  }

  async getUserByClerkId(clerkId: string) {
    const [user] = await db()
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId));
    return user;
  }

  async getUserByEmail(email: string) {
    const [user] = await db()
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }
}
