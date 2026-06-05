import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateTheresholdDto {
    @ApiProperty({
        example: 'Id da plantação',
        description: 'Id gerado pelo prisma',
        required: true,
    })
    @IsString({ message: 'O Id da plantação deve ser uma string válida.' })
    farmId: string;

    @ApiProperty({
        example: 'luminosidade',
        description: 'Tipo do sensor',
        required: true,
    })
    @IsString({ message: 'O type deve ser uma string válida.' })
    type: string;

    @ApiProperty({
        example: '20.0',
        description: 'Valor mínimo do sensor',
        required: true,
    })
    @IsNumber({}, { message: 'O min deve ser um número válido.' })
    min: number;

    @ApiProperty({
        example: '28.5',
        description: 'Valor máximo do sensor',
        required: true,
    })
    @IsNumber({}, { message: 'O max deve ser um número válido.' })
    max: number;
}
