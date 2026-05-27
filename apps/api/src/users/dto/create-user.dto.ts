import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'O nome deve ser uma string válida.' })
    name: string;

    @IsEmail({}, { message: 'O e-mail deve ser um endereço válido.' })
    email: string;

    @IsString({ message: 'A senha deve ser uma string válida.' })
    password: string;
}