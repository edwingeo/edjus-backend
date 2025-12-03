import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from './interfaces/user.interface';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(pass, user.password);
    if (!passwordMatches) {
      return null;
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async login(user: Omit<User, 'password'>) {
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username, roles: user.roles };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(data: RegisterDto) {
    const user = await this.usersService.createUser(data.username, data.password, data.roles || []);
    const { password, ...safeUser } = user;
    const payload = { sub: safeUser.id, username: safeUser.username, roles: safeUser.roles };
    return {
      user: safeUser,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
