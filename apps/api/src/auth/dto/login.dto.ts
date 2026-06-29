import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email do usuário cadastrado',
  })
  @IsEmail({}, { message: 'O e-mail deve ser um endereço válido.' })
  email: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha em formato texto plano',
  })
  @IsString({ message: 'A senha deve ser uma string válida.' })
  password: string;
}
