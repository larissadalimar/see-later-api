import { forwardRef, Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagRepository } from './tag.repository';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { TagToContentDto } from './dto/tag-content/tag-to-content';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
  controllers: [TagController],
  providers: [TagService, TagRepository, TagToContentDto],
  exports: [TagRepository, TagService, TagToContentDto]
})
export class TagModule {}
