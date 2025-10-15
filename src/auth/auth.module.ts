import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from '../users/users.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const expires = Number(cfg.get('JWT_ACCESS_EXPIRES')) || 3600;
        return {
          secret: cfg.get<string>('JWT_ACCESS_SECRET'),
          signOptions: { expiresIn: expires },
        };
      },
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, UsersService, JwtStrategy],
})
export class AuthModule { }
