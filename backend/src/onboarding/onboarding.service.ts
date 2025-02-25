import { Injectable } from '@nestjs/common';
import { CreateDogProfileDto } from './dto/create-dog-profile.dto';
import { MealRecommendation } from './interfaces/meal-recommendation.interface';
import { OnboardingRepository } from './onboarding.repository';

@Injectable()
export class OnboardingService {
  constructor(private readonly onboardingRepository: OnboardingRepository) {}

  private readonly PRICE_PER_KG = 2; // $2 per kg of dog weight
  private readonly BASE_PRICE = 30; // Base price $30

  private readonly FOOD_CONTENTS = [
    'Free-Range Kangaroo',
    'Wild-Caught Salmon',
    'Grass-Fed New Zealand Lamb',
    'Free-Range Duck',
    'Organic Turkey',
    'Australian Sweet Potato',
    'Tasmanian Kelp',
    'Ancient Grains Blend',
    'Green-Lipped Mussels',
    'Organic Pumpkin',
    'Fresh Blueberries',
    'Chia Seeds',
    'Coconut Oil',
    'Turmeric Root',
    'Bone Broth',
    'Organic Kale',
    'Free-Range Eggs',
    'Quinoa',
    'Raw Honey',
    "Probiotic Goat's Milk",
  ];

  private readonly BENEFITS = [
    "Personalized portions for your dog's size",
    'Human-grade, exotic ingredients',
    'Vet-approved recipe with superfoods',
    'Free delivery to your door',
    'Ethically sourced proteins',
    'Rich in natural omega-3s',
    'No artificial preservatives',
  ];

  async calculateMealPlan(dogProfile: CreateDogProfileDto): Promise<MealRecommendation> {
    // Calculate daily portion (20g per kg of dog weight)
    const dailyPortionGrams = dogProfile.weight * 20;

    // Calculate monthly amount
    const monthlyAmount = dailyPortionGrams * 30;

    // Calculate price based on weight
    const pricePerMonth = this.BASE_PRICE + dogProfile.weight * this.PRICE_PER_KG;

    // Select random 5 ingredients for variety
    const contents = this.FOOD_CONTENTS.sort(() => Math.random() - 0.5).slice(0, 5);

    const recommendation: Omit<MealRecommendation, 'id'> = {
      dailyPortionGrams,
      monthlyAmount,
      pricePerMonth,
      contents,
      benefits: this.BENEFITS,
    };

    const savedEntry = await this.onboardingRepository.saveMealRecommendation(
      dogProfile,
      recommendation,
    );

    return {
      ...recommendation,
      id: savedEntry.id,
    };
  }
}
