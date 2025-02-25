import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuidv4 } from 'uuid';
import { DogProfile, MealRecommendation, OnboardingEntry } from './types/onboarding.types';

@Injectable()
export class OnboardingRepository {
  private readonly COLLECTION = 'onboarding';

  constructor(private readonly databaseService: DatabaseService) {}

  async saveMealRecommendation(
    dogProfile: DogProfile,
    recommendation: Omit<MealRecommendation, 'timestamp'>,
  ): Promise<OnboardingEntry> {
    const entry: OnboardingEntry = {
      id: uuidv4(),
      dogProfile,
      recommendation: {
        ...recommendation,
        timestamp: new Date().toISOString(),
      },
    };

    const entries = await this.getAll();
    entries.push(entry);
    await this.databaseService.setData(this.COLLECTION, entries);

    return entry;
  }

  async getMealRecommendation(id: string): Promise<OnboardingEntry | null> {
    const entries = await this.getAll();
    return entries.find((entry) => entry.id === id) || null;
  }

  private async getAll(): Promise<OnboardingEntry[]> {
    return this.databaseService.getData(this.COLLECTION) || [];
  }
}
