import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService, configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extrai JWT do header Bearer
      ignoreExpiration: false, // rejeita tokens expirados automaticamente
      secretOrKey: configService.get<string>('JWT_SECRET') || 'minha_chave_secreta', // mesma chave usada no JwtModule
    });
  }

  // Método chamado após validação do token. 'payload' é o conteúdo decodificado do JWT.
  async validate(payload: any) {
    // Podemos extrair informações do payload. Aqui esperamos { sub: userId, email: email }
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
