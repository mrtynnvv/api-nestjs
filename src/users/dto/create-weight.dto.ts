import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateWeightDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(30)
  @Max(500)
  weight: number;
}
