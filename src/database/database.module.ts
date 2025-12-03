import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL');
        const sslFlag = configService.get<string>('DATABASE_SSL', 'false');
        const ssl =
          sslFlag === 'true'
            ? { rejectUnauthorized: false }
            : false;

        return {
          type: 'postgres' as const,
          url,
          host: url ? undefined : configService.get<string>('DATABASE_HOST', 'localhost'),
          port: url ? undefined : configService.get<number>('DATABASE_PORT', 5432),
          username: url ? undefined : configService.get<string>('DATABASE_USER'),
          password: url ? undefined : configService.get<string>('DATABASE_PASSWORD'),
          database: url ? undefined : configService.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: false,
          ssl,
        };
      },
    }),
  ],
})
export class DatabaseModule { }
