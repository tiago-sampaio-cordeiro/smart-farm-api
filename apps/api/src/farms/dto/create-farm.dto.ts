import { IsString } from 'class-validator';

export class CreateFarmDto {
    @IsString({ message: 'O nome deve ser uma string válida.' })
    name: string;

    @IsString({ message: 'O userId deve ser uma string válida.' })
    userId: string;
}