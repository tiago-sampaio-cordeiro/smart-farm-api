import { Test, TestingModule } from '@nestjs/testing';
import { FarmsService } from './farms.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FarmNotFoundException } from './exceptions/farm-not-found.exception';

const mockPrismaService = {
  farm: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('FarmsService', () => {
  let service: FarmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FarmsService>(FarmsService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar e retornar uma nova plantação com sucesso', async () => {
      const dto = { name: 'Plantação de Soja', userId: 'user-id-1' };
      const createdFarm = { id: 'farm-id-1', ...dto, createdAt: new Date() };
      mockPrismaService.farm.create.mockResolvedValue(createdFarm);

      const result = await service.create(dto);

      expect(mockPrismaService.farm.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(createdFarm);
    });
  });

  describe('findAll', () => {
    it('deve retornar a lista de todas as plantações', async () => {
      const farms = [
        { id: 'farm-id-1', name: 'Plantação A', userId: 'user-id-1' },
        { id: 'farm-id-2', name: 'Plantação B', userId: 'user-id-2' },
      ];
      mockPrismaService.farm.findMany.mockResolvedValue(farms);

      const result = await service.findAll();

      expect(mockPrismaService.farm.findMany).toHaveBeenCalled();
      expect(result).toEqual(farms);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma plantação quando encontrada', async () => {
      const farm = { id: 'farm-id-1', name: 'Plantação A', userId: 'user-id-1' };
      mockPrismaService.farm.findUnique.mockResolvedValue(farm);

      const result = await service.findOne('farm-id-1');

      expect(mockPrismaService.farm.findUnique).toHaveBeenCalledWith({ where: { id: 'farm-id-1' } });
      expect(result).toEqual(farm);
    });

    it('deve lançar FarmNotFoundException quando a plantação não for encontrada', async () => {
      mockPrismaService.farm.findUnique.mockResolvedValue(null);

      await expect(service.findOne('id-invalido')).rejects.toThrow(FarmNotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar a plantação quando encontrada', async () => {
      const farm = { id: 'farm-id-1', name: 'Plantação A', userId: 'user-id-1' };
      const updatedFarm = { ...farm, name: 'Plantação A Atualizada' };
      mockPrismaService.farm.findUnique.mockResolvedValue(farm);
      mockPrismaService.farm.update.mockResolvedValue(updatedFarm);

      const result = await service.update('farm-id-1', { name: 'Plantação A Atualizada' });

      expect(mockPrismaService.farm.update).toHaveBeenCalledWith({
        where: { id: 'farm-id-1' },
        data: { name: 'Plantação A Atualizada' },
      });
      expect(result).toEqual(updatedFarm);
    });

    it('deve lançar FarmNotFoundException quando a plantação não existir', async () => {
      mockPrismaService.farm.findUnique.mockResolvedValue(null);

      await expect(service.update('id-invalido', { name: 'Plantação Nova' })).rejects.toThrow(FarmNotFoundException);
      expect(mockPrismaService.farm.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover a plantação quando encontrada', async () => {
      const farm = { id: 'farm-id-1', name: 'Plantação A', userId: 'user-id-1' };
      mockPrismaService.farm.findUnique.mockResolvedValue(farm);
      mockPrismaService.farm.delete.mockResolvedValue(farm);

      const result = await service.remove('farm-id-1');

      expect(mockPrismaService.farm.delete).toHaveBeenCalledWith({ where: { id: 'farm-id-1' } });
      expect(result).toEqual(farm);
    });

    it('deve lançar FarmNotFoundException quando a plantação não existir', async () => {
      mockPrismaService.farm.findUnique.mockResolvedValue(null);

      await expect(service.remove('id-invalido')).rejects.toThrow(FarmNotFoundException);
      expect(mockPrismaService.farm.delete).not.toHaveBeenCalled();
    });
  });
});
