import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';

const mockMeasurementsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
};

describe('MeasurementsController', () => {
  let controller: MeasurementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasurementsController],
      providers: [
        { provide: MeasurementsService, useValue: mockMeasurementsService },
      ],
    }).compile();

    controller = module.get<MeasurementsController>(MeasurementsController);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create deve delegar ao MeasurementsService', async () => {
    const dto = {
      sensorId: 'sensor-id-1',
      temperature: 25,
      umidade: 80,
      luminosidade: 100,
      timestamp: new Date('2026-01-01T00:00:00.000Z'),
    };
    const measurement = { id: 'meas-id-1', ...dto };
    mockMeasurementsService.create.mockResolvedValue(measurement);

    const result = await controller.create(dto);

    expect(mockMeasurementsService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(measurement);
  });

  it('findAll deve delegar ao MeasurementsService com filtro de sensorId', async () => {
    const measurements = [{ id: 'meas-id-1', sensorId: 'sensor-id-1' }];
    mockMeasurementsService.findAll.mockResolvedValue(measurements);

    const result = await controller.findAll('sensor-id-1');

    expect(mockMeasurementsService.findAll).toHaveBeenCalledWith(
      'sensor-id-1',
      undefined,
      undefined,
      undefined,
    );
    expect(result).toEqual(measurements);
  });

  it('findAll deve delegar ao MeasurementsService com filtro de farmId', async () => {
    const measurements = [{ id: 'meas-id-1', sensorId: 'sensor-id-1' }];
    mockMeasurementsService.findAll.mockResolvedValue(measurements);

    const result = await controller.findAll(
      undefined,
      'farm-id-1',
    );

    expect(mockMeasurementsService.findAll).toHaveBeenCalledWith(
      undefined,
      'farm-id-1',
      undefined,
      undefined,
    );
    expect(result).toEqual(measurements);
  });

  it('findAll deve delegar ao MeasurementsService com filtro de período', async () => {
    const measurements = [{ id: 'meas-id-1' }];
    mockMeasurementsService.findAll.mockResolvedValue(measurements);

    const result = await controller.findAll(
      undefined,
      undefined,
      '2026-01-01T00:00:00Z',
      '2026-12-31T23:59:59Z',
    );

    expect(mockMeasurementsService.findAll).toHaveBeenCalledWith(
      undefined,
      undefined,
      '2026-01-01T00:00:00Z',
      '2026-12-31T23:59:59Z',
    );
    expect(result).toEqual(measurements);
  });

  it('findOne deve delegar ao MeasurementsService', async () => {
    const measurement = {
      id: 'meas-id-1',
      sensorId: 'sensor-id-1',
      temperature: 25,
      umidade: 80,
      luminosidade: 100,
      timestamp: new Date('2026-01-01T00:00:00.000Z'),
    };
    mockMeasurementsService.findOne.mockResolvedValue(measurement);

    const result = await controller.findOne('meas-id-1');

    expect(mockMeasurementsService.findOne).toHaveBeenCalledWith('meas-id-1');
    expect(result).toEqual(measurement);
  });
});
