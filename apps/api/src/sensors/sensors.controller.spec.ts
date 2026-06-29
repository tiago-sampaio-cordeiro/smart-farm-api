import { Test, TestingModule } from '@nestjs/testing';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { PrismaService } from 'src/prisma/prisma.service';

const mockSensorsService = {
  create: jest.fn(),
  findByFarm: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockPrismaService = {
  farm: { findUnique: jest.fn() },
  sensor: { findUnique: jest.fn() },
};

describe('SensorsController', () => {
  let controller: SensorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorsController],
      providers: [
        { provide: SensorsService, useValue: mockSensorsService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<SensorsController>(SensorsController);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create deve delegar ao SensorsService com farmId injetado', async () => {
    const dto = { name: 'Sensor Temp', type: 'TEMPERATURA' };
    const sensor = { id: 'sensor-id-1', farmId: 'farm-id-1', ...dto };
    mockSensorsService.create.mockResolvedValue(sensor);
    const result = await controller.create('farm-id-1', dto as any);
    expect(mockSensorsService.create).toHaveBeenCalledWith({
      ...dto,
      farmId: 'farm-id-1',
    });
    expect(result).toEqual(sensor);
  });

  it('findAll deve delegar ao SensorsService com farmId', async () => {
    const sensors = [{ id: 'sensor-id-1', farmId: 'farm-id-1' }];
    mockSensorsService.findByFarm.mockResolvedValue(sensors);
    const result = await controller.findAll('farm-id-1');
    expect(mockSensorsService.findByFarm).toHaveBeenCalledWith('farm-id-1');
    expect(result).toEqual(sensors);
  });

  it('findOne deve delegar ao SensorsService', async () => {
    const sensor = { id: 'sensor-id-1', farmId: 'farm-id-1' };
    mockSensorsService.findOne.mockResolvedValue(sensor);
    const result = await controller.findOne('sensor-id-1');
    expect(mockSensorsService.findOne).toHaveBeenCalledWith('sensor-id-1');
    expect(result).toEqual(sensor);
  });

  it('update deve delegar ao SensorsService', async () => {
    const sensor = { id: 'sensor-id-1', name: 'Atualizado' };
    mockSensorsService.update.mockResolvedValue(sensor);
    const result = await controller.update('sensor-id-1', {
      name: 'Atualizado',
    } as any);
    expect(mockSensorsService.update).toHaveBeenCalledWith('sensor-id-1', {
      name: 'Atualizado',
    });
    expect(result).toEqual(sensor);
  });

  it('remove deve delegar ao SensorsService', async () => {
    mockSensorsService.remove.mockResolvedValue(undefined);
    await controller.remove('sensor-id-1');
    expect(mockSensorsService.remove).toHaveBeenCalledWith('sensor-id-1');
  });
});
