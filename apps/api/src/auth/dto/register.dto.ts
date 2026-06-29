import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email do usuário a ser cadastrado',
  })
  @IsEmail({}, { message: 'O e-mail deve ser um endereço válido.' })
  email: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha em formato texto plano a ser cadastrada',
  })
  @IsString({ message: 'A senha deve ser uma string válida.' })
  password: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome do usuário a ser cadastrado',
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string válida.' })
  name?: string;
}
