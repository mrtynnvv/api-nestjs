import {IsInt, Min, Max} from 'class-validator'

export class UpdateDesiredWeightDto {
    @IsInt()
    @Min(10)
    @Max(300)
    value: number;
}