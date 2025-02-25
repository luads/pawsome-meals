import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { OnboardingModule } from './onboarding/onboarding.module';

@Module({
  imports: [DatabaseModule, SubscriptionModule, OnboardingModule],
})
export class AppModule {}
