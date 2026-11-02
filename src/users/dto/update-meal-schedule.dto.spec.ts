import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { UpdateMealScheduleDto } from './update-meal-schedule.dto';

describe('UpdateMealScheduleDto', () => {
  const pipe = new ValidationPipe({ whitelist: true, transform: true });
  const meals = [
    { time: '08:00', calories: 500 },
    { time: '12:00', calories: 700 },
  ];
  const validate = (value: unknown) =>
    pipe.transform(value, {
      type: 'body',
      metatype: UpdateMealScheduleDto,
    });

  it.each([
    { enabled: false, meals: [] },
    { enabled: false, meals },
    { enabled: true, meals },
    {
      enabled: true,
      meals: [
        { time: '01:00', calories: 1 },
        { time: '03:00', calories: 7001 },
        { time: '23:00', calories: 2147483647 },
      ],
    },
    {
      enabled: true,
      meals: Array.from({ length: 8 }, (_, index) => ({
        time: `${(index * 2 + 1).toString().padStart(2, '0')}:00`,
        calories: 100,
      })),
    },
  ])('accepts a valid schedule: %j', async (value) => {
    await expect(validate(value)).resolves.toEqual(value);
  });

  it.each([
    { meals },
    { enabled: 'true', meals },
    { enabled: true },
    { enabled: true, meals: [] },
    { enabled: true, meals: [meals[0]] },
    { enabled: false, meals: [meals[0]] },
    { enabled: true, meals: null },
    { enabled: true, meals: [null, meals[1]] },
    { enabled: true, meals: [...meals].reverse() },
    { enabled: true, meals: [meals[0], meals[0]] },
    {
      enabled: false,
      meals: [meals[0], { time: '09:59', calories: 500 }],
    },
  ])('rejects an invalid schedule: %j', async (value) => {
    await expect(validate(value)).rejects.toBeInstanceOf(BadRequestException);
  });

  it.each([true, false])(
    'rejects nine otherwise-valid meals when enabled is %j',
    async (enabled) => {
      await expect(
        validate({
          enabled,
          meals: Array.from({ length: 9 }, (_, index) => ({
            time: `${(index * 2 + 1).toString().padStart(2, '0')}:00`,
            calories: 100,
          })),
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it.each(['00:59', '23:01', '24:00', '8:00', '08:60', '08:00:00', '', 800])(
    'rejects an invalid time: %j',
    async (time) => {
      await expect(
        validate({
          enabled: true,
          meals: [{ time, calories: 500 }, meals[1]],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it.each([0, -1, 1.5, '500', null, 2147483648])(
    'rejects invalid calories: %j',
    async (calories) => {
      await expect(
        validate({
          enabled: true,
          meals: [{ time: '08:00', calories }, meals[1]],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it('removes unknown fields at both levels', async () => {
    await expect(
      validate({
        enabled: true,
        dailyCalorieLimit: 1000,
        meals: meals.map((meal) => ({ ...meal, userId: 'another-user' })),
      }),
    ).resolves.toEqual({ enabled: true, meals });
  });
});
