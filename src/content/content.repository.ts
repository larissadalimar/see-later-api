import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentRepository {

  constructor(private readonly databaseService: DatabaseService) {}
    
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

    const { title, url, notes } = createContentDto;

    const result = await this.databaseService.query(
      `INSERT INTO contents (title, url, notes, "userId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, url, notes, idUser, new Date(), new Date()],
    );

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

    const { title, url, notes } = updateContentDto;
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
        return result.rows[0];
      } else throw new NotFoundException();

    } catch (error) {

      console.error('Error updating:', error);

      throw error;
    }
  }
  

}
