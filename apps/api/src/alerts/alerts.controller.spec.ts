import { Test, TestingModule } from '@nestjs/testing';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

const mockAlertsService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
};

describe('AlertsController', () => {
  let controller: AlertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsController],
      providers: [{ provide: AlertsService, useValue: mockAlertsService }],
    }).compile();

    controller = module.get<AlertsController>(AlertsController);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('findAll deve delegar ao AlertsService com filtros', async () => {
    const alerts = [
      { id: 'alert-id-1', severity: 'CRITICO', type: 'threshold_exceeded' },
    ];
    mockAlertsService.findAll.mockResolvedValue(alerts);

    const result = await controller.findAll({
      severity: 'CRITICO',
      type: 'threshold_exceeded',
    } as any);

    expect(mockAlertsService.findAll).toHaveBeenCalledWith(
      'CRITICO',
      'threshold_exceeded',
    );
    expect(result).toEqual(alerts);
  });

  it('findOne deve delegar ao AlertsService', async () => {
    const alert = {
      id: 'alert-id-1',
      severity: 'CRITICO',
      type: 'threshold_exceeded',
    };
    mockAlertsService.findOne.mockResolvedValue(alert);

    const result = await controller.findOne('alert-id-1');

    expect(mockAlertsService.findOne).toHaveBeenCalledWith('alert-id-1');
    expect(result).toEqual(alert);
  });
});
