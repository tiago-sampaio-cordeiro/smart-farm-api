import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // findAll
  // ─────────────────────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('deve retornar a lista de usuários sem filtro', async () => {
      // Arrange
      const users = [
        { id: '1', name: 'Alice', email: 'alice@email.com', roles: ['USER'], createdAt: new Date() },
        { id: '2', name: 'Bob', email: 'bob@email.com', roles: ['ADMIN'], createdAt: new Date() },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: undefined, skip: 0, take: 10 }),
      );
      expect(result).toEqual(users);
    });

    it('deve aplicar filtro por email quando fornecido', async () => {
      // Arrange
      const users = [{ id: '1', name: 'Alice', email: 'alice@email.com', roles: ['USER'], createdAt: new Date() }];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      // Act
      const result = await service.findAll('alice', 1);

      // Assert
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: { contains: 'alice', mode: 'insensitive' } },
          skip: 0,
          take: 10,
        }),
      );
      expect(result).toEqual(users);
    });

    it('deve paginar corretamente quando a página 2 é solicitada', async () => {
      // Arrange
      mockPrismaService.user.findMany.mockResolvedValue([]);

      // Act
      await service.findAll(undefined, 2);

      // Assert
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // findOne
  // ─────────────────────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('deve retornar um usuário quando encontrado', async () => {
      // Arrange
      const user = { id: 'user-id-1', name: 'Alice', email: 'alice@email.com', roles: ['USER'], createdAt: new Date() };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      // Act
      const result = await service.findOne('user-id-1');

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'user-id-1' } }),
      );
      expect(result).toEqual(user);
    });

    it('deve lançar NotFoundException quando o usuário não for encontrado', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('id-invalido')).rejects.toThrow(NotFoundException);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // update
  // ─────────────────────────────────────────────────────────────────────────────
  describe('update', () => {
    it('deve atualizar e retornar o usuário quando encontrado', async () => {
      // Arrange
      const existingUser = { id: 'user-id-1', name: 'Alice', email: 'alice@email.com', roles: ['USER'], createdAt: new Date() };
      const updatedUser = { ...existingUser, name: 'Alice Atualizada' };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      // Act
      const result = await service.update('user-id-1', { name: 'Alice Atualizada' });

      // Assert
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
        data: { name: 'Alice Atualizada' },
      });
      expect(result).toEqual(updatedUser);
    });

    it('deve lançar NotFoundException quando o usuário não existir', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update('id-invalido', { name: 'Novo' })).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // remove
  // ─────────────────────────────────────────────────────────────────────────────
  describe('remove', () => {
    it('deve remover o usuário quando encontrado', async () => {
      // Arrange
      const user = { id: 'user-id-1', name: 'Alice', email: 'alice@email.com', roles: ['USER'], createdAt: new Date() };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.user.delete.mockResolvedValue(user);

      // Act
      const result = await service.remove('user-id-1');

      // Assert
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id: 'user-id-1' } });
      expect(result).toEqual(user);
    });

    it('deve lançar NotFoundException quando o usuário não existir', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove('id-invalido')).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.user.delete).not.toHaveBeenCalled();
    });
  });
});
