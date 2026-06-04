import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'O e-mail deve ser um endereço válido.' })
    email: string;

    @IsString({ message: 'A senha deve ser uma string válida.' })
    password: string;
}