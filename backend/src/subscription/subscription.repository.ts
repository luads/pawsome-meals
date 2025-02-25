import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  CreateSubscriptionDto,
  Subscription,
  SubscriptionStatus,
} from './types/subscription.types';
import { v4 as uuidv4 } from 'uuid';
import { OnboardingEntry } from '../onboarding/types/onboarding.types';

@Injectable()
export class SubscriptionRepository {
  private readonly COLLECTION = 'subscriptions';

  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateSubscriptionDto, onboarding: OnboardingEntry): Promise<Subscription> {
    const subscription: Subscription = {
      id: uuidv4(),
      status: SubscriptionStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      mealRecommendationId: dto.mealRecommendationId,
      dogName: onboarding.dogProfile.name,
      price: onboarding.recommendation.pricePerMonth,
      portionWeightGrams: onboarding.recommendation.dailyPortionGrams,
      contents: onboarding.recommendation.contents,
    };

    const subscriptions = await this.getAll();
    subscriptions.push(subscription);
    await this.saveAll(subscriptions);

    return subscription;
  }

  async getAll(): Promise<Subscription[]> {
    return this.databaseService.getData(this.COLLECTION) || [];
  }

  async findById(id: string): Promise<Subscription | null> {
    const subscriptions = await this.getAll();
    return subscriptions.find((sub) => sub.id === id) || null;
  }

  async cancel(id: string): Promise<Subscription | null> {
    const subscriptions = await this.getAll();
    const subscriptionIndex = subscriptions.findIndex((sub) => sub.id === id);

    if (subscriptionIndex === -1) {
      return null;
    }

    const updatedSubscription: Subscription = {
      ...subscriptions[subscriptionIndex],
      status: SubscriptionStatus.CANCELLED,
      cancelledAt: new Date().toISOString(),
    };

    subscriptions[subscriptionIndex] = updatedSubscription;
    await this.saveAll(subscriptions);

    return updatedSubscription;
  }

  async updateStatus(id: string, status: SubscriptionStatus): Promise<Subscription | null> {
    const subscriptions = await this.getAll();
    const subscription = subscriptions.find((sub) => sub.id === id);

    if (!subscription || subscription.status === SubscriptionStatus.CANCELLED) {
      return null;
    }

    subscription.status = status;
    if (status === SubscriptionStatus.PAUSED) {
      subscription.pausedAt = new Date().toISOString();
    } else if (status === SubscriptionStatus.ACTIVE) {
      subscription.pausedAt = undefined;
    }

    await this.saveAll(subscriptions);
    return subscription;
  }

  async save(subscription: Subscription): Promise<Subscription> {
    const subscriptions = await this.getAll();
    const index = subscriptions.findIndex((sub) => sub.id === subscription.id);
    if (index === -1) return subscription;

    subscriptions[index] = subscription;
    await this.saveAll(subscriptions);
    return subscription;
  }

  private async saveAll(subscriptions: Subscription[]): Promise<void> {
    await this.databaseService.setData(this.COLLECTION, subscriptions);
  }
}
