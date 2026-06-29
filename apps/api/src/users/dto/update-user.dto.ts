import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Lennon',
    description: 'Nome do usuário',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string válida.' })
  name?: string;

  @ApiProperty({
    example: 'example@email.com',
    description: 'Email do usuário',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'O e-mail deve ser um endereço válido.' })
  email?: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string válida.' })
  password?: string;
}
