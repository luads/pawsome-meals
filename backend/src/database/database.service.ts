import { Injectable, OnModuleInit } from '@nestjs/common';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { DatabaseSchema } from './types/database.types';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: Low<DatabaseSchema>;

  constructor() {
    const file = join(process.cwd(), 'data', 'db.json');
    const adapter = new JSONFile<DatabaseSchema>(file);
    this.db = new Low(adapter, { subscriptions: [], onboarding: [], payments: [] });
  }

  async onModuleInit() {
    await this.db.read();
    if (!this.db.data) {
      this.db.data = { subscriptions: [], onboarding: [], payments: [] };
      await this.db.write();
    }
  }

  async getData(collection: keyof DatabaseSchema): Promise<any> {
    await this.db.read();
    return this.db.data[collection];
  }

  async setData(collection: keyof DatabaseSchema, data: any): Promise<void> {
    await this.db.read();
    this.db.data[collection] = data;
    await this.db.write();
  }

  async clearDatabase(): Promise<void> {
    this.db.data = { subscriptions: [], onboarding: [], payments: [] };
    await this.db.write();
  }
}
