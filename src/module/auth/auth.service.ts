import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ConflictException, Injectable } from '@nestjs/common';
import { addMilliseconds } from 'date-fns';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from 'src/provider/prisma/prisma.service';
import { CreateTokenResponseType } from 'src/common/types/auth';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const admin = await this.prismaService.user.findUnique({
      where: { email: loginAuthDto.email },
      select: { id: true, password: true, email: true, name: true },
    });

    if (!admin) {
      throw new NotFoundException('This account is not registered');
    }

    const passwordMatch = await bcrypt.compare(
      loginAuthDto.password,
      admin.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    delete admin.password;

    return {
      ...(await this.createToken(admin.id)),
      ...admin,
    };
  }

  async register(registerAuthDto: RegisterAuthDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: registerAuthDto.email },
    });

    if (existingUser) {
      throw new ConflictException('This email is already registered.');
    }

    const hashedPassword = await this.hashedPassword(registerAuthDto.password);
    const newUser = await this.prismaService.user.create({
      data: {
        email: registerAuthDto.email,
        password: hashedPassword,
        age: registerAuthDto.age,
        name: registerAuthDto.name,
      },
    });

    return { id: newUser.id, email: newUser.email, name: newUser.name };
  }

  async refreshToken(refreshToken: string): Promise<CreateTokenResponseType> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      return this.createToken(payload.sub);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  async getMe(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        age: true,
        email: true,
        id: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async createToken(sub: string): Promise<CreateTokenResponseType> {
    const now = new Date();
    const access = this.createAccessToken(now, sub);
    const refresh = this.createRefreshToken(now, sub);

    return {
      ...access,
      ...refresh,
    };
  }

  createAccessToken(date: Date, sub: string) {
    const payload = {
      sub,
    };

    const expiresIn = addMilliseconds(
      date,
      Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    );
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) / 1000,
      }),
      accessTokenExpiresIn: expiresIn.toISOString(),
    };
  }

  createRefreshToken(date: Date, sub: string) {
    const payload = {
      sub,
    };
    const expiresIn = addMilliseconds(
      date,
      Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
    );
    return {
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) / 1000,
      }),
      refreshTokenExpiresIn: expiresIn.toISOString(),
    };
  }

  async hashedPassword(plainText: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(plainText, saltOrRounds);
  }
}
