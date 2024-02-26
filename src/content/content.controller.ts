import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { TagToContentDto } from 'src/tag/dto/tag-content/tag-to-content';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { FilterDto } from './dto/filters.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('content')
@UseGuards(AuthGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  create(@Req() request: Request, @Body() createContentDto: CreateContentDto) {

    const userId = request["user"].sub;

    return this.contentService.create(userId, createContentDto);
  }

  @Get()
  findAll(@Req() request: Request, @Query() filters: FilterDto) {

    const userId = request["user"].sub;

    return this.contentService.findAll(userId, filters);
  }

  @Get(':id')
  findOne(@Req() request: Request, @Param('id') id: string) {
    
    const userId = request["user"].sub;

    try {
      
      return this.contentService.findOne(userId, +id);

    } catch (error) {
      
      throw error;
    }
  }

  @Patch(':id')
  update(@Req() request: Request, @Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    
    const userId = request["user"].sub;

    return this.contentService.update(userId, +id, updateContentDto);
  }

  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {

    const userId = request["user"].sub;

    return this.contentService.remove(userId, +id);
  }

  @Post(':id/tag')
  addTagToContent(@Req() request: Request, @Param('id') id: string,  @Body() tagToContentDto: TagToContentDto){

    return this.contentService.addTagToContent(+id, tagToContentDto);
  }

  @Delete(':id/tag')
  removeTagFromContent(@Req() request: Request, @Param('id') id: string,  @Body() tagToContentDto: TagToContentDto){

    return this.contentService.removeTagFromContent(+id, tagToContentDto);
  }

  @Get(':id/tag')
  getAllContentTags(@Req() request: Request, @Param('id') id: string){

    const userId = request["user"].sub;

    return this.contentService.getAllContentTags(+id, userId);
  }
}
