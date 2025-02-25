export interface DogProfile {
  name: string;
  age: number;
  weight: number;
}

export interface MealRecommendation {
  dailyPortionGrams: number;
  monthlyAmount: number;
  pricePerMonth: number;
  contents: string[];
  timestamp: string;
}

export interface OnboardingEntry {
  id: string;
  dogProfile: DogProfile;
  recommendation: MealRecommendation;
}
