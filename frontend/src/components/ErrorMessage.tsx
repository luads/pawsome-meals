import { motion } from 'framer-motion';

export function ErrorMessage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
      <p className="text-red-600">Failed to load subscriptions</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 text-purple-600 hover:text-purple-800"
      >
        Try again
      </button>
    </motion.div>
  );
}
