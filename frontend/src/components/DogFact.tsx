import React from 'react';
import { motion } from 'framer-motion';
import { getDogFact } from '@/services/fun-facts';
import { Sparkles } from 'lucide-react';

export function DogFact() {
  const [fact, setFact] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    async function loadFact() {
      setFact(null);
      setIsLoading(true);
      const newFact = await getDogFact();
      if (mounted) {
        setFact(newFact);
        setIsLoading(false);
      }
    }

    loadFact();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="h-[3.5rem] bg-gray-100 rounded-lg"
      />
    );
  }

  return (
    <div className="flex items-start space-x-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-4 border border-gray-100">
      <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
      <p className="flex-1">
        <span>Fun fact: {fact}</span>
      </p>
    </div>
  );
}
