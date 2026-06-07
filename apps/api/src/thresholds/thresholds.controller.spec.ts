import { Test, TestingModule } from '@nestjs/testing';
import { ThresholdsController } from './thresholds.controller';
import { ThresholdsService } from './thresholds.service';

const mockThresholdsService = {
  create: jest.fn(),
  findByFarm: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ThresholdsController', () => {
  let controller: ThresholdsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThresholdsController],
      providers: [
        { provide: ThresholdsService, useValue: mockThresholdsService },
      ],
    }).compile();

    controller = module.get<ThresholdsController>(ThresholdsController);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create deve delegar ao ThresholdsService', async () => {
    const dto = { farmId: 'farm-id-1', type: 'TEMPERATURA', min: 10, max: 40 };
    const threshold = { id: 'threshold-id-1', ...dto };
    mockThresholdsService.create.mockResolvedValue(threshold);

    const result = await controller.create(dto as any);

    expect(mockThresholdsService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(threshold);
  });

  it('findByFarm deve delegar ao ThresholdsService', async () => {
    const thresholds = [{ id: 'threshold-id-1', farmId: 'farm-id-1' }];
    mockThresholdsService.findByFarm.mockResolvedValue(thresholds);

    const result = await controller.findByFarm('farm-id-1');

    expect(mockThresholdsService.findByFarm).toHaveBeenCalledWith('farm-id-1');
    expect(result).toEqual(thresholds);
  });

  it('findOne deve delegar ao ThresholdsService', async () => {
    const threshold = {
      id: 'threshold-id-1',
      farmId: 'farm-id-1',
      type: 'TEMPERATURA',
    };
    mockThresholdsService.findOne.mockResolvedValue(threshold);

    const result = await controller.findOne('threshold-id-1');

    expect(mockThresholdsService.findOne).toHaveBeenCalledWith(
      'threshold-id-1',
    );
    expect(result).toEqual(threshold);
  });

  it('update deve delegar ao ThresholdsService', async () => {
    const threshold = { id: 'threshold-id-1', max: 50 };
    mockThresholdsService.update.mockResolvedValue(threshold);

    const result = await controller.update('threshold-id-1', {
      max: 50,
    } as any);

    expect(mockThresholdsService.update).toHaveBeenCalledWith(
      'threshold-id-1',
      { max: 50 },
    );
    expect(result).toEqual(threshold);
  });

  it('remove deve delegar ao ThresholdsService', async () => {
    mockThresholdsService.remove.mockResolvedValue(undefined);

    await controller.remove('threshold-id-1');

    expect(mockThresholdsService.remove).toHaveBeenCalledWith('threshold-id-1');
  });
});
