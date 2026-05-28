import { IsOptional, IsString } from 'class-validator';

export class QueryAlertDto {
    @IsOptional()
    @IsString({ message: 'A severidade deve ser uma string válida.' })
    severity?: string;

    @IsOptional()
    @IsString({ message: 'O tipo deve ser uma string válida.' })
    type?: string;
}