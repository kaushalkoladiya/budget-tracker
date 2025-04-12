'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiDollarSign, FiCalendar } from 'react-icons/fi';

import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { formatCurrency } from '@/lib/utils';
import { budgetStorage, categoryStorage, transactionStorage } from '@/lib/storage/localStorage';
import { Budget, Category, Transaction, createBudget } from '@/types/models';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    subcategoryId: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'weekly' | 'yearly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });
  
  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const loadedBudgets = budgetStorage.getAll();
        const loadedCategories = categoryStorage.getAll();
        const loadedTransactions = transactionStorage.getAll();
        
        setBudgets(loadedBudgets);
        setCategories(loadedCategories);
        setTransactions(loadedTransactions);
      } catch (error) {
        console.error('Error loading budgets data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!formData.categoryId) {
        alert('Please select a category');
        return;
      }
      
      if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      
      // Create new budget
      const newBudget = createBudget({
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId || undefined,
        amount: Number(formData.amount),
        period: formData.period,
        startDate: new Date(formData.startDate).getTime(),
        endDate: formData.endDate ? new Date(formData.endDate).getTime() : undefined
      });
      
      // Save to storage
      const updatedBudgets = [...budgets, newBudget];
      budgetStorage.save(updatedBudgets);
      setBudgets(updatedBudgets);
      
      // Reset form
      setFormData({
        categoryId: '',
        subcategoryId: '',
        amount: '',
        period: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
      
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding budget:', error);
      alert('Failed to add budget');
    }
  };
  
  // Delete a budget
  const deleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        const updatedBudgets = budgets.filter(b => b.id !== id);
        budgetStorage.save(updatedBudgets);
        setBudgets(updatedBudgets);
      } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Failed to delete budget');
      }
    }
  };
  
  // Calculate budget progress
  const calculateProgress = (budget: Budget) => {
    // Get transactions for this budget's category
    const relevantTransactions = transactions.filter(
      t => t.type === 'expense' && 
      t.categoryId === budget.categoryId &&
      (!budget.subcategoryId || t.subcategoryId === budget.subcategoryId)
    );
    
    // Calculate spent amount
    const spentAmount = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate percentage
    const percentage = (spentAmount / budget.amount) * 100;
    
    return {
      spent: spentAmount,
      percentage: Math.min(percentage, 100) // Cap at 100%
    };
  };
  
  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };
  
  // Get subcategory name by ID
  const getSubcategoryName = (categoryId: string, subcategoryId?: string) => {
    if (!subcategoryId) return null;
    
    const category = categories.find(c => c.id === categoryId);
    if (!category || !category.subcategories) return null;
    
    const subcategory = category.subcategories.find(s => s.id === subcategoryId);
    return subcategory ? subcategory.name : null;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budgets</h1>
            <p className="text-gray-600 dark:text-gray-300">Set and track your spending limits</p>
          </div>
          
          <Button 
            leftIcon={<FiPlus />}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Budget'}
          </Button>
        </div>
      </motion.div>
      
      {/* Add Budget Form */}
      {showAddForm && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Create New Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-2">
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={formData.categoryId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories
                        .filter(c => !c.incomeOnly) // Only show expense categories
                        .map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  
                  {/* Subcategory */}
                  <div className="space-y-2">
                    <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subcategory (Optional)
                    </label>
                    <select
                      id="subcategoryId"
                      name="subcategoryId"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={formData.subcategoryId}
                      onChange={handleChange}
                    >
                      <option value="">All subcategories</option>
                      {formData.categoryId && categories
                        .find(c => c.id === formData.categoryId)?.subcategories?.map(sub => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  
                  {/* Amount */}
                  <div className="space-y-2">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Budget Amount
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
                  
                  {/* Period */}
                  <div className="space-y-2">
                    <label htmlFor="period" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Budget Period
                    </label>
                    <select
                      id="period"
                      name="period"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={formData.period}
                      onChange={handleChange}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  
                  {/* Start Date */}
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* End Date (Optional) */}
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      End Date (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={formData.endDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" leftIcon={<FiPlus />}>
                    Create Budget
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Budgets List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : budgets.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {budgets.map(budget => {
            const progress = calculateProgress(budget);
            const categoryName = getCategoryName(budget.categoryId);
            const subcategoryName = getSubcategoryName(budget.categoryId, budget.subcategoryId);
            
            return (
              <motion.div key={budget.id} variants={itemVariants}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {categoryName}
                          {subcategoryName && <span className="text-gray-500 dark:text-gray-400"> / {subcategoryName}</span>}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} budget
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteBudget(budget.id)}
                        aria-label={`Delete ${categoryName} budget`}
                      >
                        <FiTrash2 className="text-red-500" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          {formatCurrency(progress.spent)} of {formatCurrency(budget.amount)}
                        </span>
                        <span 
                          className={`font-medium ${
                            progress.percentage >= 100 
                              ? 'text-red-600 dark:text-red-400' 
                              : progress.percentage >= 80 
                                ? 'text-yellow-600 dark:text-yellow-400' 
                                : 'text-green-600 dark:text-green-400'
                          }`}
                        >
                          {progress.percentage.toFixed(0)}%
                        </span>
                      </div>
                      
                      <ProgressBar 
                        value={progress.percentage} 
                        variant={
                          progress.percentage >= 100 
                            ? 'danger' 
                            : progress.percentage >= 80 
                              ? 'warning' 
                              : 'success'
                        }
                      />
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {budget.startDate && (
                          <p>
                            Started: {new Date(budget.startDate).toLocaleDateString()}
                          </p>
                        )}
                        {budget.endDate && (
                          <p>
                            Ends: {new Date(budget.endDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiDollarSign className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Budgets Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Create a budget to help you track and limit your spending in specific categories
            </p>
            <Button leftIcon={<FiPlus />} onClick={() => setShowAddForm(true)}>
              Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
