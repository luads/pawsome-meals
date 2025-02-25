import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from '../subscription.controller';
import { SubscriptionService } from '../subscription.service';
import { NotFoundException } from '@nestjs/common';
import { Subscription, SubscriptionStatus } from '../types/subscription.types';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;
  let service: SubscriptionService;

  const mockSubscription: Subscription = {
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
      controllers: [SubscriptionController],
      providers: [
        {
          provide: SubscriptionService,
          useValue: {
            createSubscription: jest.fn().mockResolvedValue(mockSubscription),
            getAllSubscriptions: jest.fn().mockResolvedValue([mockSubscription]),
            getSubscription: jest.fn().mockResolvedValue(mockSubscription),
            updateSubscription: jest.fn().mockResolvedValue(mockSubscription),
            cancelSubscription: jest.fn().mockResolvedValue(mockSubscription),
          },
        },
      ],
    }).compile();

    controller = module.get<SubscriptionController>(SubscriptionController);
    service = module.get<SubscriptionService>(SubscriptionService);
  });

  describe('create', () => {
    it('should create a subscription', async () => {
      const dto = { mealRecommendationId: 'meal123' };
      const result = await controller.createSubscription(dto);
      expect(result).toEqual(mockSubscription);
      expect(service.createSubscription).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all subscriptions', async () => {
      const result = await controller.getAllSubscriptions();
      expect(result).toEqual([mockSubscription]);
      expect(service.getAllSubscriptions).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a subscription by id', async () => {
      const result = await controller.getSubscription('123');
      expect(result).toEqual(mockSubscription);
      expect(service.getSubscription).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException when subscription not found', async () => {
      jest.spyOn(service, 'getSubscription').mockResolvedValueOnce(null);
      await expect(controller.getSubscription('not-found')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update subscription status', async () => {
      const result = await controller.updateSubscription('123', {
        status: SubscriptionStatus.PAUSED,
      });
      expect(result).toEqual(mockSubscription);
      expect(service.updateSubscription).toHaveBeenCalledWith('123', {
        status: SubscriptionStatus.PAUSED,
      });
    });

    it('should throw NotFoundException when subscription not found', async () => {
      jest.spyOn(service, 'updateSubscription').mockResolvedValueOnce(null);
      await expect(
        controller.updateSubscription('123', { status: SubscriptionStatus.PAUSED }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancel', () => {
    it('should cancel a subscription', async () => {
      const result = await controller.cancelSubscription('123');
      expect(result).toEqual(mockSubscription);
      expect(service.cancelSubscription).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException when subscription not found', async () => {
      jest.spyOn(service, 'cancelSubscription').mockResolvedValueOnce(null);
      await expect(controller.cancelSubscription('not-found')).rejects.toThrow(NotFoundException);
    });
  });
});
