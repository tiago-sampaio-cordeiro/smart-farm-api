import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMeasurementDto {

    @IsString({ message: 'O sensorId deve ser uma string válida.' })
    sensorId: string;

    @IsOptional()
    @IsNumber({}, { message: 'A temperatura deve ser um número válido.' })
    @Type(() => Number)
    temperatura?: number;

    @IsOptional()
    @IsNumber({}, { message: 'A umidade deve ser um número válido.' })
    @Type(() => Number)
    umidade?: number;

    @IsOptional()
    @IsNumber({}, { message: 'A luminosidade deve ser um número válido.' })
    @Type(() => Number)
    luminosidade?: number;

    @IsDateString({}, { message: 'O timestamp deve ser uma data válida.' })
    timestamp: Date;
}