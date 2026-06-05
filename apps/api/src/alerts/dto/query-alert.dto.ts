import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryAlertDto {
    @ApiProperty({
        example: 'ALTA',
        description: 'Severidade do alerta',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'A severidade deve ser uma string válida.' })
    severity?: string;

    @ApiProperty({
        example: 'temperatura',
        description: 'Tipo do alerta',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'O tipo deve ser uma string válida.' })
    type?: string;
}