import { IsNotEmpty, Matches } from 'class-validator';

export class BilanQueryDto {
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'mois doit être au format AAAA-MM',
  })
  mois!: string;
}
