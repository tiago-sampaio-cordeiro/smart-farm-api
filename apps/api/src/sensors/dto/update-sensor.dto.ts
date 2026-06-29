import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SensorStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSensorDto {
  @ApiProperty({
    example: 'Sensor de umidade do solo',
    description: 'Tipo de sensor',
  })
  @IsOptional()
  @IsString({ message: 'O tipo deve ser uma string válida.' })
  type?: string;

  @ApiProperty({
    example: 'ativo',
    description: 'Status do sensor',
  })
  @IsOptional()
  @IsEnum(SensorStatus, { message: 'O status deve ser "ativo" ou "inativo".' })
  status?: SensorStatus;
}
