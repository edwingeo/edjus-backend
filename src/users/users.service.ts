import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../auth/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async createUser(username: string, password: string, roles: string[] = []): Promise<User> {
    const existing = await this.findByUsername(username);
    if (existing) {
      throw new BadRequestException('Username already exists');
    }

    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        username,
        password: hashed,
        roles,
      },
    });
  }
}
