import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ContentModule } from './content/content.module';
import { ConfigModule } from '@nestjs/config';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [AuthModule, UsersModule, DatabaseModule, ContentModule, ConfigModule.forRoot(), TagModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
