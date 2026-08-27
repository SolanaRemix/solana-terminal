import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

// In production replace with TypeORM repository
const USERS = new Map<string, { id: string; passwordHash: string; tier: string }>();

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 12);
    USERS.set(email, { id: randomUUID(), passwordHash, tier: 'free' });
    return { message: 'User registered' };
  }

  async login(email: string, password: string) {
    const user = USERS.get(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Use stable UUID as subject, not email, so tokens survive email changes.
    const token = this.jwtService.sign({ sub: user.id, tier: user.tier });
    return { access_token: token };
  }
}
