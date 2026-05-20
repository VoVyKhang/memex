import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../common/prisma.service';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const hashed = await hash(password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: { email, password: hashed, name },
    });
    return this.signToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const valid = await compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Sai mật khẩu');

    return this.signToken(user.id, user.email);
  }

  private signToken(userId: string, email: string) {
    return {
      access_token: this.jwt.sign({ sub: userId, email }),
    };
  }
}
