import { Module } from '@nestjs/common';
import { ClearDbCommand } from './clear-db.command';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ClearDbCommand],
})
export class CommandsModule {}
