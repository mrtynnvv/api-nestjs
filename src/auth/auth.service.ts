import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(phoneRaw: string, password: string) {
    const phone = this.normalizePhone(phoneRaw);
    const existing = await this.users.findByPhone(phone);
    if (existing) throw new BadRequestException('PHONE_ALREADY_EXISTS');

    const hash = await argon2.hash(password, { type: argon2.argon2id });
    const user = await this.users.create(phone, hash);
    const accessToken = await this.signAccess(user.id, user.phone);
    return { accessToken };
  }

  async login(phoneRaw: string, password: string) {
    const phone = this.normalizePhone(phoneRaw);
    const user = await this.users.findByPhone(phone);
    if (!user) throw new UnauthorizedException('INVALID_CREDENTIALS');

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('INVALID_CREDENTIALS');

    const accessToken = await this.signAccess(user.id, user.phone);
    return { accessToken };
  }

  private async signAccess(sub: string, phone: string) {
    return this.jwt.signAsync({ sub, phone });
  }

  private normalizePhone(p: string) {
    return p.replace(/[()\s-]+/g, '');
  }
}