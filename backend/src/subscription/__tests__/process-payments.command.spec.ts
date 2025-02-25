import { Test, TestingModule } from '@nestjs/testing';
import { ProcessPaymentsCommand } from '../commands/process-payments.command';
import { SubscriptionService } from '../subscription.service';
import { PaymentRepository } from '../payment.repository';
import { SubscriptionStatus } from '../types/subscription.types';

describe('ProcessPaymentsCommand', () => {
  let command: ProcessPaymentsCommand;
  let subscriptionService: SubscriptionService;
  let paymentRepository: PaymentRepository;

  const mockSubscription = {
    id: '123',
    dogName: 'Max',
    status: SubscriptionStatus.ACTIVE,
    mealRecommendationId: 'meal123',
    price: 49.99,
    portionWeightGrams: 250,
    createdAt: new Date().toISOString(),
    contents: ['Chicken', 'Rice'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessPaymentsCommand,
        {
          provide: SubscriptionService,
          useValue: {
            getAllSubscriptions: jest.fn().mockResolvedValue([mockSubscription]),
            updateLastPaymentDate: jest.fn(),
          },
        },
        {
          provide: PaymentRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    command = module.get<ProcessPaymentsCommand>(ProcessPaymentsCommand);
    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
    paymentRepository = module.get<PaymentRepository>(PaymentRepository);
  });

  it('should process payments for active subscriptions', async () => {
    const payment = {
      id: 'pay123',
      subscriptionId: '123',
      amount: 49.99,
      status: 'SUCCESS' as const,
      processedAt: new Date().toISOString(),
    };

    jest.spyOn(paymentRepository, 'create').mockResolvedValue(payment);

    await command.run();

    expect(subscriptionService.getAllSubscriptions).toHaveBeenCalled();
    expect(paymentRepository.create).toHaveBeenCalledWith('123', 49.99);
    expect(subscriptionService.updateLastPaymentDate).toHaveBeenCalledWith(
      '123',
      payment.processedAt,
    );
  });

  it('should skip payments for non-active subscriptions', async () => {
    const cancelledSub = { ...mockSubscription, status: SubscriptionStatus.CANCELLED };
    jest.spyOn(subscriptionService, 'getAllSubscriptions').mockResolvedValueOnce([cancelledSub]);

    await command.run();

    expect(paymentRepository.create).not.toHaveBeenCalled();
  });

  it('should skip payments if not due yet', async () => {
    const recentlyPaidSub = {
      ...mockSubscription,
      lastPaymentDate: new Date().toISOString(),
    };
    jest.spyOn(subscriptionService, 'getAllSubscriptions').mockResolvedValueOnce([recentlyPaidSub]);

    await command.run();

    expect(paymentRepository.create).not.toHaveBeenCalled();
  });
});
