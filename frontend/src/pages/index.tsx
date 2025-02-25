import React from 'react';
import { CheckCircle, ArrowRight, AlertCircle, Sparkles, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { motion, AnimatePresence, animate } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/router';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { getMealRecommendation, createSubscription, MealRecommendation } from '@/services/api';
import { DogProfile } from '@/services/api';
import { formatWeight } from '@/utils/format';

interface FormErrors {
  name?: string;
  age?: string;
  weight?: string;
  subscription?: string;
}

export default function Home() {
  const router = useRouter();
  const { setSuccessDetails } = useSubscription();
  const [dogProfile, setDogProfile] = useState<DogProfile>({
    name: '',
    age: '' as unknown as number,
    weight: '' as unknown as number,
  });
  const [recommendation, setRecommendation] = useState<MealRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubscribing, setIsSubscribing] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus name input on mount
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!dogProfile.name.trim()) {
      newErrors.name = "Dog's name is required";
    }

    if (dogProfile.age <= 0) {
      newErrors.age = 'Age must be greater than 0';
    }

    if (dogProfile.weight <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const recommendation = await getMealRecommendation(dogProfile);
      setRecommendation(recommendation);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setRecommendation(null);
    setDogProfile({ name: '', age: '' as unknown as number, weight: '' as unknown as number });
  };

  const generateRandomDog = async () => {
    // Generate new values first
    const dogNames = [
      'Luna',
      'Bella',
      'Charlie',
      'Max',
      'Bailey',
      'Cooper',
      'Daisy',
      'Milo',
      'Lucy',
      'Rocky',
      'Lola',
      'Bear',
      'Molly',
      'Duke',
      'Sadie',
      'Buddy',
      'Ruby',
      'Tucker',
      'Lily',
      'Zeus',
    ];

    const randomName = dogNames[Math.floor(Math.random() * dogNames.length)];
    const randomAge = Math.floor(Math.random() * 9) + 1;

    const weightRanges = [
      { min: 2, max: 6 }, // Tiny
      { min: 7, max: 12 }, // Small
      { min: 13, max: 25 }, // Medium
      { min: 26, max: 40 }, // Large
      { min: 41, max: 55 }, // Extra Large
    ];

    const randomRange = weightRanges[Math.floor(Math.random() * weightRanges.length)];
    const randomWeight =
      Math.floor(Math.random() * (randomRange.max - randomRange.min + 1)) + randomRange.min;

    // Update state immediately without animations
    setDogProfile({
      name: randomName,
      age: randomAge,
      weight: randomWeight,
    });

    // Clear any existing errors
    setErrors({});
  };

  // Create refs for animation targets
  const ageRef = useRef(null);
  const weightRef = useRef(null);

  const renderError = (error?: string) => (
    <AnimatePresence mode="wait">
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-1 text-sm text-red-600 flex items-center"
        >
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  const handleSubscribe = async () => {
    if (!recommendation?.id || !dogProfile.name) return;

    setIsSubscribing(true);
    try {
      await createSubscription(recommendation.id);
      setSuccessDetails({
        dogName: dogProfile.name,
        recommendation,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setErrors({
        ...errors,
        subscription: 'Failed to create subscription. Please try again.',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px]"
          >
            <LoadingSpinner />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-gray-600"
            >
              Creating {dogProfile.name}'s personalized meal plan...
            </motion.p>
          </motion.div>
        ) : recommendation ? (
          <motion.div
            key="recommendation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              className="text-center mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.3 }}
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900">Perfect match found!</h2>
              <p className="mt-2 text-gray-600">
                We've created a personalized meal plan for {dogProfile.name}
              </p>
            </motion.div>

            <motion.div
              className="bg-white shadow-md rounded-xl border border-purple-100 overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-6 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Monthly plan details
                    </h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm text-gray-500">Daily portion</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {formatWeight(recommendation.dailyPortionGrams)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Monthly amount</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {formatWeight(recommendation.monthlyAmount)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Monthly price</dt>
                        <dd className="text-2xl font-bold text-purple-600">
                          ${recommendation.pricePerMonth.toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Premium ingredients
                    </h3>
                    <motion.ul className="space-y-2">
                      {recommendation.contents.map((ingredient, index) => (
                        <motion.li
                          key={index}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="visible"
                          custom={index}
                          className="flex items-center text-gray-700"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          {ingredient}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>
                  <motion.ul className="grid gap-3 sm:grid-cols-2">
                    {recommendation.benefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                        className="flex items-start"
                      >
                        <CheckCircle className="w-5 h-5 text-purple-500 mr-2 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  {errors.subscription && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 w-full"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{errors.subscription}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setErrors({ ...errors, subscription: undefined })}
                          className="ml-4 text-red-400 hover:text-red-500"
                        >
                          <span className="sr-only">Dismiss</span>
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                  <button
                    onClick={handleStartOver}
                    className="flex-1 px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    disabled={isSubscribing}
                  >
                    Start Over
                  </button>
                  <button
                    onClick={handleSubscribe}
                    disabled={isSubscribing}
                    className="flex-1 inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubscribing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <motion.div
              className="text-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900">Create your dog's profile</h2>
              <p className="mt-2 text-gray-600">
                Tell us about your furry friend and we'll create a personalized meal plan.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded-xl border border-purple-100 p-6 sm:p-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-6">
                <motion.div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Dog's Name
                  </label>
                  <input
                    ref={nameInputRef}
                    id="name"
                    type="text"
                    value={dogProfile.name}
                    onChange={(e) => {
                      setDogProfile({ ...dogProfile, name: e.target.value });
                      setErrors({ ...errors, name: undefined });
                    }}
                    className={`mt-1 block w-full px-3 py-2 rounded-md border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg`}
                  />
                  {renderError(errors.name)}
                </motion.div>

                <motion.div ref={ageRef}>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age (years)
                  </label>
                  <input
                    id="age"
                    type="number"
                    value={dogProfile.age || ''}
                    onChange={(e) =>
                      setDogProfile({
                        ...dogProfile,
                        age: e.target.value ? Number(e.target.value) : ('' as unknown as number),
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg"
                  />
                  {renderError(errors.age)}
                </motion.div>

                <motion.div ref={weightRef}>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    value={dogProfile.weight || ''}
                    onChange={(e) =>
                      setDogProfile({
                        ...dogProfile,
                        weight: e.target.value ? Number(e.target.value) : ('' as unknown as number),
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg"
                  />
                  {renderError(errors.weight)}
                </motion.div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={generateRandomDog}
                    className="flex-1 inline-flex justify-center items-center px-4 py-3 border border-purple-200 text-sm font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors group"
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                    </motion.div>
                    Guess my dog!
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors text-sm font-medium inline-flex items-center justify-center"
                  >
                    Get recommendation
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.form>

            <motion.p
              className="mt-4 text-center text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Already have a subscription?{' '}
              <Link
                href="/dashboard"
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                View dashboard
              </Link>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
