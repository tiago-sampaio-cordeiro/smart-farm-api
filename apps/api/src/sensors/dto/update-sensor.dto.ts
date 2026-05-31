import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SensorStatus } from '@prisma/client';

export class UpdateSensorDto {
    @IsOptional()
    @IsString({ message: 'O tipo deve ser uma string válida.' })
    type?: string;

    @IsOptional()
    @IsEnum(SensorStatus, { message: 'O status deve ser "ativo" ou "inativo".' })
    status?: SensorStatus;
}
