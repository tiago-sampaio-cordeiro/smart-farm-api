import { IsNumber, IsString } from "class-validator";

export class CreateTheresholdDto {
    @IsString({ message: 'O farmId deve ser uma string válida.' })
    farmId: string;

    @IsString({ message: 'O type deve ser uma string válida.' })
    type: string;

    @IsNumber({}, { message: 'O min deve ser um número válido.' })
    min: number;

    @IsNumber({}, { message: 'O max deve ser um número válido.' })
    max: number;
}
