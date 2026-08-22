import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class GeneratePaieDto {
    @IsInt()
    @IsNotEmpty()
    userId!: number;

    @IsInt()
    @Min(1)
    @Max(12)
    month!: number;

    @IsInt()
    year!: number;
}

export class UpdateStatutPaieDto {
    @IsString()
    @IsNotEmpty()
    statutpaie!: string; 
}