import { Test, TestingModule } from '@nestjs/testing';
import { SensorsService } from './sensors.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  sensor: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('SensorsService', () => {
  let service: SensorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SensorsService>(SensorsService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar e retornar um novo sensor com sucesso', async () => {
      const data = { type: 'TEMPERATURA', farmId: 'farm-id-1' };
      const created = {
        id: 'sensor-id-1',
        ...data,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      };
      mockPrismaService.sensor.create.mockResolvedValue(created);

      const result = await service.create(data);

      expect(mockPrismaService.sensor.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(created);
    });
  });

  describe('findByFarm', () => {
    it('deve retornar todos os sensores de uma fazenda', async () => {
      const sensors = [
        { id: 'sensor-id-1', farmId: 'farm-id-1', type: 'TEMPERATURA' },
        { id: 'sensor-id-2', farmId: 'farm-id-1', type: 'UMIDADE' },
      ];
      mockPrismaService.sensor.findMany.mockResolvedValue(sensors);

      const result = await service.findByFarm('farm-id-1');

      expect(mockPrismaService.sensor.findMany).toHaveBeenCalledWith({
        where: { farmId: 'farm-id-1' },
      });
      expect(result).toEqual(sensors);
    });
  });

  describe('findOne', () => {
    it('deve retornar um sensor quando encontrado', async () => {
      const sensor = {
        id: 'sensor-id-1',
        farmId: 'farm-id-1',
        type: 'TEMPERATURA',
      };
      mockPrismaService.sensor.findUnique.mockResolvedValue(sensor);

      const result = await service.findOne('sensor-id-1');

      expect(mockPrismaService.sensor.findUnique).toHaveBeenCalledWith({
        where: { id: 'sensor-id-1' },
      });
      expect(result).toEqual(sensor);
    });

    it('deve lançar NotFoundException quando o sensor não for encontrado', async () => {
      mockPrismaService.sensor.findUnique.mockResolvedValue(null);

      await expect(service.findOne('id-invalido')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar o sensor quando encontrado', async () => {
      const sensor = {
        id: 'sensor-id-1',
        farmId: 'farm-id-1',
        type: 'TEMPERATURA',
      };
      const updated = { ...sensor, type: 'UMIDADE' };
      mockPrismaService.sensor.findUnique.mockResolvedValue(sensor);
      mockPrismaService.sensor.update.mockResolvedValue(updated);

      const result = await service.update('sensor-id-1', { type: 'UMIDADE' });

      expect(mockPrismaService.sensor.update).toHaveBeenCalledWith({
        where: { id: 'sensor-id-1' },
        data: { type: 'UMIDADE' },
      });
      expect(result).toEqual(updated);
    });

    it('deve lançar NotFoundException quando o sensor não existir', async () => {
      mockPrismaService.sensor.findUnique.mockResolvedValue(null);

      await expect(
        service.update('id-invalido', { type: 'UMIDADE' }),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.sensor.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover o sensor quando encontrado', async () => {
      const sensor = {
        id: 'sensor-id-1',
        farmId: 'farm-id-1',
        type: 'TEMPERATURA',
      };
      mockPrismaService.sensor.findUnique.mockResolvedValue(sensor);
      mockPrismaService.sensor.delete.mockResolvedValue(sensor);

      const result = await service.remove('sensor-id-1');

      expect(mockPrismaService.sensor.delete).toHaveBeenCalledWith({
        where: { id: 'sensor-id-1' },
      });
      expect(result).toEqual(sensor);
    });

    it('deve lançar NotFoundException quando o sensor não existir', async () => {
      mockPrismaService.sensor.findUnique.mockResolvedValue(null);

      await expect(service.remove('id-invalido')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.sensor.delete).not.toHaveBeenCalled();
    });
  });
});
