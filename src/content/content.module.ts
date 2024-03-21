import { forwardRef, Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ContentRepository } from './content.repository';
import { AuthModule } from 'src/auth/auth.module';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule), TagModule],
  controllers: [ContentController],
  providers: [ContentService, ContentRepository],
  exports: [ContentService]
})
export class ContentModule {}
