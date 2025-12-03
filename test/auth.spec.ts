import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthController } from '../src/auth/auth.controller';

class PrismaServiceStub {
  private users: any[] = [];
  private idCounter = 1;

  user = {
    findUnique: async ({ where: { username } }: any) => {
      return this.users.find((u) => u.username === username) ?? null;
    },
    create: async ({ data }: any) => {
      const newUser = {
        ...data,
        id: this.idCounter++,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.push(newUser);
      return newUser;
    },
  };
}

describe('Auth flow (register, login, profile)', () => {
  let authService: AuthService;
  let authController: AuthController;
  let usersService: UsersService;
  let prismaStub: PrismaServiceStub;

  beforeEach(async () => {
    prismaStub = new PrismaServiceStub();
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        { provide: PrismaService, useValue: prismaStub },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  it('registers a new user and returns JWT + user payload', async () => {
    const result = await authService.register({
      username: 'alice',
      password: 'password123',
      roles: ['user'],
    });

    expect(result.user).toMatchObject({
      id: expect.any(Number),
      username: 'alice',
      roles: ['user'],
    });
    expect((result as any).user.password).toBeUndefined();
    expect(result.access_token).toEqual(expect.any(String));

    const stored = await usersService.findByUsername('alice');
    expect(stored?.password).not.toEqual('password123');
  });

  it('logs in an existing user with valid credentials', async () => {
    await authService.register({
      username: 'bob',
      password: 'secretpass',
    });

    const validated = await authService.validateUser('bob', 'secretpass');
    expect(validated).toBeTruthy();

    const loginResult = await authService.login(validated!);
    expect(loginResult.access_token).toEqual(expect.any(String));
  });

  it('returns profile payload for authenticated request', async () => {
    const profilePayload = { id: 1, username: 'charlie', roles: ['user'] };
    const profile = authController.getProfile({ user: profilePayload });
    expect(profile).toEqual(profilePayload);
  });
});
