import { IsString, IsDateString } from 'class-validator';

export class CreateSensorDto {
    // @IsString({ message: 'O id deve ser uma string válida.' })
    // id: string;

    @IsString({ message: 'O tipo deve ser uma string válida.' })
    type: string;

    @IsString({ message: 'O status deve ser uma string válida.' })
    status: string;

    @IsDateString({}, { message: 'O lastSeen deve ser uma data válida.' })
    lastSeen: Date;
}