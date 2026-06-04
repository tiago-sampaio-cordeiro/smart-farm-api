import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body.email, body.password, body.name);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginDto) {
        return this.authService.login(body.email, body.password);
    }

    @Roles('USER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('perfil')
    async getPerfil(@Req() request) {
        return {
            message: 'Você acessou uma rota protegida!',
            user: request.user,
        };
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleLogin() {
        // Redireciona para o Google automaticamente
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() request) {
        return this.authService.googleLogin(request.user);
    }
}