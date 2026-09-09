import { Controller, Post, Body, HttpCode, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: { email: string; password: string }) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: { email: string; password: string },
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const auth = await this.authService.login(dto.email, dto.password);
    res.header(
      'Set-Cookie',
      `access_token=${auth.access_token}; HttpOnly; Path=/; SameSite=Lax`,
    );
    return auth;
  }
}
