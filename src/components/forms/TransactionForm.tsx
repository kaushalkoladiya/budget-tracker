'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiX, FiCalendar, FiDollarSign, FiTag, FiFileText } from 'react-icons/fi';

import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { transactionStorage, categoryStorage } from '@/lib/storage/localStorage';
import { Transaction, Category, createTransaction } from '@/types/models';

interface TransactionFormProps {
  transactionId?: string;
  onSuccess?: () => void;
}

export default function TransactionForm({ transactionId, onSuccess }: TransactionFormProps) {
  const router = useRouter();
  const isEditing = !!transactionId;
  
  // Form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    categoryId: '',
    subcategoryId: '',
    date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    notes: '',
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load categories and transaction data if editing
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load categories
        const loadedCategories = categoryStorage.getAll();
        setCategories(loadedCategories);
        
        // If editing, load transaction data
        if (isEditing && transactionId) {
          const transactions = transactionStorage.getAll();
          const transaction = transactions.find(t => t.id === transactionId);
          
          if (transaction) {
            setFormData({
              description: transaction.description,
              amount: transaction.amount.toString(),
              type: transaction.type,
              categoryId: transaction.categoryId,
              subcategoryId: transaction.subcategoryId || '',
              date: new Date(transaction.date).toISOString().split('T')[0],
              notes: transaction.notes || '',
            });
            
            // Load subcategories for the selected category
            if (transaction.categoryId) {
              const category = loadedCategories.find(c => c.id === transaction.categoryId);
              if (category && category.subcategories) {
                setSubcategories(category.subcategories);
              }
            }
          } else {
            setError('Transaction not found');
          }
        }
      } catch (error) {
        console.error('Error loading form data:', error);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isEditing, transactionId]);
  
  // Update subcategories when category changes
  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryId,
      subcategoryId: '', // Reset subcategory when category changes
    }));
    
    const category = categories.find(c => c.id === categoryId);
    if (category && category.subcategories) {
      setSubcategories(category.subcategories);
    } else {
      setSubcategories([]);
    }
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'categoryId') {
      handleCategoryChange(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      // Validate form
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      
      if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      if (!formData.categoryId) {
        throw new Error('Please select a category');
      }
      
      // Get existing transactions
      const transactions = transactionStorage.getAll();
      
      // Create or update transaction
      if (isEditing && transactionId) {
        // Update existing transaction
        const updatedTransactions = transactions.map(t => {
          if (t.id === transactionId) {
            return {
              ...t,
              description: formData.description.trim(),
              amount: Number(formData.amount),
              type: formData.type as 'income' | 'expense',
              categoryId: formData.categoryId,
              subcategoryId: formData.subcategoryId || undefined,
              date: new Date(formData.date).getTime(),
              notes: formData.notes.trim() || undefined,
              updatedAt: Date.now(),
            };
          }
          return t;
        });
        
        transactionStorage.save(updatedTransactions);
      } else {
        // Create new transaction
        const newTransaction = createTransaction({
          description: formData.description.trim(),
          amount: Number(formData.amount),
          type: formData.type as 'income' | 'expense',
          categoryId: formData.categoryId,
          subcategoryId: formData.subcategoryId || undefined,
          date: new Date(formData.date).getTime(),
          notes: formData.notes.trim() || undefined,
        });
        
        transactionStorage.save([...transactions, newTransaction]);
      }
      
      // Success callback or redirect
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/transactions');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      setError(error instanceof Error ? error.message : 'Failed to save transaction');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {/* Transaction Type */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div 
              className={`p-4 rounded-lg border cursor-pointer ${
                formData.type === 'expense' 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
            >
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="expense" 
                  name="type" 
                  value="expense" 
                  checked={formData.type === 'expense'} 
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="expense" className="font-medium text-gray-900 dark:text-white cursor-pointer">
                  Expense
                </label>
              </div>
            </div>
            
            <div 
              className={`p-4 rounded-lg border cursor-pointer ${
                formData.type === 'income' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
            >
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="income" 
                  name="type" 
                  value="income" 
                  checked={formData.type === 'income'} 
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="income" className="font-medium text-gray-900 dark:text-white cursor-pointer">
                  Income
                </label>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFileText className="text-gray-400" />
              </div>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="e.g., Grocery shopping, Salary payment"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="text-gray-400" />
              </div>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                id="date"
                name="date"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiTag className="text-gray-400" />
              </div>
              <select
                id="categoryId"
                name="categoryId"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories
                  .filter(cat => (formData.type === 'expense' ? !cat.incomeOnly : !cat.expenseOnly))
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
          
          {/* Subcategory (only if the selected category has subcategories) */}
          {subcategories.length > 0 && (
            <div className="space-y-2">
              <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subcategory
              </label>
              <select
                id="subcategoryId"
                name="subcategoryId"
                className="pl-4 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={formData.subcategoryId}
                onChange={handleChange}
              >
                <option value="">Select a subcategory (optional)</option>
                {subcategories.map(subcategory => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Add any additional details..."
              className="p-4 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            leftIcon={<FiX />}
            onClick={() => router.push('/transactions')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            leftIcon={<FiSave />}
            loading={isSaving}
          >
            {isEditing ? 'Update' : 'Save'} Transaction
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
