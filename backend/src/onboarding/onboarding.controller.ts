import { Controller, Post, Body } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { CreateDogProfileDto } from './dto/create-dog-profile.dto';
import { MealRecommendation } from './interfaces/meal-recommendation.interface';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('meal-plan')
  async calculateMealPlan(
    @Body() createDogProfileDto: CreateDogProfileDto,
  ): Promise<MealRecommendation> {
    return this.onboardingService.calculateMealPlan(createDogProfileDto);
  }
}
