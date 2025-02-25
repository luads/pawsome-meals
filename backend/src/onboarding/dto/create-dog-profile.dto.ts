import { IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDogProfileDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(30)
  @Transform(({ value }) => Number(value))
  age: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => Number(value))
  weight: number;
}
