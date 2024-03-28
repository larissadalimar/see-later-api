import { Injectable } from '@nestjs/common';
import { TagToContentDto } from 'src/tag/dto/tag-content/tag-to-content';
import { ContentRepository } from './content.repository';
import { CreateContentDto } from './dto/create-content.dto';
import { FilterDto } from './dto/filters.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {

  constructor(private readonly contentRepository: ContentRepository) {}

  async create(userId: string, createContentDto: CreateContentDto) {

    return this.contentRepository.createContent(parseInt(userId), createContentDto);
  }

  async findAll(userId: string, filters: FilterDto) {

    return this.contentRepository.getAllContents(parseInt(userId), filters);
  }

  async findOne(userId: string, idContent: number) {

    try {
      
      return this.contentRepository.getContentById(idContent, parseInt(userId));

    } catch (error) {
      throw error;
    }
  }

  async update(userId: string, id: number, updateContentDto: UpdateContentDto) {

    await this.contentRepository.getContentById(id, parseInt(userId));

    return this.contentRepository.update(id, parseInt(userId), updateContentDto);
  }

  async remove(userId: string, id: number) {

    return this.contentRepository.deleteById(id, parseInt(userId));
  }

  async addTagToContent(idContent: number, tagToContentDto: TagToContentDto){

    return await this.contentRepository.addTagToContent(idContent, tagToContentDto.categories);
  }

  async removeTagFromContent(idContent: number, tagToContentDto: TagToContentDto){

    await this.contentRepository.removeTagFromContent(idContent, tagToContentDto.categories);
  }

  async getAllContentTags(idContent: number, userId: number){

    return await this.contentRepository.getAllContentTags(idContent, userId);
  
  }

  async checkToSeen(userId: number, contentId: number){

    return await this.contentRepository.checkToSeen(userId, contentId);
  }

  async getProgress(userId: number){

    const seenContents = await this.contentRepository.getContentsSeenByUser(userId) ?? 0;

    const allContents = await this.contentRepository.getHowManyContentsByUser(userId);

    console.log( "seen: ", seenContents, "all: ", allContents);

    return  allContents? (seenContents/allContents).toFixed(2) : 0;

  }

  async lastSavedContents(userId: number){

    return await this.contentRepository.lastSavedContents(userId);
  }

  async favoriteContent(userId: number, contentId: number){

    return await this.contentRepository.checkToFavorite(userId, contentId);
  }

}
