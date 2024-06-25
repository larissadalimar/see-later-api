import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagRepository {

  constructor(private readonly databaseService: DatabaseService) {}
    
  async getAll(idUser: number): Promise<any[]> {
    const result = await this.databaseService.query(`SELECT * FROM categories where "userId" = $1`, [idUser]);
    return result.rows;
  }

  async getTagById(tagId: number, userId: number): Promise<any[]> {
    
    try {

      const result = await this.databaseService.query(`SELECT * FROM categories where id = $1 and "userId" = $2`, [tagId, userId]);

      if (!result.rows.length) {
        throw new NotFoundException();
      }

      return result.rows[0];

    } catch (error) {
      
      throw error;
    }
  }

  async create(idUser: number, createTagDto: CreateTagDto): Promise<any> {

    const { name } = createTagDto;

    const result = await this.databaseService.query(
      `INSERT INTO categories (name, "userId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, idUser, new Date(), new Date()],
    );

    return result.rows[0];
  }

  async findByName(idUser: number, name: string){

    const result = await this.databaseService.query(
      `SELECT * FROM categories where "userId" = $1 and LOWER(name) = LOWER($2)`,
      [idUser, name.trim()],
    );

    return result.rows[0];
  }

  async delete(tagId: number, userId: number): Promise<any | null> {

    try {
        
      const content = await this.getTagById(tagId, userId);

      await this.databaseService.query(`DELETE FROM categories WHERE id = $1 and "userId" = $2`, [tagId, userId]);

      return;

    } catch (error) {
      
      console.error('Error: ', error);

      throw error;
    }
  }


  async update(id: number, userId: number, updateContentDto: UpdateTagDto): Promise<any | undefined> {

    const { name } = updateContentDto;

    if(!name) throw new BadRequestException();

    let sqlFormatted = ' name = \'' + name + '\'';

    try {

      const result = await this.databaseService.query(`UPDATE categories SET` + sqlFormatted + ` WHERE id = $1 and "userId" = $2 RETURNING *`, [id, userId]);

      if (result.rows.length > 0) {
        return result.rows[0];
      } else throw new NotFoundException();

    } catch (error) {

      console.error('Error updating:', error);

      throw error;
    }
  }
  

async getAllTagContents(tagId: number, userId: number){

  try {

    await this.getTagById(tagId, userId);

    const result = await this.databaseService.query(
      `
      SELECT
          c.*
      FROM
          contents c
      JOIN
        category_content ct ON c.id = ct.content_id
      JOIN
        categories cat ON ct.category_id = cat.id
      WHERE
          cat.id = $1
          and cat."userId" = $2
        ;

      `, 
      [tagId, userId]);

    return result.rows;

  } catch (error) {
    
    throw error;
  }

}

}
