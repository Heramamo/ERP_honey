import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class GeneratePaieDto {
    @ApiProperty({example:2})
    @IsInt()
    @IsNotEmpty()
    userId!: number;

    @ApiProperty({example:8})
    @IsInt()
    @Min(1)
    @Max(12)
    month!: number;

    @ApiProperty({example:2026})
    @IsInt()
    year!: number;
}

export class UpdateStatutPaieDto {
    @IsString()
    @IsNotEmpty()
    statutpaie!: string; 
}