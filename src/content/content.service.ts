import { Injectable } from '@nestjs/common';
import { ContentRepository } from './content.repository';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {

  constructor(private readonly contentRepository: ContentRepository) {}

  async create(userId: string, createContentDto: CreateContentDto) {

    return this.contentRepository.createContent(parseInt(userId), createContentDto);
  }

  async findAll(userId: string) {

    return this.contentRepository.getAllContents(parseInt(userId));
  }

  async findOne(userId: string, idContent: number) {

    try {
      
      return this.contentRepository.getContentById(idContent, parseInt(userId));

    } catch (error) {
      throw error;
    }
  }

  async update(userId: string, id: number, updateContentDto: UpdateContentDto) {

    return this.contentRepository.update(id, parseInt(userId), updateContentDto);
  }

  async remove(userId: string, id: number) {


    return this.contentRepository.deleteById(id, parseInt(userId));
  }
}
