import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  Matches,
  Max,
  Min,
  ValidateBy,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';

class MealScheduleEntryDto {
  @Matches(/^(?:(?:0[1-9]|1\d|2[0-2]):[0-5]\d|23:00)$/)
  time: string;

  @IsInt()
  @Min(1)
  @Max(2147483647)
  calories: number;
}

export class UpdateMealScheduleDto {
  @IsBoolean()
  enabled: boolean;

  @IsArray()
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  @Type(() => MealScheduleEntryDto)
  @ValidateBy({
    name: 'mealSchedule',
    validator: {
      validate(meals: unknown, args: ValidationArguments) {
        if (!Array.isArray(meals)) return false;
        if (meals.length === 0) {
          return (args.object as UpdateMealScheduleDto).enabled === false;
        }
        if (meals.length < 2) return false;

        let previousTime = -120;
        return meals.every((meal: MealScheduleEntryDto) => {
          if (typeof meal?.time !== 'string') return false;
          const [hours, minutes] = meal.time.split(':').map(Number);
          const time = hours * 60 + minutes;
          if (!Number.isInteger(time) || time - previousTime < 120)
            return false;
          previousTime = time;
          return true;
        });
      },
      defaultMessage() {
        return 'meals must contain 2 to 8 chronological entries at least 120 minutes apart; only a disabled schedule may be empty';
      },
    },
  })
  meals: MealScheduleEntryDto[];
}
