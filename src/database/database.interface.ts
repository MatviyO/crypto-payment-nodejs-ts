import { PrismaClient } from '@prisma/client';

interface IDatabaseService extends PrismaClient {
  init(): Promise<void>;
}

export {
  IDatabaseService,
};
