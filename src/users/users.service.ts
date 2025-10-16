import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  create(phone: string, passwordHash: string): Promise<User> {
    return this.prisma.user.create({ data: { phone, passwordHash } });
  }
  getCalorieLimit(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { dailyCalorieLimit: true },
    });
  }

  updateCalorieLimit(userId: string, value: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { dailyCalorieLimit: value },
      select: { dailyCalorieLimit: true },
    });
  }

  getDesiredWeight(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { desiredWeight: true },
    });
  }

  updateDesiredWeight(userId: string, value: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { desiredWeight: value },
      select: { desiredWeight: true },
    });
  }
}
