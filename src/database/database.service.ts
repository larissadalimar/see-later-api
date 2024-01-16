// database.service.ts
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private readonly pool: Pool;

  constructor() {
    const connectionString = process.env.DB_CONNECTION_STRING || this.buildConnectionString();
    this.pool = new Pool({
      connectionString,
    });
  }

  private buildConnectionString(): string {
    return `postgres://${process.env.DB_USER || 'your_username'}:${process.env.DB_PASSWORD || 'your_password'}@${process.env.DB_HOST || 'localhost'}:${parseInt(process.env.DB_PORT, 10) || 5432}/${process.env.DB_NAME || 'your_database_name'}`;
  }

  query(sql: string, params?: any[]): Promise<any> {
    return this.pool.query(sql, params);
  }
}
