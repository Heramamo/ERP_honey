import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateRevenuDto {
  @ApiProperty({example:"Libeeeeellee"})
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  libelle!: string;

  @ApiProperty({example:260000.12})
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  montant!: number;

  @ApiProperty({example:"2026-08-24T07:49:26.723Z"})
  @IsDateString()
  date!: string;

  @ApiProperty({example:"Ecolage"})
  @IsString()
  @IsNotEmpty()
  typeRevenu!:string
  
  @ApiProperty({example:1, description:"Id du pole"})
  @IsNumber()
  idPole!: number;
}
