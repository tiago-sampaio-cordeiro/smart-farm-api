import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // register
  // ─────────────────────────────────────────────────────────────────────────────
  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      // Arrange
      const email = 'novo@email.com';
      const password = 'senha123';
      const name = 'Novo Usuário';
      const hashedPassword = 'hashed_password';
      const createdUser = {
        id: 'user-id-1',
        email,
        name,
        password: hashedPassword,
        roles: ['USER'],
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      // Act
      const result = await service.register(email, password, name);

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { email, password: hashedPassword, name },
      });
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('email', email);
    });

    it('deve lançar ConflictException quando o email já estiver em uso', async () => {
      // Arrange
      const email = 'existente@email.com';
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existing-id', email });

      // Act & Assert
      await expect(service.register(email, 'senha', 'Nome')).rejects.toThrow(ConflictException);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // login
  // ─────────────────────────────────────────────────────────────────────────────
  describe('login', () => {
    it('deve retornar access_token quando as credenciais forem válidas', async () => {
      // Arrange
      const email = 'usuario@email.com';
      const password = 'senha123';
      const user = {
        id: 'user-id-1',
        email,
        password: 'hashed_password',
        roles: ['USER'],
      };
      const token = 'jwt.token.here';

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(token);

      // Act
      const result = await service.login(email, password);

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        roles: user.roles,
      });
      expect(result).toEqual({ access_token: token });
    });

    it('deve lançar UnauthorizedException quando o usuário não for encontrado', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login('naoexiste@email.com', 'senha')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('deve lançar UnauthorizedException quando a senha estiver incorreta', async () => {
      // Arrange
      const user = { id: 'id', email: 'user@email.com', password: 'hash', roles: [] };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login('user@email.com', 'senha_errada')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // googleLogin
  // ─────────────────────────────────────────────────────────────────────────────
  describe('googleLogin', () => {
    it('deve retornar access_token para um usuário Google autenticado', async () => {
      // Arrange
      const googleUser = { id: 'google-user-id', email: 'google@gmail.com' };
      const token = 'google.jwt.token';
      mockJwtService.signAsync.mockResolvedValue(token);

      // Act
      const result = await service.googleLogin(googleUser);

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: googleUser.id,
        email: googleUser.email,
      });
      expect(result).toEqual({ access_token: token });
    });
  });
});
