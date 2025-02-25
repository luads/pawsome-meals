import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SubscriptionRepository } from './subscription.repository';
import {
  CreateSubscriptionDto,
  Subscription,
  UpdateSubscriptionDto,
  SubscriptionStatus,
} from './types/subscription.types';
import { OnboardingRepository } from '../onboarding/onboarding.repository';

const INITIAL_DELIVERY_DAYS = 3;
const DELIVERY_BUFFER_DAYS = 2;
const SUBSCRIPTION_CYCLE_DAYS = 30;

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly onboardingRepository: OnboardingRepository,
  ) {}

  async createSubscription(dto: CreateSubscriptionDto): Promise<Subscription> {
    const onboarding = await this.onboardingRepository.getMealRecommendation(
      dto.mealRecommendationId,
    );
    if (!onboarding) {
      throw new NotFoundException(`Meal recommendation not found`);
    }

    return this.subscriptionRepository.create(dto, onboarding);
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    const subscriptions = await this.subscriptionRepository.getAll();

    return subscriptions.sort((a, b) => {
      // Active subscriptions first
      if (a.status === SubscriptionStatus.ACTIVE && b.status !== SubscriptionStatus.ACTIVE)
        return -1;
      if (a.status !== SubscriptionStatus.ACTIVE && b.status === SubscriptionStatus.ACTIVE)
        return 1;

      // Then sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  private calculateNextDeliveryDate(subscription: Subscription): string {
    const creationDate = new Date(subscription.createdAt);
    const now = new Date();

    // For new subscriptions, delivery is in 3 days
    if (now.getTime() - creationDate.getTime() < INITIAL_DELIVERY_DAYS * 24 * 60 * 60 * 1000) {
      return new Date(
        creationDate.getTime() + INITIAL_DELIVERY_DAYS * 24 * 60 * 60 * 1000,
      ).toISOString();
    }

    // Calculate months since creation (rounded down)
    const monthsSinceCreation = Math.floor(
      (now.getTime() - creationDate.getTime()) / (SUBSCRIPTION_CYCLE_DAYS * 24 * 60 * 60 * 1000),
    );

    // Calculate next delivery based on subscription cycles
    const nextDeliveryDate = new Date(
      creationDate.getTime() +
        DELIVERY_BUFFER_DAYS * 24 * 60 * 60 * 1000 +
        (monthsSinceCreation + 1) * SUBSCRIPTION_CYCLE_DAYS * 24 * 60 * 60 * 1000,
    );

    return nextDeliveryDate.toISOString();
  }

  async getSubscription(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status === 'ACTIVE') {
      subscription.nextDeliveryDate = this.calculateNextDeliveryDate(subscription);
    }

    return subscription;
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.cancel(id);
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return subscription;
  }

  async updateSubscription(id: string, dto: UpdateSubscriptionDto): Promise<Subscription> {
    if (![SubscriptionStatus.ACTIVE, SubscriptionStatus.PAUSED].includes(dto.status)) {
      throw new BadRequestException('Invalid status update');
    }

    const subscription = await this.subscriptionRepository.updateStatus(id, dto.status);
    if (!subscription) {
      throw new NotFoundException('Subscription not found or cancelled');
    }

    return subscription;
  }

  async updateLastPaymentDate(id: string, paymentDate: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.lastPaymentDate = paymentDate;
    return this.subscriptionRepository.save(subscription);
  }
}
