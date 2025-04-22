'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TransactionForm from '@/components/forms/TransactionForm';
import Modal from '@/components/ui/Modal';
import QuickCategoryForm from '@/components/forms/QuickCategoryForm';

export default function NewTransactionPage() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<'income' | 'expense'>('expense');
  
  // Listen for a custom event from the TransactionForm
  useEffect(() => {
    const handleMessage = (e: CustomEvent) => {
      if (e.detail.type === 'add-category') {
        setSelectedTransactionType(e.detail.transactionType);
        setShowCategoryModal(true);
      }
    };
    
    window.addEventListener('transaction-form-message', handleMessage as EventListener);
    
    return () => {
      window.removeEventListener('transaction-form-message', handleMessage as EventListener);
    };
  }, []);
  
  // Handler when a new category is created
  const handleCategoryCreated = (categoryId: string) => {
    setShowCategoryModal(false);
    
    // Dispatch event to notify TransactionForm about the new category
    const event = new CustomEvent('new-category-created', {
      detail: { categoryId }
    });
    window.dispatchEvent(event);
  };
  
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
      
      {/* Add Category Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="Add New Category"
      >
        <QuickCategoryForm
          type={selectedTransactionType}
          onSuccess={handleCategoryCreated}
          onCancel={() => setShowCategoryModal(false)}
        />
      </Modal>
    </div>
  );
}
