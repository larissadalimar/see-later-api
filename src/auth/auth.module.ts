import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule,
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '60d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService
  ],
  exports: [AuthService]
})
export class AuthModule {}
