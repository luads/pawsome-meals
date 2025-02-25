import { Command, CommandRunner } from 'nest-commander';
import { DatabaseService } from '../database/database.service';

@Command({ name: 'clear-db', description: 'Clear all data from the database' })
export class ClearDbCommand extends CommandRunner {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async run(): Promise<void> {
    try {
      await this.databaseService.clearDatabase();
      console.log('✅ Database cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear database:', error);
      process.exit(1);
    }
    process.exit(0);
  }
}
