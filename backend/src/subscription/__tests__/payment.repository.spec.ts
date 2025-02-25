import { Test, TestingModule } from '@nestjs/testing';
import { PaymentRepository } from '../payment.repository';
import { DatabaseService } from '../../database/database.service';

describe('PaymentRepository', () => {
  let repository: PaymentRepository;
  let databaseService: DatabaseService;

  const mockPayment = {
    id: '123',
    subscriptionId: '456',
    amount: 49.99,
    status: 'SUCCESS' as const,
    processedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentRepository,
        {
          provide: DatabaseService,
          useValue: {
            getData: jest.fn().mockResolvedValue([mockPayment]),
            setData: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<PaymentRepository>(PaymentRepository);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new payment', async () => {
      const result = await repository.create('456', 49.99);
      expect(result.subscriptionId).toBe('456');
      expect(result.amount).toBe(49.99);
      expect(result.status).toBe('SUCCESS');
      expect(databaseService.setData).toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should return all payments', async () => {
      const result = await repository.getAll();
      expect(result).toEqual([mockPayment]);
      expect(databaseService.getData).toHaveBeenCalledWith('payments');
    });

    it('should return empty array if no payments exist', async () => {
      jest.spyOn(databaseService, 'getData').mockResolvedValueOnce(null);
      const result = await repository.getAll();
      expect(result).toEqual([]);
    });
  });
});
