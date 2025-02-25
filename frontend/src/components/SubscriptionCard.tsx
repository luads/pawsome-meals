import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Subscription } from '@/services/api';
import { formatWeight } from '@/utils/format';
import { SubscriptionStatusBadge } from './SubscriptionStatusBadge';

interface Props {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-200 transition-colors"
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {subscription.dogName}'s meal plan
            </h3>
            <p className="mt-1 text-sm font-medium text-purple-700">
              ${subscription.price.toFixed(2)} per month
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {formatWeight(subscription.portionWeightGrams)} daily portion
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Contains: {subscription.contents.slice(0, 2).join(', ')}
              {subscription.contents.length > 2 && ' and more...'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {subscription.status === 'ACTIVE' &&
                `Active since ${new Date(subscription.createdAt).toLocaleDateString()}`}
              {subscription.status === 'PAUSED' &&
                subscription.pausedAt &&
                `Paused on ${new Date(subscription.pausedAt).toLocaleDateString()}`}
              {subscription.status === 'CANCELLED' &&
                subscription.cancelledAt &&
                `Cancelled on ${new Date(subscription.cancelledAt).toLocaleDateString()}`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SubscriptionStatusBadge status={subscription.status} />
            <Link
              href={`/subscriptions/${subscription.id}`}
              className="inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Manage
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
