import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { User } from '@prisma/client';

import { CreateWeightDto } from './dto/create-weight.dto';

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
}
