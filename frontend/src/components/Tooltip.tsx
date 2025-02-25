import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  width?: 'auto' | 'full';
}

const Tooltip = ({ text, children, width = 'auto' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative ${width === 'full' ? 'w-full' : 'inline-block'}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="w-full"
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            {text}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
