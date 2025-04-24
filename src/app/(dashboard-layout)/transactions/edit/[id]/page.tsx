'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import TransactionForm from '@/components/forms/TransactionForm';

export default function EditTransactionPage() {
  const params = useParams();
  const transactionId = params?.id as string;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Transaction</h1>
        <p className="text-gray-600 dark:text-gray-300">Update transaction details</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TransactionForm transactionId={transactionId} />
      </motion.div>
    </div>
  );
}
