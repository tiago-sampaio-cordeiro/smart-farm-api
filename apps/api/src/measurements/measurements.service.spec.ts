import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementsService } from './measurements.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlertsService } from 'src/alerts/alerts.service';
import { ThresholdsService } from 'src/thresholds/thresholds.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  measurement: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
  sensor: {
    findUnique: jest.fn(),
  },
};

const mockAlertsService = {
  create: jest.fn(),
};

const mockThresholdsService = {
  findByFarm: jest.fn(),
};

describe('MeasurementsService', () => {
  let service: MeasurementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasurementsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AlertsService, useValue: mockAlertsService },
        { provide: ThresholdsService, useValue: mockThresholdsService },
      ],
    }).compile();

    service = module.get<MeasurementsService>(MeasurementsService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma medição e não gerar alerta quando o valor está dentro dos limites', async () => {
      const dto = { sensorId: 'sensor-id-1', temperatura: 25, umidade: 80, luminosidade: 100, timestamp: new Date('2026-01-01T00:00:00.000Z') };
      const measurement = { id: 'meas-id-1', sensorId: 'sensor-id-1', temperatura: 25, umidade: 80, luminosidade: 100, timestamp: new Date('2026-01-01T00:00:00.000Z') };
      const sensor = { id: 'sensor-id-1', farmId: 'farm-id-1' };
      const thresholds = [{ id: 'th-id-1', type: 'temperatura', min: 10, max: 40 }];

      mockPrismaService.measurement.create.mockResolvedValue(measurement);
      mockPrismaService.sensor.findUnique.mockResolvedValue(sensor);
      mockThresholdsService.findByFarm.mockResolvedValue(thresholds);

      const result = await service.create(dto as any);

      expect(mockPrismaService.measurement.create).toHaveBeenCalledWith({ data: dto });
      expect(mockAlertsService.create).not.toHaveBeenCalled();
      expect(result).toEqual(measurement);
    });

    it('deve criar uma medição e gerar alerta CRITICO quando o valor excede 20% acima do máximo', async () => {
      const dto = { sensorId: 'sensor-id-1', temperatura: 50, umidade: 80, luminosidade: 100, timestamp: new Date('2026-01-01T00:00:00.000Z') };
      const measurement = { id: 'meas-id-1', sensorId: 'sensor-id-1', temperatura: 50, umidade: 80, luminosidade: 100, timestamp: new Date('2026-01-01T00:00:00.000Z') };
      const sensor = { id: 'sensor-id-1', farmId: 'farm-id-1' };
      // 50 > 40, diff = (50-40)/40 * 100 = 25% → CRITICO
      const thresholds = [{ id: 'th-id-1', type: 'temperatura', min: 10, max: 40 }];

      mockPrismaService.measurement.create.mockResolvedValue(measurement);
      mockPrismaService.sensor.findUnique.mockResolvedValue(sensor);
      mockThresholdsService.findByFarm.mockResolvedValue(thresholds);
      mockAlertsService.create.mockResolvedValue({});

      await service.create(dto as any);

      expect(mockAlertsService.create).toHaveBeenCalledWith({
        type: 'threshold_exceeded',
        severity: 'CRITICO',
        measurement: { connect: { id: measurement.id } },
      });
    });

    it('deve criar uma medição e gerar alerta MODERADO quando o valor excede 10%–19% acima do máximo', async () => {
      const dto = { sensorId: 'sensor-id-1', temperatura: 44, umidade: 80, luminosidade: 100, timestamp: new Date('2026-01-01T00:00:00.000Z') };
      const measurement = { id: 'meas-id-1', sensorId: 'sensor-id-1', temperatura: 44, umidade: 80, luminosidade: 100, timestamp: new Date('2026-01-01T00:00:00.000Z') };
      const sensor = { id: 'sensor-id-1', farmId: 'farm-id-1' };
      // 44 > 40, diff = (44-40)/40 * 100 = 10% → MODERADO
      const thresholds = [{ id: 'th-id-1', type: 'temperatura', min: 10, max: 40 }];

      mockPrismaService.measurement.create.mockResolvedValue(measurement);
      mockPrismaService.sensor.findUnique.mockResolvedValue(sensor);
      mockThresholdsService.findByFarm.mockResolvedValue(thresholds);
      mockAlertsService.create.mockResolvedValue({});

      await service.create(dto);

      expect(mockAlertsService.create).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'MODERADO' }),
      );
    });

    it('deve criar uma medição e gerar alerta NORMAL quando o valor excede menos de 10% acima do máximo', async () => {
      const dto = { sensorId: 'sensor-id-1', temperatura: 42, umidade: 80, luminosidade: 100, timestamp: new Date('2026-01-01T00:00:00.000Z') };
      const measurement = { id: 'meas-id-1', sensorId: 'sensor-id-1', temperatura: 42, umidade: 80, luminosidade: 100, timestamp: new Date('2026-01-01T00:00:00.000Z') };
      const sensor = { id: 'sensor-id-1', farmId: 'farm-id-1' };
      // 42 > 40, diff = (42-40)/40 * 100 = 5% → NORMAL
      const thresholds = [{ id: 'th-id-1', type: 'temperatura', min: 10, max: 40 }];

      mockPrismaService.measurement.create.mockResolvedValue(measurement);
      mockPrismaService.sensor.findUnique.mockResolvedValue(sensor);
      mockThresholdsService.findByFarm.mockResolvedValue(thresholds);
      mockAlertsService.create.mockResolvedValue({});

      await service.create(dto as any);

      expect(mockAlertsService.create).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'NORMAL' }),
      );
    });

    it('não deve criar alerta quando o sensor não for encontrado', async () => {
      const dto = { sensorId: 'sensor-id-nao-existe', temperatura: 99, umidade: 80, luminosidade: 100, timestamp: new Date('2026-01-01T00:00:00.000Z') };
      const measurement = { id: 'meas-id-1', sensorId: 'sensor-id-nao-ex  iste', temperatura: 99, umidade: 80, luminosidade: 100, timestamp: new Date('2026-01-01T00:00:00.000Z') };

      mockPrismaService.measurement.create.mockResolvedValue(measurement);
      mockPrismaService.sensor.findUnique.mockResolvedValue(null);

      const result = await service.create(dto as any);

      expect(mockThresholdsService.findByFarm).not.toHaveBeenCalled();
      expect(mockAlertsService.create).not.toHaveBeenCalled();
      expect(result).toEqual(measurement);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as medições sem filtro', async () => {
      const measurements = [{ id: 'meas-id-1' }, { id: 'meas-id-2' }];
      mockPrismaService.measurement.findMany.mockResolvedValue(measurements);

      const result = await service.findAll();

      expect(mockPrismaService.measurement.findMany).toHaveBeenCalled();
      expect(result).toEqual(measurements);
    });

    it('deve filtrar medições por sensorId', async () => {
      const measurements = [{ id: 'meas-id-1', sensorId: 'sensor-id-1' }];
      mockPrismaService.measurement.findMany.mockResolvedValue(measurements);

      const result = await service.findAll('sensor-id-1');

      expect(mockPrismaService.measurement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ sensorId: 'sensor-id-1' }) }),
      );
      expect(result).toEqual(measurements);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma medição quando encontrada', async () => {
      const measurement = { id: 'meas-id-1', sensorId: 'sensor-id-1', temperatura: 25 };
      mockPrismaService.measurement.findUnique.mockResolvedValue(measurement);

      const result = await service.findOne('meas-id-1');

      expect(mockPrismaService.measurement.findUnique).toHaveBeenCalledWith({ where: { id: 'meas-id-1' } });
      expect(result).toEqual(measurement);
    });

    it('deve lançar NotFoundException quando a medição não for encontrada', async () => {
      mockPrismaService.measurement.findUnique.mockResolvedValue(null);

      await expect(service.findOne('id-invalido')).rejects.toThrow(NotFoundException);
    });
  });
});
