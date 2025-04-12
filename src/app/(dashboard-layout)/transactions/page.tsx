'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiFilter, 
  FiSearch, 
  FiChevronDown, 
  FiChevronUp,
  FiEdit2,
  FiTrash2,
  FiX,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';

import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { transactionStorage, categoryStorage } from '@/lib/storage/localStorage';
import { Transaction, Category } from '@/types/models';

export default function TransactionsPage() {
  // State for transactions and categories
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const loadedTransactions = transactionStorage.getAll();
        const loadedCategories = categoryStorage.getAll();
        
        setTransactions(loadedTransactions);
        setCategories(loadedCategories);
      } catch (error) {
        console.error('Error loading transactions data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle transaction deletion
  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const updatedTransactions = transactions.filter(t => t.id !== id);
        transactionStorage.save(updatedTransactions);
        setTransactions(updatedTransactions);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };
  
  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      // Filter by type
      if (filterType !== 'all' && transaction.type !== filterType) {
        return false;
      }
      
      // Filter by category
      if (filterCategory && transaction.categoryId !== filterCategory) {
        return false;
      }
      
      // Search by description
      if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? a.date - b.date 
          : b.date - a.date;
      } else {
        return sortDirection === 'asc' 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      }
    });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  // Toggle sort direction or change sort field
  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };
  
  // Empty state for first-time users
  if (!isLoading && transactions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiDollarSign className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No Transactions Yet</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Start tracking your finances by adding your first transaction.
          </p>
          <Link href="/transactions/new">
            <Button variant="primary" leftIcon={<FiPlus />}>
              Add Your First Transaction
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }
  
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your income and expenses</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/transactions/new">
              <Button leftIcon={<FiPlus />}>Add Transaction</Button>
            </Link>
            <Button 
              variant="outline" 
              leftIcon={<FiFilter />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Type Filter */}
                <div>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income Only</option>
                    <option value="expense">Expenses Only</option>
                  </select>
                </div>
                
                {/* Category Filter */}
                <div>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2"
                    value={filterCategory || ''}
                    onChange={(e) => setFilterCategory(e.target.value || null)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  leftIcon={<FiX />}
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setFilterCategory(null);
                    setSortField('date');
                    setSortDirection('desc');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : paginatedTransactions.length > 0 ? (
            <>
              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Category</th>
                      <th 
                        className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 cursor-pointer"
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center">
                          <span>Date</span>
                          {sortField === 'date' && (
                            sortDirection === 'asc' ? 
                              <FiChevronUp className="ml-1" /> : 
                              <FiChevronDown className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400 cursor-pointer"
                        onClick={() => handleSort('amount')}
                      >
                        <div className="flex items-center justify-end">
                          <span>Amount</span>
                          {sortField === 'amount' && (
                            sortDirection === 'asc' ? 
                              <FiChevronUp className="ml-1" /> : 
                              <FiChevronDown className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {paginatedTransactions.map((transaction) => (
                      <motion.tr 
                        key={transaction.id}
                        variants={itemVariants}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.notes || 'No notes'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {getCategoryName(transaction.categoryId)}
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className={`py-3 px-4 text-right font-medium ${
                          transaction.type === 'income' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link href={`/transactions/edit/${transaction.id}`}>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                aria-label="Edit transaction"
                              >
                                <FiEdit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              aria-label="Delete transaction"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                            >
                              <FiTrash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No transactions found matching your filters</p>
              <Button 
                variant="outline" 
                leftIcon={<FiX />}
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setFilterCategory(null);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Income Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Income</h3>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(
                  transactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </span>
            </div>
          </CardContent>
        </Card>
        
        {/* Expenses Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Expenses</h3>
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FiTrendingDown className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(
                  transactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </span>
            </div>
          </CardContent>
        </Card>
        
        {/* Balance Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Current Balance</h3>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FiDollarSign className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(
                  transactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0) -
                  transactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
