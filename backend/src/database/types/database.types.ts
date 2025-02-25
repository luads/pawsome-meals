import { Payment } from '../../subscription/types/subscription.types';
import { Subscription } from '../../subscription/types/subscription.types';
import { OnboardingEntry } from '../../onboarding/types/onboarding.types';

export interface DatabaseSchema {
  subscriptions: Subscription[];
  onboarding: OnboardingEntry[];
  payments: Payment[];
}
