import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import {
  getSubscription,
  cancelSubscription,
  Subscription,
  updateSubscriptionStatus,
} from '@/services/api';
import { formatWeight } from '@/utils/format';
import {
  AlertTriangle,
  UtensilsCrossed,
  Calendar,
  DollarSign,
  Scale,
  Clock,
  X,
  CheckCircle,
  Pause,
  Play,
} from 'lucide-react';
import Image from 'next/image';
import { SubscriptionStatusBadge } from '@/components/SubscriptionStatusBadge';

export default function SubscriptionDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [subscription, setSubscription] = React.useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);
  const [showCookie, setShowCookie] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [showStatusSuccess, setShowStatusSuccess] = React.useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = React.useState(false);

  React.useEffect(() => {
    async function loadSubscription() {
      if (!id) return;

      try {
        const data = await getSubscription(id as string);
        setSubscription(data);
      } catch (err) {
        setError('Failed to load subscription');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSubscription();
  }, [id]);

  const handleCancel = async () => {
    if (!subscription?.id) return;

    setIsCancelling(true);
    try {
      await cancelSubscription(subscription.id);
      // Refresh subscription data after a brief delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const updated = await getSubscription(subscription.id);
      setSubscription(updated);
      setShowCancelConfirm(false);
    } catch (err) {
      setError('Failed to cancel subscription');
      console.error(err);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleKeepSubscription = () => {
    setShowCancelConfirm(false);
    setShowCookie(true);
    setTimeout(() => setShowCookie(false), 2000);
  };

  const handleStatusUpdate = async (newStatus: 'ACTIVE' | 'PAUSED') => {
    if (!subscription?.id) return;

    setIsUpdating(true);
    try {
      const updated = await updateSubscriptionStatus(subscription.id, newStatus);
      setSubscription(updated);
      setShowStatusSuccess(true);
      setShowPauseConfirm(false);
      setTimeout(() => setShowStatusSuccess(false), 2000);
    } catch (err) {
      setError('Failed to update subscription');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Add loading state component
  const LoadingState = () => (
    <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 sm:p-8 animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full" />
          <div className="h-8 w-48 bg-gray-200 rounded ml-4" />
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded-full" />
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Layout backLink={{ href: '/dashboard', text: 'Back to dashboard' }}>
        <div className="max-w-3xl mx-auto">
          <LoadingState />
        </div>
      </Layout>
    );
  }

  if (error || !subscription) {
    return (
      <Layout backLink={{ href: '/dashboard', text: 'Back to dashboard' }}>
        <div className="text-center py-16">
          <p className="text-red-600">{error || 'Subscription not found'}</p>
          <button
            onClick={() => router.reload()}
            className="mt-4 text-purple-600 hover:text-purple-800"
          >
            Try again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout backLink={{ href: '/dashboard', text: 'Back to dashboard' }}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <UtensilsCrossed className="w-8 h-8 text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {subscription.dogName}'s meal plan
              </h1>
            </div>
            <SubscriptionStatusBadge status={subscription.status} />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-4"
            >
              <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-sm font-medium text-gray-700">Monthly price</h2>
              </div>
              <p className="text-2xl font-semibold text-purple-700">
                ${subscription.price.toFixed(2)}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4"
            >
              <div className="flex items-center mb-2">
                <Scale className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-sm font-medium text-gray-700">Daily portion</h2>
              </div>
              <p className="text-2xl font-semibold text-blue-700">
                {formatWeight(subscription.portionWeightGrams)}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-4"
            >
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-sm font-medium text-gray-700">Next delivery</h2>
              </div>
              <p className="text-2xl font-semibold text-green-700">
                {subscription.nextDeliveryDate
                  ? new Date(subscription.nextDeliveryDate).toLocaleDateString()
                  : 'N/A'}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-4"
            >
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-orange-600 mr-2" />
                <h2 className="text-sm font-medium text-gray-700">
                  {subscription.status === 'ACTIVE' && 'Active since'}
                  {subscription.status === 'PAUSED' && 'Paused on'}
                  {subscription.status === 'CANCELLED' && 'Cancelled on'}
                </h2>
              </div>
              <p className="text-2xl font-semibold text-orange-700">
                {new Date(
                  subscription.status === 'ACTIVE'
                    ? subscription.createdAt
                    : subscription.status === 'PAUSED'
                      ? subscription.pausedAt || subscription.createdAt
                      : subscription.cancelledAt || subscription.createdAt,
                ).toLocaleDateString()}
              </p>
            </motion.div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-4">What's in the box</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subscription.contents.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center text-gray-600"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {subscription.status !== 'CANCELLED' && (
            <div className="mt-8 pt-8 border-t border-gray-100 flex gap-4">
              {subscription.status === 'ACTIVE' && (
                <>
                  <button
                    onClick={() => setShowPauseConfirm(true)}
                    className="inline-flex items-center px-4 py-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause deliveries
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Cancel subscription
                  </button>
                </>
              )}
              {subscription.status === 'PAUSED' && (
                <button
                  onClick={() => setShowPauseConfirm(true)}
                  className="inline-flex items-center px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume deliveries
                </button>
              )}
            </div>
          )}

          {showStatusSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-8 right-8 bg-white rounded-lg shadow-lg p-4 flex items-center"
            >
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-gray-800">
                {subscription.status === 'ACTIVE' ? 'Deliveries resumed!' : 'Deliveries paused!'}
              </p>
            </motion.div>
          )}
        </div>

        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden"
            >
              <div className="relative bg-red-50">
                <div className="aspect-[16/12] w-full">
                  <Image
                    src="/images/sad-puppy.jpg"
                    alt="Sad puppy"
                    fill
                    className="object-cover"
                    sizes="(max-width: 32rem) 100vw, 32rem"
                  />
                </div>
              </div>

              <div className="p-6">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="text-white hover:text-gray-200 bg-black/20 rounded-full p-1"
                  >
                    <span className="sr-only">Close</span>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Are you sure you want to cancel?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {subscription.dogName} will miss their delicious, healthy meals! You'll need to
                    create a new subscription if you change your mind.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleCancel}
                      disabled={isCancelling}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {isCancelling ? 'Cancelling...' : 'Yes, cancel subscription'}
                    </button>
                    <button
                      onClick={handleKeepSubscription}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      No, keep subscription
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showCookie && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="mt-8 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="text-3xl"
            >
              🎉
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-purple-600 font-medium"
            >
              Wooo! {subscription.dogName} will be so happy!
            </motion.p>
          </motion.div>
        )}

        {showPauseConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {subscription.status === 'ACTIVE' ? 'Pause deliveries?' : 'Resume deliveries?'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {subscription.status === 'ACTIVE'
                    ? `${subscription.dogName}'s meals won't be delivered until you resume. You won't be charged during this time.`
                    : `${subscription.dogName}'s regular meal deliveries will start again, and billing will resume.`}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() =>
                      handleStatusUpdate(subscription.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')
                    }
                    disabled={isUpdating}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    {isUpdating
                      ? 'Updating...'
                      : subscription.status === 'ACTIVE'
                        ? 'Yes, pause deliveries'
                        : 'Yes, resume deliveries'}
                  </button>
                  <button
                    onClick={() => setShowPauseConfirm(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    No, keep it as is
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
