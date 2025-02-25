import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionRepository } from '../subscription.repository';
import { DatabaseService } from '../../database/database.service';
import { SubscriptionStatus } from '../types/subscription.types';
import { OnboardingEntry } from '../../onboarding/types/onboarding.types';

describe('SubscriptionRepository', () => {
  let repository: SubscriptionRepository;
  let databaseService: DatabaseService;

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
        SubscriptionRepository,
        {
          provide: DatabaseService,
          useValue: {
            getData: jest.fn().mockResolvedValue([mockSubscription]),
            setData: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<SubscriptionRepository>(SubscriptionRepository);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  describe('create', () => {
    it('should create a new subscription', async () => {
      const onboarding: OnboardingEntry = {
        id: 'onboard123',
        dogProfile: { name: 'Max', age: 3, weight: 15 },
        recommendation: {
          pricePerMonth: 49.99,
          dailyPortionGrams: 250,
          contents: ['Chicken', 'Rice'],
          monthlyAmount: 7500,
          timestamp: new Date().toISOString(),
        },
      };

      const result = await repository.create({ mealRecommendationId: 'meal123' }, onboarding);
      expect(result.status).toBe(SubscriptionStatus.ACTIVE);
      expect(result.dogName).toBe('Max');
      expect(databaseService.setData).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update subscription status', async () => {
      const result = await repository.updateStatus('123', SubscriptionStatus.PAUSED);
      expect(result.status).toBe(SubscriptionStatus.PAUSED);
      expect(result.pausedAt).toBeDefined();
    });

    it('should not update cancelled subscriptions', async () => {
      const cancelledSub = { ...mockSubscription, status: SubscriptionStatus.CANCELLED };
      jest.spyOn(databaseService, 'getData').mockResolvedValueOnce([cancelledSub]);

      const result = await repository.updateStatus('123', SubscriptionStatus.ACTIVE);
      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save subscription changes', async () => {
      const updatedSub = { ...mockSubscription, price: 59.99 };
      const result = await repository.save(updatedSub);
      expect(result.price).toBe(59.99);
      expect(databaseService.setData).toHaveBeenCalled();
    });
  });
});
