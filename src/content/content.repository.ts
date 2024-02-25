import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TagRepository } from 'src/tag/tag.repository';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentRepository {

  constructor(private readonly databaseService: DatabaseService, private readonly tagRepository: TagRepository) {}
    
  async getAllContents(idUser: number): Promise<any[]> {
    const result = await this.databaseService.query(`SELECT * FROM contents where "userId" = $1`, [idUser]);
    return result.rows;
  }

  async getContentById(contentId: number, userId: number): Promise<any[]> {
    
    try {

      const result = await this.databaseService.query(`SELECT * FROM contents where id = $1 and "userId" = $2`, [contentId, userId]);

      if (!result.rows.length) {
        throw new NotFoundException();
      }

      return result.rows[0];

    } catch (error) {
      
      throw error;
    }
  }

  async createContent(idUser: number, createContentDto: CreateContentDto): Promise<any> {

    const { title, url, notes, categories } = createContentDto;

    const result = await this.databaseService.query(
      `INSERT INTO contents (title, url, notes, "userId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [title, url, notes, idUser, new Date(), new Date()],
    );

    if(categories?.length > 0) this.addTagToContent(result.rows[0].id, categories);

    return result.rows[0];
  }


  async deleteById(contentId: number, userId: number): Promise<any | null> {

    try {
        
      const content = await this.getContentById(contentId, userId);

      await this.databaseService.query(`DELETE FROM contents WHERE id = $1 and "userId" = $2`, [contentId, userId]);

      return;

    } catch (error) {
      
      console.error('Error: ', error);

      throw error;
    }
  }


  async update(id: number, userId: number, updateContentDto: UpdateContentDto): Promise<any | undefined> {

    const { title, url, notes, categories } = updateContentDto;
    let sqlFormatted = '';

    if (title) sqlFormatted += ' title = \'' + title + '\'';

    if (url) {
      if (sqlFormatted !== '') sqlFormatted += ' , ';
      sqlFormatted += ' url = \'' + url + '\'';
    }

    if (notes) {
      if (sqlFormatted !== '') sqlFormatted += ' , ';
      sqlFormatted += ' notes = \'' + notes + '\'';
    }

    try {

      const result = await this.databaseService.query(`UPDATE contents SET` + sqlFormatted + ` WHERE id = $1 and "userId" = $2 RETURNING *`, [id, userId]);

      if (result.rows.length > 0) {

        if(categories.length > 0) this.addTagToContent(result.rows[0].id, categories);

        return result.rows[0];
      } else throw new NotFoundException();

    } catch (error) {

      console.error('Error updating:', error);

      throw error;
    }
  }
  
  async addTagToContent(idContent: number, categories: number[]){

    let tagsAssociated = [];

    try {

      categories?.forEach( async tagId => {

        const tagCreated = await this.databaseService.query(
          `INSERT INTO category_content (content_id, category_id)
          SELECT $1, $2
          WHERE NOT EXISTS (
              SELECT 1
              FROM category_content
              WHERE content_id = $1 
              AND category_id = $2   
          )
          RETURNING *
          ;`,
        [idContent, tagId]);

        tagsAssociated.push(tagCreated.rows[0]);

      })
      
      console.log(tagsAssociated);

      return tagsAssociated;
      
    } catch (error) {
      throw error;
    }
}

async removeTagFromContent(idContent: number, categories: number[]){

  try {
    
    categories.forEach( async tag => {

      await this.databaseService.query(
        `DELETE FROM category_content WHERE content_id = $1 and category_id = $2;`,
      [idContent, tag]);
  
    });
  
  } catch (error) {
    throw error;
  }
}

async getAllContentTags(contentId: number, userId: number){

  try {

    await this.getContentById(contentId, userId);

    const result = await this.databaseService.query(
      `SELECT
      (
          SELECT array_agg(cat.name) 
          FROM categories cat
          JOIN category_content cc ON cat.id = cc.category_id
          WHERE cc.content_id = c.id
      ) AS category_names
      FROM
          contents c
      WHERE
          c.id = $1
          AND c."userId" = $2;
      `, 
      [contentId, userId]);

    console.log(result.rows);
    return result.rows[0]?.category_names;

  } catch (error) {
    
    throw error;
  }

}

}
