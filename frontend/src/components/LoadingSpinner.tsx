import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <div className="flex justify-center">
    <motion.div
      className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

export default LoadingSpinner;
