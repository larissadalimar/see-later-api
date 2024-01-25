import { Injectable } from '@nestjs/common';
import { ContentRepository } from './content.repository';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {

  constructor(private readonly contentRepository: ContentRepository) {}

  async create(createContentDto: CreateContentDto) {
    
    const userId = 1; //TODO: get from token 

    return this.contentRepository.createContent(userId, createContentDto);
  }

  async findAll() {

    const userId = 1; //TODO: get from token 

    return this.contentRepository.getAllContents(userId);
  }

  async findOne(idContent: number) {

    const userId = 1; //TODO: get from token 

    return this.contentRepository.getContentById(idContent, userId);
  }

  async update(id: number, updateContentDto: UpdateContentDto) {

    const userId = 1; //TODO: get from token 

    return this.contentRepository.update(id, userId, updateContentDto);
  }

  async remove(id: number) {

    const userId = 1; //TODO: get from token 

    return this.contentRepository.deleteById(id, userId);
  }
}
