import { PrismaClient } from '@prisma/client';
import { IDatabaseService } from './database.interface';

class DatabaseService extends PrismaClient implements IDatabaseService {
  async init(): Promise<void> {
    await this.$connect();
    throw new Error(' Method not implemented');
  }
}

export default DatabaseService;
