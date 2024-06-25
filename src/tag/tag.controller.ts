import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { TagGuard } from './guard/tag.guard';

@Controller('tag')
@UseGuards(AuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @UseGuards(TagGuard)
  create(@Req() request: Request, @Body() createTagDto: CreateTagDto) {

    const userId = request["user"].sub;

    return this.tagService.create(userId, createTagDto);
  }

  @Get()
  findAll(@Req() request: Request,) {

    const userId = request["user"].sub;

    return this.tagService.findAll(userId);
  }

  @Get(':id')
  findOne(@Req() request: Request, @Param('id') id: string) {

    const userId = request["user"].sub;

    return this.tagService.findOne(+id, userId);
  }

  @Patch(':id')
  update(@Req() request: Request, @Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    
    const userId = request["user"].sub;

    return this.tagService.update(+id, userId, updateTagDto);
  }

  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    
    const userId = request["user"].sub;

    return this.tagService.remove(+id, userId);
  }

  @Get(':id/contents')
  getAllTagContents(@Req() request: Request, @Param('id') id: string){

    const userId = request["user"].sub;

    return this.tagService.getAllTagContents(+id, userId);
  }

}
