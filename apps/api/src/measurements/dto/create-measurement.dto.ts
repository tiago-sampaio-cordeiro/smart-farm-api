import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMeasurementDto {
  @ApiProperty({
    example: 'id gerado pelo prisma na criação do sensor',
    description: 'sensorId do sensor',
  })
  @IsString({ message: 'O sensorId deve ser uma string válida.' })
  sensorId: string;

  @ApiProperty({
    example: '25.5',
    description: 'Temperatura em graus Celsius',
  })
  @IsOptional()
  @IsNumber({}, { message: 'A temperatura deve ser um número válido.' })
  @Type(() => Number)
  temperatura?: number;

  @ApiProperty({
    example: '80.0',
    description: 'Umidade em porcentagem',
  })
  @IsOptional()
  @IsNumber({}, { message: 'A umidade deve ser um número válido.' })
  @Type(() => Number)
  umidade?: number;

  @ApiProperty({
    example: '80.0',
    description: 'Luminosidade em porcentagem',
  })
  @IsOptional()
  @IsNumber({}, { message: 'A luminosidade deve ser um número válido.' })
  @Type(() => Number)
  luminosidade?: number;

  @ApiProperty({
    example: '2026-06-04T23:22:04.000Z',
    description: 'Timestamp da medição',
  })
  @IsDateString({}, { message: 'O timestamp deve ser uma data válida.' })
  timestamp: Date;
}
