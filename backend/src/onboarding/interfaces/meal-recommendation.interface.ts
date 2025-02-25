export interface MealRecommendation {
  id?: string;
  dailyPortionGrams: number;
  monthlyAmount: number;
  pricePerMonth: number;
  contents: string[];
  benefits: string[];
}
