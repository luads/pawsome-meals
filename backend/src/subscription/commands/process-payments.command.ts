import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { SubscriptionService } from '../subscription.service';
import { SubscriptionStatus } from '../types/subscription.types';
import { PaymentRepository } from '../payment.repository';

@Injectable()
@Command({
  name: 'payment:process',
  description: 'Process payments for active subscriptions',
})
export class ProcessPaymentsCommand extends CommandRunner {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly paymentRepository: PaymentRepository,
  ) {
    super();
  }

  async run(): Promise<void> {
    console.log('🔄 Processing payments...');

    const subscriptions = await this.subscriptionService.getAllSubscriptions();
    const activeSubscriptions = subscriptions.filter(
      (sub) => sub.status === SubscriptionStatus.ACTIVE,
    );

    for (const subscription of activeSubscriptions) {
      try {
        // Check if payment is due
        const lastPayment = subscription.lastPaymentDate
          ? new Date(subscription.lastPaymentDate)
          : new Date(0);

        const daysSinceLastPayment = Math.floor(
          (new Date().getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysSinceLastPayment < 30) {
          console.log(`⏭️ Skipping payment for ${subscription.id} - not due yet`);
          continue;
        }

        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Record payment
        const payment = await this.paymentRepository.create(subscription.id, subscription.price);

        // Update subscription last payment date
        await this.subscriptionService.updateLastPaymentDate(subscription.id, payment.processedAt);

        console.log(`✅ Processed payment for subscription ${subscription.id}:`);
        console.log(`   ${subscription.dogName} - $${subscription.price}`);
      } catch (error) {
        console.error(`❌ Failed to process payment for subscription ${subscription.id}:`, error);
      }
    }

    console.log(`\n✨ Processed payments complete`);
  }
}
