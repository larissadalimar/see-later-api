// database.service.ts
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER || 'your_username',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'your_database_name',
      password: process.env.DB_PASSWORD || 'your_password',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
    });
  }

  query(sql: string, params?: any[]): Promise<any> {
    return this.pool.query(sql, params);
  }
}
