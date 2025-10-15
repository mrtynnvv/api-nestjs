import {IsInt, Min, Max} from 'class-validator'

export class UpdateCalorieLimitDto {
    @IsInt()
    @Min(800)
    @Max(7000)
    value: number;
}