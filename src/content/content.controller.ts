import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
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
  findAll(@Req() request: Request) {

    const userId = request["user"].sub;

    return this.contentService.findAll(userId);
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
}
