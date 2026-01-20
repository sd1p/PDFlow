import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Webhook } from 'svix';

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('webhook')
  async handleWebhook(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Body() body: any,
  ) {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('CLERK_WEBHOOK_SECRET is not set');
    }

    // Verify the webhook
    const wh = new Webhook(webhookSecret);
    let evt: ClerkWebhookEvent;

    try {
      evt = wh.verify(JSON.stringify(body), {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkWebhookEvent;
    } catch {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const eventType = evt.type;
    const { id, email_addresses } = evt.data;

    // Handle different webhook events
    switch (eventType) {
      case 'user.created':
        await this.authService.createUser(
          id,
          email_addresses[0]?.email_address,
        );
        break;

      case 'user.updated':
        await this.authService.updateUser(id, {
          email: email_addresses[0]?.email_address,
        });
        break;

      case 'user.deleted':
        await this.authService.deleteUser(id);
        break;
    }

    return { success: true };
  }

  @Get('me')
  getCurrentUser(@Headers('authorization') authHeader: string) {
    // This endpoint requires authentication middleware
    // The user ID will be attached to the request by the middleware
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // In a real implementation, you would verify the token and get the user
    // For now, this is a placeholder
    return { message: 'User endpoint - implement token verification' };
  }
}
