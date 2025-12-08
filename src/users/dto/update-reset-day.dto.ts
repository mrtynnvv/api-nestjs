import { DayOfWeek } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateResetDayDto {
  @IsEnum(DayOfWeek, {
    message: 'value must be one of Mon,Tue,Wed,Thu,Fri,Sat,Sun',
  })
  value: DayOfWeek;
}
