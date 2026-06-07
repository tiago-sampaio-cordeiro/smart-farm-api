import { Test, TestingModule } from '@nestjs/testing';
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';

const mockFarmsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('FarmsController', () => {
  let controller: FarmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmsController],
      providers: [
        { provide: FarmsService, useValue: mockFarmsService },
      ],
    }).compile();

    controller = module.get<FarmsController>(FarmsController);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create deve delegar ao FarmsService', async () => {
    const dto = { name: 'Fazenda A', userId: 'user-id-1' };
    const farm = { id: 'farm-id-1', ...dto };
    mockFarmsService.create.mockResolvedValue(farm);

    const result = await controller.create(dto);

    expect(mockFarmsService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(farm);
  });

  it('findAll deve delegar ao FarmsService', async () => {
    const farms = [{ id: 'farm-id-1', name: 'Fazenda A' }];
    mockFarmsService.findAll.mockResolvedValue(farms);

    const result = await controller.findAll();

    expect(mockFarmsService.findAll).toHaveBeenCalled();
    expect(result).toEqual(farms);
  });

  it('findOne deve delegar ao FarmsService', async () => {
    const farm = { id: 'farm-id-1', name: 'Fazenda A' };
    mockFarmsService.findOne.mockResolvedValue(farm);

    const result = await controller.findOne('farm-id-1');

    expect(mockFarmsService.findOne).toHaveBeenCalledWith('farm-id-1');
    expect(result).toEqual(farm);
  });

  it('update deve delegar ao FarmsService', async () => {
    const farm = { id: 'farm-id-1', name: 'Atualizado' };
    mockFarmsService.update.mockResolvedValue(farm);

    const result = await controller.update('farm-id-1', { name: 'Atualizado' });

    expect(mockFarmsService.update).toHaveBeenCalledWith('farm-id-1', { name: 'Atualizado' });
    expect(result).toEqual(farm);
  });

  it('remove deve delegar ao FarmsService', () => {
    mockFarmsService.remove.mockResolvedValue(undefined);

    controller.remove('farm-id-1');

    expect(mockFarmsService.remove).toHaveBeenCalledWith('farm-id-1');
  });
});
