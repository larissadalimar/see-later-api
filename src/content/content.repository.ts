import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TagRepository } from 'src/tag/tag.repository';
import { CreateContentDto } from './dto/create-content.dto';
import { FilterDto } from './dto/filters.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentRepository {

  constructor(private readonly databaseService: DatabaseService, private readonly tagRepository: TagRepository) {}
    
  async getAllContents(idUser: number, filters: FilterDto): Promise<any[]> {
    const { categories, text, startDate, endDate, seen, type, favorite, consume_date, days, order } = filters;
  
    let sqlWithFilters = `
          SELECT
          c.id,
          c.title,
          c.url,
          c."type",
          c."createdAt",
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', cat.id,
                'name', cat.name
              )
            ) FILTER (WHERE cat.id IS NOT NULL), '[]'
          ) AS categories
        FROM
          contents c
        LEFT JOIN
          category_content cc ON c.id = cc.content_id
        LEFT JOIN
          categories cat ON cc.category_id = cat.id
          WHERE c."userId" = $1
    `;
  
    const queryParams: any[] = [idUser];
    let paramIndex = queryParams.length + 1;
  
    if (text) {
      sqlWithFilters += ` AND c.title ILIKE $${paramIndex++}`;
      queryParams.push(`%${text}%`);
    }
  
    if (startDate) {
      sqlWithFilters += ` AND c."createdAt" >= $${paramIndex++}`;
      queryParams.push(startDate);
    }
  
    if (endDate) {
      sqlWithFilters += ` AND c."createdAt" <= $${paramIndex++}`;
      queryParams.push(endDate);
    }
  
    if (days) {
      let today = new Date();
      let lastDate = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));
      sqlWithFilters += ` AND c."createdAt" >= $${paramIndex++}`;
      queryParams.push(lastDate.toISOString());
    }
  
    if (seen !== undefined) {
      sqlWithFilters += ` AND c.seen = $${paramIndex++}`;
      queryParams.push(seen);
    }
  
    if (type) {
      sqlWithFilters += ` AND c."type" = $${paramIndex++}`;
      queryParams.push(type.toLowerCase());
    }
  
    if (favorite !== undefined) {
      sqlWithFilters += ` AND c.favorite = $${paramIndex++}`;
      queryParams.push(favorite);
    }
  
    if (consume_date) {
      let lastDate = new Date();
      var last = new Date(lastDate.getTime() + (consume_date * 24 * 60 * 60 * 1000));
      sqlWithFilters += ` AND c.consume_date <= $${paramIndex++} AND c.consume_date >= $${paramIndex++}`;
      queryParams.push(last.toISOString(), lastDate.toISOString());
    }

    
  
    sqlWithFilters += " GROUP BY c.id";
  
    if (categories && categories.length) {
      sqlWithFilters += ` HAVING
      COUNT ( DISTINCT CASE WHEN cat.id = ANY($${paramIndex++}::int[]) THEN cat.id ELSE NULL END) = ${categories.length} `;
      queryParams.push(categories.map(num => parseInt(num, 10)));
    }
  
    if (order) {
      sqlWithFilters += ` ORDER BY c.id ${order.toUpperCase()}`;
    }
  
    console.log(sqlWithFilters, queryParams);
  
    const result = await this.databaseService.query(sqlWithFilters, queryParams);
    return result.rows;
  }
  

  async getContentById(contentId: number, userId: number): Promise<any[]> {
    
    try {

      const result = 
      await this.databaseService.query(`
          SELECT
            c.*,
            COALESCE(
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', cat.id,
                  'name', cat.name
                )
              ) FILTER (WHERE cat.id IS NOT NULL), '[]'
            ) AS categories
          FROM
            contents c
          LEFT JOIN
            category_content cc ON c.id = cc.content_id
          LEFT JOIN
            categories cat ON cc.category_id = cat.id
            WHERE c."userId" = $1 and c.id = $2
            group by c.id;`, [userId, contentId]);

      if (!result.rows.length) {
        throw new NotFoundException();
      }

      return result.rows[0];

    } catch (error) {
      
      throw error;
    }
  }

  async createContent(idUser: number, createContentDto: CreateContentDto): Promise<any> {

    const { title, url, notes, categories, type, consume_date } = createContentDto;

    /*let sqlQuery = `INSERT INTO contents (title, url, notes, "userId", "createdAt", "updatedAt", type `;

    if(consume_date) sqlQuery += `consume_date `;

    sqlQuery += `) VALUES ($1, $2, $3, $4, $5, $6, $7 `;

    if(consume_date) sqlQuery += `, $8 `;

    sqlQuery += ") RETURNING *;"*/

    const result = await this.databaseService.query(
      `INSERT INTO contents (title, url, notes, "userId", "createdAt", "updatedAt", type, consume_date ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [title, url, notes, idUser, new Date(), new Date(), type, consume_date],
    );

    /*const result = await this.databaseService.query(sqlQuery,
      consume_date? [title, url, notes, idUser, new Date(), new Date(), type, consume_date] : [title, url, notes, idUser, new Date(), new Date(), type],
    );*/

    if(categories?.length > 0) this.addTagToContent(result.rows[0].id, categories);

    return result.rows[0];
  }


  async deleteById(contentId: number, userId: number): Promise<any | null> {

    try {
        
      await this.getContentById(contentId, userId);

      await this.databaseService.query(`DELETE FROM contents WHERE id = $1 and "userId" = $2`, [contentId, userId]);

      return;

    } catch (error) {
      
      console.error('Error: ', error);

      throw error;
    }
  }


  async update(id: number, userId: number, updateContentDto: UpdateContentDto): Promise<any | undefined> {

    const { title, url, notes, categories, seen, type, favorite, consume_date } = updateContentDto;
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

    if (seen) {
      if (sqlFormatted !== '') sqlFormatted += ' , ';
      sqlFormatted += ' seen = ' + seen ;
    }

    if (type) {
      if (sqlFormatted !== '') sqlFormatted += ' , ';
      sqlFormatted += ' type =  \'' + type + '\'';
    }

    if (favorite) {
      if (sqlFormatted !== '') sqlFormatted += ' , ';
      sqlFormatted += ' favorite =  \'' + favorite + '\'';
    }

    if (consume_date) {
      if (sqlFormatted !== '') sqlFormatted += ' , ';
      sqlFormatted += ' consume_date =  \'' + consume_date + '\'';
    }

    if(categories?.length > 0){

      const beforeContentCategories = 
        await this.databaseService.query(`SELECT
            cat.id AS category_id
          FROM
            contents c
          LEFT JOIN
            category_content cc ON c.id = cc.content_id
          LEFT JOIN
            categories cat ON cc.category_id = cat.id
          WHERE
            c.id = $1 AND c."userId" = $2;
          `, [id, userId]);

      let contentCategories = beforeContentCategories.rows.map(id => id.category_id);

      let categoriesToRemove = contentCategories.filter((category) => !categories.includes(category.toString()))

      if(categoriesToRemove[0] !== null ) this.removeTagFromContent(id, categoriesToRemove);

      const newTags = categories.filter(elemento => !contentCategories.includes(elemento))

      if(newTags[0] !== null )  this.addTagToContent(id, newTags);

    }

    if(sqlFormatted.length < 1) return;

    try {


      const result = await this.databaseService.query(`UPDATE contents SET` + sqlFormatted + ` WHERE id = $1 and "userId" = $2 RETURNING *`, [id, userId]);

      if (result.rows?.length > 0)
        return result.rows[0];
       else throw new NotFoundException();

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

    return result.rows[0]?.category_names;

  } catch (error) {
    
    throw error;
  }

}

async checkToSeen(userId: number, contentId: number){

  try {

    const seen = await this.getContentById(contentId, userId);

    const result = await this.databaseService.query(`UPDATE contents SET seen = $3 WHERE id = $1 and "userId" = $2 RETURNING *;`, [contentId, userId, !seen["seen"]]);

    console.log(result.rows);

    if(!result.rows.length) throw new NotFoundException();
    
  } catch (error) {
    
    throw error;
  }
}

async checkToFavorite(userId: number, contentId: number){

  try {

    const content = await this.getContentById(contentId, userId);

    const result = await this.databaseService.query(`UPDATE contents SET favorite = $3 WHERE id = $1 and "userId" = $2 RETURNING *;`, [contentId, userId, !content["favorite"]]);

    console.log(result.rows);

    if(!result.rows.length) throw new NotFoundException();
    
  } catch (error) {
    
    throw error;
  }
}

async getHowManyContentsByUser(userId: number){

  try {
    
    const result = await this.databaseService.query(`SELECT COUNT(*) AS total_contents FROM contents WHERE "userId" = $1;`, [userId]);

    return result.rows[0].total_contents;

  } catch (error) {

    throw error;
  }

}

async getContentsSeenByUser(userId: number){

  try {
    
    const result = await this.databaseService.query(`SELECT COUNT(*) FROM contents WHERE "userId" = $1 AND seen = TRUE;`, [userId]);

    return result.rows[0].count;

  } catch (error) {

    throw error;
  }

}

async lastSavedContents(userId: number){

  try {
    
    const result = await this.databaseService.query(`SELECT * FROM contents WHERE "userId" = $1 ORDER BY id DESC LIMIT 3;`, [userId]);

    //if(!result.rows.length) return { statusCode: 204, message: 'No Content' };

    return result.rows;

  } catch (error) {

    throw error;
  }

}


}
