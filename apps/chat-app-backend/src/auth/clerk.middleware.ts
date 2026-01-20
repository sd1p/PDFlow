import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';

interface RequestWithAuth extends Request {
  auth?: {
    userId: string;
    sessionId: string;
  };
}

@Injectable()
export class ClerkAuthMiddleware implements NestMiddleware {
  async use(req: RequestWithAuth, _res: Response, next: NextFunction) {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');

    if (!sessionToken) {
      throw new UnauthorizedException('No session token provided');
    }

    try {
      const session = await clerkClient.sessions.verifySession(
        sessionToken,
        sessionToken,
      );

      if (!session) {
        throw new UnauthorizedException('Invalid session');
      }

      // Attach user info to request
      req.auth = {
        userId: session.userId,
        sessionId: session.id,
      };

      next();
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}
