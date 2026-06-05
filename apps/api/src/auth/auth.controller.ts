import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiBody({
        type: RegisterDto,
    })
    @ApiOperation({ summary: 'Registrar novo usuário' })
    @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
    @ApiResponse({ status: 409, description: 'Email já cadastrado' })
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body.email, body.password, body.name);
    }

    @ApiBody({
        type: LoginDto,
        examples: {
            sucesso: {
                summary: 'Exemplo de payload válido',
                value: { email: 'joao@email.com', password: 'senhaSegura123' },
            },
            erro_email: {
                summary: 'Exemplo de payload com email inválido',
                value: { email: 'joao_sem_arroba', password: '123' },
            },
        },
    })
    @ApiOperation({ summary: 'Realiza login com email e senha' })
    @ApiResponse({ status: 200, description: 'Login com sucesso' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginDto) {
        return this.authService.login(body.email, body.password)
    }

    @ApiOperation({ summary: 'Retorna o perfil do usuário autenticado' })
    @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso negado' })
    @ApiBearerAuth()
    @Get('perfil')
    @HttpCode(HttpStatus.OK)
    @Roles('USER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getPerfil(@Req() request) {
        return {
            message: 'Você acessou uma rota protegida!',
            user: request.user,
        };
    }

    @ApiOperation({
        summary: 'Inicia o fluxo de autenticação com Google',
        description: 'Este endpoint deve ser acessado diretamente pelo navegador, não pelo Swagger UI.'
    })
    @ApiResponse({ status: 302, description: 'Redireciona para o Google' })
    @Get('google')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('google'))
    async googleLogin() {
        // Redireciona para o Google automaticamente
    }

    @ApiOperation({
        summary: 'Callback do Google OAuth, retorna token JWT',
        description: 'Este endpoint deve ser acessado diretamente pelo navegador, não pelo Swagger UI.'
    })

    @ApiResponse({ status: 200, description: 'Login com Google realizado com sucesso' })
    @ApiResponse({ status: 401, description: 'Autenticação com Google falhou' })
    @Get('google/callback')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() request) {
        return this.authService.googleLogin(request.user);
    }
}