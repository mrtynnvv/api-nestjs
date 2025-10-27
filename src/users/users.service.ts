import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { User } from '@prisma/client';

import { CreateWeightDto } from './dto/create-weight.dto';

import { CreateFoodEntryDto } from './dto/create-food-entry.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByPhone(phone: string): Promise<User | null> {
    // ищет в таблице user уникальную запись по полю phone
    return this.prisma.user.findUnique({ where: { phone } });
  }

  create(phone: string, passwordHash: string): Promise<User> {
    // создает запись в таблице user с телефоном и хешем пароля
    return this.prisma.user.create({ data: { phone, passwordHash } });
  }
  getCalorieLimit(userId: string) {
    // ищет юзера по id и возвращает только поле dailyCalorieLimit
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { dailyCalorieLimit: true },
    });
  }

  updateCalorieLimit(userId: string, value: number) {
    // обновляет запись юзера по id, меняет dailyCalorieLimit
    return this.prisma.user.update({
      where: { id: userId },
      // новое значение
      data: { dailyCalorieLimit: value },
      // вернет только поле dailyCalorieLimit
      select: { dailyCalorieLimit: true },
    });
  }

  getDesiredWeight(userId: string) {
    // ищет пользователя по id и возвращает только поле desiredWeight
    return this.prisma.user.findUnique({
      where: { id: userId },
      // вернуть только desiredWeight
      select: { desiredWeight: true },
    });
  }

  updateDesiredWeight(userId: string, value: number) {
    // обновляет поле desiredWeight пользователя с указанным id
    return this.prisma.user.update({
      // if id пользователя
      where: { id: userId },
      // новое значение желаемого веса
      data: { desiredWeight: value },
      select: { desiredWeight: true },
    });
  }

  async addWeight(userId: string, dto: CreateWeightDto) {
    // создает запись в таблице weightEntry
    return this.prisma.weightEntry.create({
      data: { userId, weight: dto.weight },
    });
  }

  async listWeights(userId: string) {
    const MAX_WEIGHTS = 2000;
    // запрашивает из бд все записи веса юзера, сортирует по дате измерения и ограничивает кол-во записей через take
    const items = await this.prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { measuredAt: 'asc' },
      take: MAX_WEIGHTS,
    });
    // обрезает список если лимит превышен
    const truncated = items.length > MAX_WEIGHTS;
    // возвращает массив записей и флаг что он обрезан
    return {
      items: truncated ? items.slice(0, MAX_WEIGHTS) : items,
      truncated,
    };
  }

  async addFoodEntry(userId: string, dto: CreateFoodEntryDto) {
    // создает запись в таблице foodEntry
    return this.prisma.foodEntry.create({
      data: {
        userId,
        title: dto.title,
        calories: dto.calories,
        grams: dto.grams,
      },
    });
  }
  async listFoodEntry(userId: string) {
    // запрашивает из бд все записи еды юзера, сортирует по eatenAt
    return this.prisma.foodEntry.findMany({
      where: { userId },
      orderBy: { eatenAt: 'asc' },
    });
  }
  async listEntries(userId: string) {
    // запрашивает из бд все записи еды и веса юзера и сортирует их по дате
    const [foods, weights] = await this.prisma.$transaction([
      this.prisma.foodEntry.findMany({
        where: { userId },
        orderBy: { eatenAt: 'desc' },
      }),
      this.prisma.weightEntry.findMany({
        where: { userId },
        orderBy: { measuredAt: 'desc' },
      }),
    ]);
    return [
      ...foods.map((f) => ({
        id: f.id,
        type: 'food' as const,
        date: f.eatenAt,
        data: f,
      })),
      ...weights.map((w) => ({
        id: w.id,
        type: 'weight' as const,
        date: w.measuredAt,
        data: w,
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  //удаляет записи из списков веса или еды по id
  async deleteEntryById(userId: string, id: string) {
    const [f, w, ff] = await this.prisma.$transaction([
      this.prisma.foodEntry.deleteMany({ where: { id, userId } }),
      this.prisma.weightEntry.deleteMany({ where: { id, userId } }),
      this.prisma.favoriteFood.deleteMany({ where: { id, userId } }),
    ]);
    if (!f.count && !w.count && !ff.count)
      throw new NotFoundException('ENTRY_NOT_FOUND');
  }

  async addFavoriteFood(userId: string, dto: CreateFoodEntryDto) {
    // создает запись в таблице favoriteFoods
    return this.prisma.favoriteFood.create({
      data: {
        userId,
        title: dto.title,
        calories: dto.calories,
        grams: dto.grams,
      },
    });
  }
  async listFavoriteFoods(userId: string) {
    // запрашивает из бд все записи избранной еды юзера
    return this.prisma.favoriteFood.findMany({
      where: { userId },
    });
  }
}
