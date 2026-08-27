import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Accept token from Authorization header (standard) or `token` query param
      // (needed for EventSource / SSE, which cannot set custom headers).
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: { query?: Record<string, string> }) =>
          req?.query?.['token'] ?? null,
      ]),
      secretOrKey: process.env.JWT_SECRET ?? 'change-me-in-production',
    });
  }

  validate(payload: { sub: string; tier: string }) {
    return { userId: payload.sub, tier: payload.tier };
  }
}
