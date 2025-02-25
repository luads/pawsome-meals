import { Dog, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4"
    >
      <div className="flex justify-center mb-4">
        <Dog className="w-16 h-16 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No meal plans yet 🐕</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your furry friend deserves the best! Start their journey to healthier, happier meals with
        our personalized subscription plans.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
      >
        Create your first meal plan
        <ChevronRight className="ml-2 -mr-1 w-5 h-5" />
      </Link>
    </motion.div>
  );
}
