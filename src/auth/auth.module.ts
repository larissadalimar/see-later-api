import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ContentModule } from 'src/content/content.module';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [UsersModule,
    forwardRef(() => ContentModule),
    forwardRef(() => TagModule),
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '60d' },
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService
  ],
  exports: [AuthService]
})
export class AuthModule {}
