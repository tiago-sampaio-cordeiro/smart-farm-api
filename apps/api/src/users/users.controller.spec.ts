import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsersService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('findAll deve delegar ao UsersService', async () => {
    const users = [{ id: '1', name: 'Alice', email: 'alice@email.com' }];
    mockUsersService.findAll.mockResolvedValue(users);

    const result = await controller.findAll({ filter: undefined, page: 1 });

    expect(mockUsersService.findAll).toHaveBeenCalledWith(undefined, 1);
    expect(result).toEqual(users);
  });

  it('findOne deve delegar ao UsersService', async () => {
    const user = { id: 'user-id-1', name: 'Alice', email: 'alice@email.com' };
    mockUsersService.findOne.mockResolvedValue(user);

    const result = await controller.findOne('user-id-1');

    expect(mockUsersService.findOne).toHaveBeenCalledWith('user-id-1');
    expect(result).toEqual(user);
  });

  it('update deve delegar ao UsersService', async () => {
    const updated = { id: 'user-id-1', name: 'Atualizado' };
    mockUsersService.update.mockResolvedValue(updated);

    const result = await controller.update('user-id-1', { name: 'Atualizado' });

    expect(mockUsersService.update).toHaveBeenCalledWith('user-id-1', { name: 'Atualizado' });
    expect(result).toEqual(updated);
  });

  it('remove deve delegar ao UsersService', () => {
    mockUsersService.remove.mockResolvedValue(undefined);

    controller.remove('user-id-1');

    expect(mockUsersService.remove).toHaveBeenCalledWith('user-id-1');
  });
});
