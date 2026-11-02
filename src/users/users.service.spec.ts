import { NotFoundException } from '@nestjs/common';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('meal schedule persistence', () => {
  let directory: string;
  let prisma: PrismaService;
  let users: UsersService;
  const userId = 'meal-schedule-test-user';
  const anotherUserId = 'another-meal-schedule-test-user';
  const meals = [
    { time: '08:00', calories: 500 },
    { time: '12:00', calories: 700 },
  ];

  beforeAll(async () => {
    directory = mkdtempSync(join(tmpdir(), 'calorielly-meal-schedule-'));
    prisma = new PrismaService({
      datasourceUrl: `file:${join(directory, 'test.sqlite')}`,
    });
    users = new UsersService(prisma);

    const migrations = join(__dirname, '../../prisma/migrations');
    for (const migration of readdirSync(migrations).sort()) {
      const path = join(migrations, migration, 'migration.sql');
      if (!migration.startsWith('20')) continue;

      if (migration === '20261102120000_meal_schedule') {
        await prisma.$executeRaw`
          INSERT INTO "User" ("id", "phone", "passwordHash", "updatedAt", "dailyCalorieLimit")
          VALUES (${userId}, ${'+70000000001'}, ${'test-hash'}, CURRENT_TIMESTAMP, ${2400})
        `;
        await prisma.$executeRaw`
          INSERT INTO "FoodEntry" ("id", "userId", "title", "calories", "eatenAt")
          VALUES (${'existing-food'}, ${userId}, ${'Existing meal'}, ${300}, ${new Date('2026-01-01T09:00:00.000Z')})
        `;
      }

      for (const statement of readFileSync(path, 'utf8').split(';')) {
        if (statement.trim()) await prisma.$executeRawUnsafe(statement);
      }
    }

    await prisma.user.create({
      data: {
        id: anotherUserId,
        phone: '+70000000002',
        passwordHash: 'test-hash',
      },
    });
  });

  beforeEach(async () => {
    await prisma.mealScheduleEntry.deleteMany();
    await prisma.user.updateMany({ data: { mealScheduleEnabled: false } });
  });

  afterAll(async () => {
    await prisma?.$disconnect();
    if (directory) rmSync(directory, { recursive: true, force: true });
  });

  it('keeps existing accounts disabled and preserves their food and daily limit', async () => {
    await expect(users.getMealSchedule(userId)).resolves.toEqual({
      enabled: false,
      meals: [],
    });
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    expect(user.dailyCalorieLimit).toBe(2400);
    await expect(
      prisma.foodEntry.findMany({ where: { userId } }),
    ).resolves.toEqual([
      expect.objectContaining({
        id: 'existing-food',
        title: 'Existing meal',
        calories: 300,
        eatenAt: new Date('2026-01-01T09:00:00.000Z'),
      }),
    ]);
  });

  it('saves and reads independent meal limits without changing the daily limit', async () => {
    const schedule = {
      enabled: true,
      meals: [
        { time: '01:00', calories: 1 },
        { time: '23:00', calories: 7001 },
      ],
    };
    await expect(users.updateMealSchedule(userId, schedule)).resolves.toEqual(
      schedule,
    );
    await expect(users.getMealSchedule(userId)).resolves.toEqual(schedule);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    expect(user.dailyCalorieLimit).toBe(2400);
  });

  it('returns saved entries in chronological order', async () => {
    await prisma.mealScheduleEntry.createMany({
      data: [
        { userId, timeMinutes: 720, calories: 700 },
        { userId, timeMinutes: 480, calories: 500 },
      ],
    });
    await expect(users.getMealSchedule(userId)).resolves.toEqual({
      enabled: false,
      meals,
    });
  });

  it('replaces only the current user schedule and keeps it when disabled', async () => {
    await users.updateMealSchedule(anotherUserId, { enabled: true, meals });
    await users.updateMealSchedule(userId, { enabled: true, meals });
    const changedMeals = [
      { time: '09:00', calories: 400 },
      { time: '13:00', calories: 600 },
    ];
    await users.updateMealSchedule(userId, {
      enabled: false,
      meals: changedMeals,
    });

    await expect(users.getMealSchedule(userId)).resolves.toEqual({
      enabled: false,
      meals: changedMeals,
    });
    await expect(users.getMealSchedule(anotherUserId)).resolves.toEqual({
      enabled: true,
      meals,
    });
  });

  it('rolls back the flag and deleted entries when replacing the list fails', async () => {
    const schedule = { enabled: true, meals };
    await users.updateMealSchedule(userId, schedule);

    await expect(
      users.updateMealSchedule(userId, {
        enabled: false,
        meals: [meals[0], meals[0]],
      }),
    ).rejects.toThrow();

    await expect(users.getMealSchedule(userId)).resolves.toEqual(schedule);
  });

  it('accepts an empty disabled schedule', async () => {
    await expect(
      users.updateMealSchedule(userId, { enabled: false, meals: [] }),
    ).resolves.toEqual({ enabled: false, meals: [] });
  });

  it('rejects reading a missing user', async () => {
    await expect(users.getMealSchedule('missing-user')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
