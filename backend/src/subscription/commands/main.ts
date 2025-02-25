import { CommandFactory } from 'nest-commander';
import { SubscriptionModule } from '../subscription.module';

async function bootstrap() {
  await CommandFactory.run(SubscriptionModule);
}

bootstrap();
