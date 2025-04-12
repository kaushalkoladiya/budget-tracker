'use client';

import { motion } from 'framer-motion';
import TransactionForm from '@/components/forms/TransactionForm';

export default function NewTransactionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Transaction</h1>
        <p className="text-gray-600 dark:text-gray-300">Record a new income or expense</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TransactionForm />
      </motion.div>
    </div>
  );
}
