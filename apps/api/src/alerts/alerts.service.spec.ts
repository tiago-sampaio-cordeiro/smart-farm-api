import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { AlertType, AlertSeverity, Prisma } from '@prisma/client';

const mockPrismaService = {
  alert: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('AlertsService', () => {
  let service: AlertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar e retornar um alerta com sucesso', async () => {
      const data: Prisma.AlertCreateInput = {
        type: AlertType.threshold_exceeded,
        severity: AlertSeverity.CRITICO,
        measurement: { connect: { id: 'meas-id-1' } },
      };
      const created = { id: 'alert-id-1', type: data.type, severity: data.severity, measurementId: 'meas-id-1' };
      mockPrismaService.alert.create.mockResolvedValue(created);

      const result = await service.create(data);

      expect(mockPrismaService.alert.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os alertas sem filtro', async () => {
      const alerts = [
        { id: 'alert-id-1', type: 'threshold_exceeded', severity: 'CRITICO' },
        { id: 'alert-id-2', type: 'threshold_exceeded', severity: 'MODERADO' },
      ];
      mockPrismaService.alert.findMany.mockResolvedValue(alerts);

      const result = await service.findAll();

      expect(mockPrismaService.alert.findMany).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual(alerts);
    });

    it('deve filtrar alertas por severity', async () => {
      const alerts = [{ id: 'alert-id-1', type: 'threshold_exceeded', severity: 'CRITICO' }];
      mockPrismaService.alert.findMany.mockResolvedValue(alerts);

      const result = await service.findAll('CRITICO');

      expect(mockPrismaService.alert.findMany).toHaveBeenCalledWith({
        where: { severity: 'CRITICO' },
      });
      expect(result).toEqual(alerts);
    });

    it('deve filtrar alertas por type', async () => {
      const alerts = [{ id: 'alert-id-1', type: 'threshold_exceeded', severity: 'NORMAL' }];
      mockPrismaService.alert.findMany.mockResolvedValue(alerts);

      const result = await service.findAll(undefined, 'threshold_exceeded');

      expect(mockPrismaService.alert.findMany).toHaveBeenCalledWith({
        where: { type: 'threshold_exceeded' },
      });
      expect(result).toEqual(alerts);
    });
  });

  describe('findOne', () => {
    it('deve retornar um alerta quando encontrado', async () => {
      const alert = { id: 'alert-id-1', type: 'threshold_exceeded', severity: 'CRITICO' };
      mockPrismaService.alert.findUnique.mockResolvedValue(alert);

      const result = await service.findOne('alert-id-1');

      expect(mockPrismaService.alert.findUnique).toHaveBeenCalledWith({ where: { id: 'alert-id-1' } });
      expect(result).toEqual(alert);
    });

    it('deve lançar NotFoundException quando o alerta não for encontrado', async () => {
      mockPrismaService.alert.findUnique.mockResolvedValue(null);

      await expect(service.findOne('id-invalido')).rejects.toThrow(NotFoundException);
    });
  });
});
