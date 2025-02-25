import React from 'react';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { formatWeight } from '@/utils/format';
import { getSubscriptions, Subscription } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { DogFact } from '@/components/DogFact';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { CheckCircle, X } from 'lucide-react';

export default function Dashboard() {
  const { successDetails, setSuccessDetails } = useSubscription();
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadSubscriptions() {
      try {
        const data = await getSubscriptions();
        setSubscriptions(data);
      } catch (err) {
        setError('Failed to load subscriptions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSubscriptions();
  }, []);

  return (
    <Layout
      backLink={subscriptions.length > 0 ? { href: '/', text: '+ Add another dog' } : undefined}
    >
      <div>
        <AnimatePresence>
          {successDetails && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 rounded-lg bg-green-50 p-4 border border-green-200"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Subscription created successfully!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      {successDetails.dogName}'s meal plan is ready! We'll deliver{' '}
                      {formatWeight(successDetails.recommendation.monthlyAmount)} of premium food
                      monthly for ${successDetails.recommendation.pricePerMonth}/month.
                    </p>
                    <p className="mt-2 font-medium">
                      Your first delivery will arrive within 3-5 business days.
                    </p>
                  </div>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => setSuccessDetails(null)}
                      className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100"
                    >
                      <span className="sr-only">Dismiss</span>
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">Your subscriptions</h2>

        <div className="space-y-6 mb-8">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage />
            ) : subscriptions.length > 0 ? (
              <>
                {subscriptions.map((subscription) => (
                  <SubscriptionCard key={subscription.id} subscription={subscription} />
                ))}
                <DogFact />
              </>
            ) : (
              <EmptyState />
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
