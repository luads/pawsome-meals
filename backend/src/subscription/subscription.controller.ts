import { Controller, Post, Get, Param, Delete, Body, Patch } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import {
  CreateSubscriptionDto,
  Subscription,
  UpdateSubscriptionDto,
} from './types/subscription.types';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(@Body() dto: CreateSubscriptionDto): Promise<Subscription> {
    return this.subscriptionService.createSubscription(dto);
  }

  @Get()
  async getAllSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionService.getAllSubscriptions();
  }

  @Get(':id')
  async getSubscription(@Param('id') id: string): Promise<Subscription> {
    return this.subscriptionService.getSubscription(id);
  }

  @Delete(':id')
  async cancelSubscription(@Param('id') id: string): Promise<Subscription> {
    return this.subscriptionService.cancelSubscription(id);
  }

  @Patch(':id')
  async updateSubscription(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionService.updateSubscription(id, dto);
  }
}
