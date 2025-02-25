export interface Subscription {
  id: string;
  dogName: string;
  status: SubscriptionStatus;
  mealRecommendationId: string;
  price: number;
  portionWeightGrams: number;
  createdAt: string;
  cancelledAt?: string;
  pausedAt?: string;
  nextDeliveryDate?: string;
  contents: string[];
  lastPaymentDate?: string;
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
}

export interface CreateSubscriptionDto {
  mealRecommendationId: string;
}

export interface UpdateSubscriptionDto {
  status: SubscriptionStatus.ACTIVE | SubscriptionStatus.PAUSED;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED';
  processedAt: string;
}
