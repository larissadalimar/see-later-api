import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {

  constructor(private readonly tagRepository: TagRepository) {}

  async create(userId: number, createTagDto: CreateTagDto) {

    return await this.tagRepository.create(userId, createTagDto);
  }

  async findAll(userId: number) {
    return await this.tagRepository.getAll(userId);
  }

  async findOne(id: number, userId: number) {
    return await this.tagRepository.getTagById(id, userId);
  }

  async update(id: number, userId: number, updateTagDto: UpdateTagDto) {
    return await this.tagRepository.update(id,userId, updateTagDto);
  }

  async remove(id: number, userId: number) {
    return await this.tagRepository.delete(id, userId);
  }
}
