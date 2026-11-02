import {
  IsInt,
  Min,
  IsString,
  Length,
  IsISO8601,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFoodEntryDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  calories: number;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsISO8601({ strict: true, strictSeparator: true })
  @Matches(/T.+(?:Z|[+-]\d{2}:?\d{2})$/)
  eatenAt?: string;
}
