import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFarmDto {
  @ApiProperty({
    example: 'Feijao',
    description: 'Nome da plantação',
  })
  @IsString({ message: 'O nome deve ser uma string válida.' })
  name: string;

  @ApiProperty({
    example: 'id gerado pelo prisma na criação do usuário',
    description: 'userId do usuário associado a plantação',
  })
  @IsString({ message: 'O userId deve ser uma string válida.' })
  userId: string;
}
