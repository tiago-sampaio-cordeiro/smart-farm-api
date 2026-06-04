import { IsEmail, IsString, IsOptional } from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'O e-mail deve ser um endereço válido.' })
    email: string;

    @IsString({ message: 'A senha deve ser uma string válida.' })
    password: string;

    @IsOptional()
    @IsString({ message: 'O nome deve ser uma string válida.' })
    name?: string;
}