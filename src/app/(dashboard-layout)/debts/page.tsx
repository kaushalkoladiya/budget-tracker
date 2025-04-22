'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiX, 
  FiTrash2, 
  FiDollarSign, 
  FiCalendar, 
  FiUser,
  FiCheck,
  FiCreditCard,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';

import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { debtStorage } from '@/lib/storage/localStorage';
import { Debt, createDebt } from '@/types/models';

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'borrowed' as 'borrowed' | 'lent',
    personName: '',
    dueDate: '',
    notes: ''
  });
  
  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const loadedDebts = debtStorage.getAll();
        setDebts(loadedDebts);
      } catch (error) {
        console.error('Error loading debts data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      if (!formData.description.trim()) {
        alert('Please enter a description');
        return;
      }
      
      if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      
      if (!formData.personName.trim()) {
        alert('Please enter a person name');
        return;
      }
      
      // Create new debt
      const newDebt = createDebt({
        description: formData.description.trim(),
        amount: Number(formData.amount),
        type: formData.type,
        personName: formData.personName.trim(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : undefined,
        notes: formData.notes.trim() || undefined,
        status: 'pending'
      });
      
      // Save to storage
      const updatedDebts = [...debts, newDebt];
      debtStorage.save(updatedDebts);
      setDebts(updatedDebts);
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        type: 'borrowed',
        personName: '',
        dueDate: '',
        notes: ''
      });
      
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding debt:', error);
      alert('Failed to add debt');
    }
  };
  
  // Mark debt as paid
  const markAsPaid = (id: string) => {
    try {
      const updatedDebts = debts.map(debt => {
        if (debt.id === id) {
          return {
            ...debt,
            status: 'paid',
            updatedAt: Date.now()
          };
        }
        return debt;
      });
      
      debtStorage.save(updatedDebts);
      setDebts(updatedDebts);
    } catch (error) {
      console.error('Error updating debt status:', error);
      alert('Failed to update debt status');
    }
  };
  
  // Delete a debt
  const deleteDebt = (id: string) => {
    if (window.confirm('Are you sure you want to delete this debt?')) {
      try {
        const updatedDebts = debts.filter(d => d.id !== id);
        debtStorage.save(updatedDebts);
        setDebts(updatedDebts);
      } catch (error) {
        console.error('Error deleting debt:', error);
        alert('Failed to delete debt');
      }
    }
  };
  
  // Calculate totals
  const totals = debts.reduce((acc, debt) => {
    if (debt.status !== 'paid') {
      if (debt.type === 'borrowed') {
        acc.totalOwed += debt.amount;
      } else {
        acc.totalLent += debt.amount;
      }
    }
    return acc;
  }, { totalOwed: 0, totalLent: 0 });
  
  // Filter debts by status
  const pendingDebts = debts.filter(debt => debt.status === 'pending');
  const paidDebts = debts.filter(debt => debt.status === 'paid');
  
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Debts & Loans</h1>
            <p className="text-gray-600 dark:text-gray-300">Track money you've borrowed or lent</p>
          </div>

          {showAddForm ?(<Button
            type="button"
            variant="outline"
            leftIcon={<FiX />}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Cancel
          </Button>)
          :
          (<Button 
            leftIcon={<FiPlus />}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Add New
          </Button>)}
        </div>
      </motion.div>
      
      {/* Summary Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Money You Owe */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">You Owe</h3>
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FiArrowUp className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totals.totalOwed)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        {/* Money Owed to You */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Owed to You</h3>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FiArrowDown className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totals.totalLent)}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Add Debt Form */}
      {showAddForm && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Add New Debt/Loan</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Debt Type */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div 
                    className={`p-4 rounded-lg border cursor-pointer ${
                      formData.type === 'borrowed' 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, type: 'borrowed' }))}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="borrowed" 
                        name="type" 
                        value="borrowed" 
                        checked={formData.type === 'borrowed'} 
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="borrowed" className="font-medium text-gray-900 dark:text-white cursor-pointer">
                        Money I Borrowed
                      </label>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-lg border cursor-pointer ${
                      formData.type === 'lent' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, type: 'lent' }))}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="lent" 
                        name="type" 
                        value="lent" 
                        checked={formData.type === 'lent'} 
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="lent" className="font-medium text-gray-900 dark:text-white cursor-pointer">
                        Money I Lent
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Description */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      placeholder="e.g., Lunch money, Car loan"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
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
                  
                  {/* Person Name */}
                  <div className="space-y-2">
                    <label htmlFor="personName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Person Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="personName"
                        name="personName"
                        placeholder="Who did you borrow from/lend to?"
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={formData.personName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Due Date */}
                  <div className="space-y-2">
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Due Date (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={formData.dueDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Notes */}
                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    placeholder="Add any additional details..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" leftIcon={<FiPlus />}>
                    Add {formData.type === 'borrowed' ? 'Debt' : 'Loan'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Active Debts */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Active Debts & Loans</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : pendingDebts.length > 0 ? (
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {pendingDebts.map(debt => (
                  <motion.div
                    key={debt.id}
                    variants={itemVariants}
                    className={`border rounded-lg p-4 ${
                      debt.type === 'borrowed' 
                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
                        : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            debt.type === 'borrowed' 
                              ? 'bg-red-100 dark:bg-red-900/30' 
                              : 'bg-green-100 dark:bg-green-900/30'
                          }`}>
                            {debt.type === 'borrowed' ? (
                              <FiArrowUp className={`w-4 h-4 ${
                                debt.type === 'borrowed' ? 'text-red-500' : 'text-green-500'
                              }`} />
                            ) : (
                              <FiArrowDown className={`w-4 h-4 ${
                                debt.type === 'borrowed' ? 'text-red-500' : 'text-green-500'
                              }`} />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{debt.description}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {debt.type === 'borrowed' ? 'Borrowed from' : 'Lent to'}: {debt.personName}
                            </p>
                          </div>
                        </div>
                        
                        {debt.dueDate && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Due: {new Date(debt.dueDate).toLocaleDateString()}
                          </p>
                        )}
                        
                        {debt.notes && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {debt.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-center gap-2">
                        <span className={`text-lg font-bold ${
                          debt.type === 'borrowed' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                        }`}>
                          {formatCurrency(debt.amount)}
                        </span>
                        
                        <div className="flex space-x-2 ml-0 md:ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            leftIcon={<FiCheck />}
                            onClick={() => markAsPaid(debt.id)}
                          >
                            Mark as Paid
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteDebt(debt.id)}
                            aria-label={`Delete ${debt.description}`}
                          >
                            <FiTrash2 className="text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCreditCard className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Active Debts</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  You don't have any active debts or loans. Add one to keep track of money you've borrowed or lent.
                </p>
                <Button leftIcon={<FiPlus />} onClick={() => setShowAddForm(true)}>
                  Add Debt/Loan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Paid Debts */}
      {paidDebts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Paid Debts & Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paidDebts.map(debt => (
                  <div
                    key={debt.id}
                    className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                            <FiCheck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">{debt.description}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {debt.type === 'borrowed' ? 'Borrowed from' : 'Lent to'}: {debt.personName}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                          {formatCurrency(debt.amount)}
                        </span>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteDebt(debt.id)}
                          aria-label={`Delete ${debt.description}`}
                        >
                          <FiTrash2 className="text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
