import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from '../subscription.service';
import { SubscriptionRepository } from '../subscription.repository';
import { OnboardingRepository } from '../../onboarding/onboarding.repository';
import { Subscription, SubscriptionStatus } from '../types/subscription.types';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let subscriptionRepo: SubscriptionRepository;
  let onboardingRepo: OnboardingRepository;

  const mockSubscription = {
    id: '123',
    dogName: 'Max',
    status: SubscriptionStatus.ACTIVE,
    price: 49.99,
    portionWeightGrams: 250,
    createdAt: new Date().toISOString(),
    contents: ['Chicken', 'Rice'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: SubscriptionRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockSubscription),
            findById: jest.fn().mockResolvedValue(mockSubscription),
            getAll: jest.fn().mockResolvedValue([mockSubscription]),
            cancel: jest.fn(),
            updateStatus: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: OnboardingRepository,
          useValue: {
            getMealRecommendation: jest.fn().mockResolvedValue({
              dogProfile: { name: 'Max' },
              recommendation: {
                pricePerMonth: 49.99,
                dailyPortionGrams: 250,
                contents: ['Chicken', 'Rice'],
              },
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    subscriptionRepo = module.get<SubscriptionRepository>(SubscriptionRepository);
    onboardingRepo = module.get<OnboardingRepository>(OnboardingRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSubscription', () => {
    it('should create a new subscription', async () => {
      const result = await service.createSubscription({ mealRecommendationId: '123' });
      expect(result).toEqual(mockSubscription);
      expect(onboardingRepo.getMealRecommendation).toHaveBeenCalledWith('123');
    });

    it('should throw if meal recommendation not found', async () => {
      jest.spyOn(onboardingRepo, 'getMealRecommendation').mockResolvedValueOnce(null);
      await expect(service.createSubscription({ mealRecommendationId: '123' })).rejects.toThrow(
        'Meal recommendation not found',
      );
    });
  });

  describe('getAllSubscriptions', () => {
    it('should return sorted subscriptions with active first', async () => {
      const mockSubs = [
        { ...mockSubscription, status: SubscriptionStatus.CANCELLED },
        { ...mockSubscription, status: SubscriptionStatus.ACTIVE },
      ];
      jest.spyOn(subscriptionRepo, 'getAll').mockResolvedValueOnce(mockSubs as Subscription[]);

      const result = await service.getAllSubscriptions();
      expect(result[0].status).toBe(SubscriptionStatus.ACTIVE);
      expect(result[1].status).toBe(SubscriptionStatus.CANCELLED);
    });
  });

  describe('updateLastPaymentDate', () => {
    it('should update the last payment date', async () => {
      const date = new Date().toISOString();
      const updatedSub = { ...mockSubscription, lastPaymentDate: date };
      jest.spyOn(subscriptionRepo, 'save').mockResolvedValueOnce(updatedSub as Subscription);

      const result = await service.updateLastPaymentDate('123', date);
      expect(result.lastPaymentDate).toBe(date);
      expect(subscriptionRepo.save).toHaveBeenCalled();
    });

    it('should throw if subscription not found', async () => {
      jest.spyOn(subscriptionRepo, 'findById').mockResolvedValueOnce(null);
      await expect(service.updateLastPaymentDate('123', new Date().toISOString())).rejects.toThrow(
        'Subscription not found',
      );
    });
  });
});
