import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database.service';
import { Subscription, SubscriptionStatus } from '../../subscription/types/subscription.types';

jest.mock('lowdb');
jest.mock('lowdb/node');

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should initialize with empty collections', async () => {
    await service.onModuleInit();
    expect(service['db'].data).toEqual({
      subscriptions: [],
      onboarding: [],
      payments: [],
    });
  });

  describe('getData', () => {
    it('should return collection data', async () => {
      const mockData: Subscription[] = [
        {
          id: '123',
          dogName: 'Max',
          status: SubscriptionStatus.ACTIVE,
          mealRecommendationId: 'meal123',
          price: 49.99,
          portionWeightGrams: 250,
          createdAt: new Date().toISOString(),
          contents: ['Chicken', 'Rice'],
        },
      ];
      service['db'].data = { subscriptions: mockData, onboarding: [], payments: [] };

      const result = await service.getData('subscriptions');
      expect(result).toEqual(mockData);
    });
  });

  describe('setData', () => {
    it('should update collection data', async () => {
      const mockData: Subscription[] = [
        {
          id: '123',
          dogName: 'Max',
          status: SubscriptionStatus.ACTIVE,
          mealRecommendationId: 'meal123',
          price: 49.99,
          portionWeightGrams: 250,
          createdAt: new Date().toISOString(),
          contents: ['Chicken', 'Rice'],
        },
      ];
      await service.setData('subscriptions', mockData);
      expect(service['db'].data.subscriptions).toEqual(mockData);
      expect(service['db'].write).toHaveBeenCalled();
    });
  });

  describe('clearDatabase', () => {
    it('should clear all collections', async () => {
      await service.clearDatabase();
      expect(service['db'].data).toEqual({
        subscriptions: [],
        onboarding: [],
        payments: [],
      });
      expect(service['db'].write).toHaveBeenCalled();
    });
  });
});
