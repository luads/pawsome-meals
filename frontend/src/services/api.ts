const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface DogProfile {
  name: string;
  age: number;
  weight: number;
}

export interface MealRecommendation {
  id: string;
  dailyPortionGrams: number;
  monthlyAmount: number;
  pricePerMonth: number;
  contents: string[];
  benefits: string[];
  timestamp: string;
}

export interface Subscription {
  id: string;
  dogName: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  price: number;
  portionWeightGrams: number;
  createdAt: string;
  cancelledAt?: string;
  pausedAt?: string;
  nextDeliveryDate?: string;
  contents: string[];
}

export async function getMealRecommendation(dogProfile: DogProfile): Promise<MealRecommendation> {
  const response = await fetch(`${API_URL}/onboarding/meal-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dogProfile),
  });

  if (!response.ok) {
    throw new Error('Failed to get meal recommendation');
  }

  return response.json();
}

export async function createSubscription(onboardingId: string): Promise<any> {
  const response = await fetch(`${API_URL}/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mealRecommendationId: onboardingId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create subscription');
  }

  return response.json();
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const response = await fetch(`${API_URL}/subscriptions`);
  if (!response.ok) {
    throw new Error('Failed to fetch subscriptions');
  }
  return response.json();
}

export async function getSubscription(id: string): Promise<Subscription> {
  const response = await fetch(`${API_URL}/subscriptions/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch subscription');
  }
  return response.json();
}

export async function cancelSubscription(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/subscriptions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to cancel subscription');
  }
}

export async function updateSubscriptionStatus(
  id: string,
  status: 'ACTIVE' | 'PAUSED',
): Promise<Subscription> {
  const response = await fetch(`${API_URL}/subscriptions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update subscription');
  }
  return response.json();
}
