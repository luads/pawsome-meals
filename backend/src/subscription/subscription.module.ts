import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { DatabaseModule } from '../database/database.module';
import { OnboardingModule } from '../onboarding/onboarding.module';
import { ProcessPaymentsCommand } from './commands/process-payments.command';
import { PaymentRepository } from './payment.repository';

@Module({
  imports: [DatabaseModule, OnboardingModule],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    SubscriptionRepository,
    PaymentRepository,
    ProcessPaymentsCommand,
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
