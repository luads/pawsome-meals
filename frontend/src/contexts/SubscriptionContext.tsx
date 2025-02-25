import React, { createContext, useContext, useState } from 'react';
import { MealRecommendation } from '@/services/api';

interface SubscriptionContextType {
  successDetails: {
    dogName: string;
    recommendation: MealRecommendation;
  } | null;
  setSuccessDetails: (details: SubscriptionContextType['successDetails']) => void;
}

export const SubscriptionContext = createContext<SubscriptionContextType>({
  successDetails: null,
  setSuccessDetails: () => {},
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [successDetails, setSuccessDetails] =
    useState<SubscriptionContextType['successDetails']>(null);

  return (
    <SubscriptionContext.Provider value={{ successDetails, setSuccessDetails }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
