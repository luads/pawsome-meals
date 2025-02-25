import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Payment } from './types/subscription.types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentRepository {
  private readonly COLLECTION = 'payments';

  constructor(private readonly databaseService: DatabaseService) {}

  async create(subscriptionId: string, amount: number): Promise<Payment> {
    const payment: Payment = {
      id: uuidv4(),
      subscriptionId,
      amount,
      status: 'SUCCESS',
      processedAt: new Date().toISOString(),
    };

    const payments = await this.getAll();
    payments.push(payment);
    await this.saveAll(payments);
    return payment;
  }

  async getAll(): Promise<Payment[]> {
    return this.databaseService.getData(this.COLLECTION) || [];
  }

  private async saveAll(payments: Payment[]): Promise<void> {
    await this.databaseService.setData(this.COLLECTION, payments);
  }
}
