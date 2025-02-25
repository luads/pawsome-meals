import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingController } from '../onboarding.controller';
import { OnboardingService } from '../onboarding.service';
import { DogProfile, OnboardingEntry, MealRecommendation } from '../types/onboarding.types';

describe('OnboardingController', () => {
  let controller: OnboardingController;
  let service: OnboardingService;

  const mockDogProfile: DogProfile = {
    name: 'Max',
    age: 3,
    weight: 15,
  };

  const mockMealRecommendation: MealRecommendation = {
    dailyPortionGrams: 250,
    monthlyAmount: 7500,
    pricePerMonth: 49.99,
    contents: ['Chicken', 'Rice'],
    timestamp: new Date().toISOString(),
  };

  const mockEntry: OnboardingEntry = {
    id: 'rec123',
    dogProfile: mockDogProfile,
    recommendation: mockMealRecommendation,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnboardingController],
      providers: [
        {
          provide: OnboardingService,
          useValue: {
            createMealRecommendation: jest.fn().mockResolvedValue(mockEntry),
            getMealRecommendation: jest.fn().mockResolvedValue(mockEntry),
          },
        },
      ],
    }).compile();

    controller = module.get<OnboardingController>(OnboardingController);
    service = module.get<OnboardingService>(OnboardingService);
  });

  describe('createMealPlan', () => {
    it('should create a meal plan', async () => {
      const result = await controller.calculateMealPlan(mockDogProfile);
      expect(result).toEqual(mockEntry);
      expect(service.calculateMealPlan).toHaveBeenCalledWith(mockDogProfile);
    });
  });
});
