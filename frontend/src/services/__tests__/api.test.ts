import { getMealRecommendation, createSubscription, updateSubscriptionStatus } from '../api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMealRecommendation', () => {
    it('should fetch meal recommendation', async () => {
      const mockResponse = {
        id: 'rec123',
        dailyPortionGrams: 250,
        pricePerMonth: 49.99,
        contents: ['Chicken', 'Rice'],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getMealRecommendation({
        name: 'Max',
        age: 3,
        weight: 15,
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/onboarding/meal-plan'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getMealRecommendation({ name: 'Max', age: 3, weight: 15 })).rejects.toThrow(
        'Failed to get meal recommendation',
      );
    });
  });
});
