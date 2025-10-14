import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();

    try {
      await this.$queryRawUnsafe(`PRAGMA journal_mode = WAL;`);
    } catch (e) {
      console.warn('WAL PRAGMA failed (safe to ignore in dev):', e);
    }

    try {
      await this.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);
    } catch (e) {
      console.warn('foreign_keys PRAGMA failed (safe to ignore in dev):', e);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}