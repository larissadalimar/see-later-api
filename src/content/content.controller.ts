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
  async create(@Req() request: Request, @Body() createContentDto: CreateContentDto) {

    const userId = request["user"].sub;

    return await this.contentService.create(userId, createContentDto);
  }

  @Get()
  async findAll(@Req() request: Request, @Query() filters: FilterDto) {

    const userId = request["user"].sub;

    return await this.contentService.findAll(userId, filters);
  }

  @Get('/progress')
  async getProgress(@Req() request: Request){

    const userId = request["user"].sub;

    return await this.contentService.getProgress(userId);
  }

  
  @Get('last-contents')
  async lastSavedContents(@Req() request: Request){

    const userId = request["user"].sub;

    return await this.contentService.lastSavedContents(userId);
  }

  @Get(':id')
  async findOne(@Req() request: Request, @Param('id') id: string) {
    
    const userId = request["user"].sub;

    try {
      
      return await this.contentService.findOne(userId, +id);

    } catch (error) {
      
      throw error;
    }
  }

  @Patch(':id')
  async update(@Req() request: Request, @Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    
    const userId = request["user"].sub;

    return await this.contentService.update(userId, +id, updateContentDto);
  }

  @Delete(':id')
  async remove(@Req() request: Request, @Param('id') id: string) {

    const userId = request["user"].sub;

    return await this.contentService.remove(userId, +id);
  }

  @Post(':id/tag')
  async addTagToContent(@Req() request: Request, @Param('id') id: string,  @Body() tagToContentDto: TagToContentDto){

    return await this.contentService.addTagToContent(+id, tagToContentDto);
  }

  @Delete(':id/tag')
  async removeTagFromContent(@Req() request: Request, @Param('id') id: string,  @Body() tagToContentDto: TagToContentDto){

    return await this.contentService.removeTagFromContent(+id, tagToContentDto);
  }

  @Get(':id/tag')
  async getAllContentTags(@Req() request: Request, @Param('id') id: string){

    const userId = request["user"].sub;

    return await this.contentService.getAllContentTags(+id, userId);
  }

  @Patch(':id/check')
  async checkToSeen(@Req() request: Request, @Param('id') id: string){

    const userId = request["user"].sub;

    return await this.contentService.checkToSeen(userId, +id);

  }


}
