'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDollarSign, FiPieChart, FiPlus, FiTrendingDown, FiTrendingUp } from 'react-icons/fi';

import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { formatCurrency } from '@/lib/utils';
import { transactionStorage, budgetStorage, debtStorage, categoryStorage } from '@/lib/storage/localStorage';
import { Transaction, Budget, Debt } from '@/types/models';

export default function Dashboard() {
  // State for financial data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Financial summary
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    totalOwed: 0,
    totalLent: 0
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const loadedTransactions = transactionStorage.getAll();
        const loadedBudgets = budgetStorage.getAll();
        const loadedDebts = debtStorage.getAll();

        setTransactions(loadedTransactions);
        setBudgets(loadedBudgets);
        setDebts(loadedDebts);

        // Calculate financial summary
        const income = loadedTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = loadedTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalOwed = loadedDebts
          .filter(d => d.type === 'borrowed' && d.status !== 'paid')
          .reduce((sum, d) => sum + d.amount, 0);
        
        const totalLent = loadedDebts
          .filter(d => d.type === 'lent' && d.status !== 'paid')
          .reduce((sum, d) => sum + d.amount, 0);

        setSummary({
          balance: income - expenses,
          income,
          expenses,
          totalOwed,
          totalLent
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Get recent transactions
  const recentTransactions = transactions
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

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
        duration: 0.5
      }
    }
  };

  // Empty state for first-time users
  if (!isLoading && transactions.length === 0 && budgets.length === 0 && debts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiDollarSign className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Budget Tracker!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Let's start tracking your finances. Add your first transaction, create a budget, or log a debt.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/transactions/new">
              <Button variant="primary" fullWidth leftIcon={<FiPlus />}>
                Add Transaction
              </Button>
            </Link>
            <Link href="/budgets/new">
              <Button variant="outline" fullWidth leftIcon={<FiPlus />}>
                Create Budget
              </Button>
            </Link>
            <Link href="/debts/new">
              <Button variant="outline" fullWidth leftIcon={<FiPlus />}>
                Log Debt
              </Button>
            </Link>
          </div>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Overview of your financial status</p>
      </motion.div>

      {/* Financial Summary Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Balance Card */}
        <motion.div variants={itemVariants}>
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
                  {formatCurrency(summary.balance)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Income Card */}
        <motion.div variants={itemVariants}>
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
                  {formatCurrency(summary.income)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expenses Card */}
        <motion.div variants={itemVariants}>
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
                  {formatCurrency(summary.expenses)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Link href="/transactions">
                  <Button variant="ghost" size="sm" rightIcon={<FiArrowRight />}>
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`font-medium ${
                        transaction.type === 'income' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No transactions yet</p>
                  <Link href="/transactions/new">
                    <Button size="sm" leftIcon={<FiPlus />}>Add Transaction</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Debt Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Debt Summary</CardTitle>
                <Link href="/debts">
                  <Button variant="ghost" size="sm" rightIcon={<FiArrowRight />}>
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {debts.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Owed</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(summary.totalOwed)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Lent</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(summary.totalLent)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No debts or loans recorded</p>
                  <Link href="/debts/new">
                    <Button size="sm" leftIcon={<FiPlus />}>Add Debt/Loan</Button>
                  </Link>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/debts" className="w-full">
                <Button variant="outline" size="sm" fullWidth>
                  Manage Debts
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Budget Progress */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Budget Progress</CardTitle>
              <Link href="/budgets">
                <Button variant="ghost" size="sm" rightIcon={<FiArrowRight />}>
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {budgets.length > 0 ? (
              <div className="space-y-6">
                {budgets.slice(0, 3).map((budget) => {
                  // Find transactions for this budget's category
                  const categoryTransactions = transactions.filter(
                    t => t.type === 'expense' && 
                    t.categoryId === budget.categoryId &&
                    (!budget.subcategoryId || t.subcategoryId === budget.subcategoryId)
                  );
                  
                  // Calculate spent amount
                  const spentAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
                  
                  // Calculate percentage
                  const percentage = (spentAmount / budget.amount) * 100;
                  
                  // Find the category name from the categoryId
                  const category = categoryStorage.getById(budget.categoryId);
                  const categoryName = category ? category.name : 'Unknown Category';
                  
                  // Determine if over budget
                  const isOverBudget = spentAmount > budget.amount;
                  
                  return (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {categoryName}
                        </p>
                        <p className={`text-sm ${isOverBudget ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                          {formatCurrency(spentAmount)} / {formatCurrency(budget.amount)}
                          {isOverBudget && ' (Over Budget)'}
                        </p>
                      </div>
                      <ProgressBar 
                        value={percentage > 100 ? 100 : percentage} 
                        showValue 
                        color={isOverBudget ? 'red' : undefined}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No budgets set up yet</p>
                <Link href="/budgets/new">
                  <Button size="sm" leftIcon={<FiPlus />}>Create Budget</Button>
                </Link>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/budgets" className="w-full">
              <Button variant="outline" size="sm" fullWidth>
                Manage Budgets
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Charts Preview */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Financial Insights</CardTitle>
              <Link href="/insights">
                <Button variant="ghost" size="sm" rightIcon={<FiArrowRight />}>
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8">
            {transactions.length > 0 ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  <FiPieChart className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-gray-900 dark:text-white font-medium mb-2">View detailed charts and analytics</p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Get insights into your spending patterns</p>
                <Link href="/insights">
                  <Button>View Insights</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Add transactions to see insights</p>
                <Link href="/transactions/new">
                  <Button size="sm" leftIcon={<FiPlus />}>Add Transaction</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
