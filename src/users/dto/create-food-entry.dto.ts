import { IsInt, Min, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFoodEntryDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  calories: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  grams: number;
}
