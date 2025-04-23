'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FiBarChart,
  FiPieChart,
  FiTrendingUp,
  FiDownload,
  FiFilter,
  FiCalendar,
} from 'react-icons/fi';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import {
  transactionStorage,
  categoryStorage,
} from '@/lib/storage/localStorage';
import { Transaction, Category, TRANSACTION_TYPES } from '@/types/models';

// Chart types
type ChartType = 'expense-pie' | 'income-expense-bar' | 'balance-line' | 'category-trends';

export default function InsightsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Chart filters
  const [selectedChart, setSelectedChart] = useState<ChartType>('expense-pie');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | 'all'>('all');

  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const loadedTransactions = transactionStorage.getAll();
        const loadedCategories = categoryStorage.getAll();

        setTransactions(loadedTransactions);
        setCategories(loadedCategories);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter transactions based on the selected time range
  const filteredTransactions = useMemo(() => {
    if (timeRange === 'all') return transactions;

    const now = Date.now();
    let cutoffTimestamp: number;

    switch (timeRange) {
      case '7d':
        cutoffTimestamp = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case '30d':
        cutoffTimestamp = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case '90d':
        cutoffTimestamp = now - 90 * 24 * 60 * 60 * 1000;
        break;
      case '1y':
        cutoffTimestamp = now - 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        cutoffTimestamp = 0; // Beginning of time
    }

    return transactions.filter(t => t.date >= cutoffTimestamp);
  }, [transactions, timeRange]);

  // Filter transactions by category if selected
  const categoryFilteredTransactions = useMemo(() => {
    if (selectedCategoryId === 'all') return filteredTransactions;
    return filteredTransactions.filter(t => t.categoryId === selectedCategoryId);
  }, [filteredTransactions, selectedCategoryId]);

  // Prepare data for charts
  const expensePieData = useMemo(() => {
    const expensesByCategory: Record<string, number> = {};

    filteredTransactions
      .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
      .forEach(transaction => {
        const categoryId = transaction.categoryId;
        if (categoryId && expensesByCategory[categoryId]) {
          expensesByCategory[categoryId] += transaction.amount;
        } else if (categoryId) {
          expensesByCategory[categoryId] = transaction.amount;
        }
      });

    return Object.entries(expensesByCategory).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        name: category?.name || 'Unknown',
        value: amount,
        color: category?.color || '#ccc',
      };
    }).sort((a, b) => b.value - a.value);
  }, [filteredTransactions, categories]);

  // Income vs Expense bar chart data (monthly)
  const incomeExpenseBarData = useMemo(() => {
    // Group transactions by month
    const monthlyData: Record<string, { month: string, income: number, expenses: number }> = {};

    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('default', { month: 'short', year: '2-digit' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          income: 0,
          expenses: 0,
        };
      }

      if (transaction.type === TRANSACTION_TYPES.INCOME) {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += transaction.amount;
      }
    });

    // Convert to array and sort by date
    return Object.values(monthlyData).sort((a, b) => {
      const aMonthParts = a.month.split(' ');
      const bMonthParts = b.month.split(' ');

      const aYear = parseInt(aMonthParts[1], 10);
      const bYear = parseInt(bMonthParts[1], 10);

      if (aYear !== bYear) return aYear - bYear;

      // Month comparison (short month names)
      const monthOrder = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      return monthOrder[aMonthParts[0] as keyof typeof monthOrder] -
        monthOrder[bMonthParts[0] as keyof typeof monthOrder];
    });
  }, [filteredTransactions]);

  // Balance line chart data (cumulative)
  const balanceLineData = useMemo(() => {
    if (filteredTransactions.length === 0) return [];

    // Sort transactions by date
    const sortedTransactions = [...filteredTransactions].sort((a, b) => a.date - b.date);

    let balance = 0;
    return sortedTransactions.map(transaction => {
      balance += transaction.type === TRANSACTION_TYPES.INCOME ? transaction.amount : -transaction.amount;
      const date = new Date(transaction.date);
      return {
        date: date.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
        balance,
      };
    });
  }, [filteredTransactions]);

  // Category trends over time
  const categoryTrendsData = useMemo(() => {
    // Group expenses by category and month
    const monthlyData: Record<string, Record<string, number | string>> = {};
    const categoryIds: Set<string> = new Set();

    filteredTransactions
      .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
      .forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const monthName = date.toLocaleString('default', { month: 'short', year: '2-digit' });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthName };
        }

        const categoryId = transaction.categoryId;
        if (categoryId) {
          categoryIds.add(categoryId);

          if (monthlyData[monthKey][categoryId]) {
            monthlyData[monthKey][categoryId] = (monthlyData[monthKey][categoryId] as number) + transaction.amount;
          } else {
            monthlyData[monthKey][categoryId] = transaction.amount;
          }
        }
      });

    // Convert to array for chart
    const result = Object.values(monthlyData).sort((a, b) => {
      const aMonthParts = (a.month as string).split(' ');
      const bMonthParts = (b.month as string).split(' ');

      const aYear = parseInt(aMonthParts[1], 10);
      const bYear = parseInt(bMonthParts[1], 10);

      if (aYear !== bYear) return aYear - bYear;

      // Month comparison (short month names)
      const monthOrder = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      return monthOrder[aMonthParts[0] as keyof typeof monthOrder] -
        monthOrder[bMonthParts[0] as keyof typeof monthOrder];
    });

    return {
      data: result,
      categories: Array.from(categoryIds).map(id => {
        const category = categories.find(c => c.id === id);
        return {
          id,
          name: category?.name || 'Unknown',
          color: category?.color || '#ccc',
        };
      }),
    };
  }, [filteredTransactions, categories]);

  // Color palette
  const COLORS = [
    '#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0',
    '#3F51B5', '#009688', '#795548', '#607D8B', '#E91E63',
  ];

  // Export chart as image
  const exportAsImage = async (chartId: string, filename: string) => {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return;

    try {
      const canvas = await html2canvas(chartElement);
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Failed to export chart');
    }
  };

  // Export chart as PDF
  const exportAsPDF = async (chartId: string, filename: string) => {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return;

    try {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Failed to export chart');
    }
  };

  // Format tooltips
  const formatTooltip = (value: number) => formatCurrency(value);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Empty state
  if (transactions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Insights</h1>
          <p className="text-gray-600 dark:text-gray-300">Visualize your financial data</p>
        </motion.div>

        <div className="max-w-md mx-auto text-center p-8">
          <FiPieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Data Yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Add some transactions to see insights and visualizations about your spending and income.
          </p>
          <Link href="/transactions/new">
            <Button>Add Transaction</Button>
          </Link>
        </div>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Insights</h1>
        <p className="text-gray-600 dark:text-gray-300">Visualize your financial data</p>
      </motion.div>

      {/* Chart Filters */}
      <motion.div
        className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Chart Type Filter */}
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <FiPieChart className="text-gray-500" />
          <select
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-200"
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value as ChartType)}
          >
            <option value="expense-pie">Expense Breakdown</option>
            <option value="income-expense-bar">Income vs Expenses</option>
            <option value="balance-line">Balance Over Time</option>
            <option value="category-trends">Category Trends</option>
          </select>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <FiCalendar className="text-gray-500" />
          <select
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-200"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <FiFilter className="text-gray-500" />
          <select
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-200"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Charts */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Expense Pie Chart */}
        {selectedChart === 'expense-pie' && (
          <motion.div variants={itemVariants}>
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Expense Breakdown</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportAsImage('expense-pie-chart', 'expense-breakdown')}
                    leftIcon={<FiDownload />}
                  >
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent id="expense-pie-chart">
                <div className="h-[400px]">
                  {expensePieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expensePieData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {expensePieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 dark:text-gray-400">No expense data available for the selected period</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Income vs Expenses Bar Chart */}
        {selectedChart === 'income-expense-bar' && (
          <motion.div variants={itemVariants}>
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Income vs Expenses</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportAsImage('income-expense-chart', 'income-vs-expenses')}
                    leftIcon={<FiDownload />}
                  >
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent id="income-expense-chart">
                <div className="h-[400px]">
                  {incomeExpenseBarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={incomeExpenseBarData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={formatTooltip} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="income" name="Income" fill="#4CAF50" />
                        <Bar dataKey="expenses" name="Expenses" fill="#FF5722" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 dark:text-gray-400">No data available for the selected period</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Balance Line Chart */}
        {selectedChart === 'balance-line' && (
          <motion.div variants={itemVariants}>
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Balance Over Time</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportAsImage('balance-chart', 'balance-over-time')}
                    leftIcon={<FiDownload />}
                  >
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent id="balance-chart">
                <div className="h-[400px]">
                  {balanceLineData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={balanceLineData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={formatTooltip} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="balance"
                          name="Balance"
                          stroke="#2196F3"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 dark:text-gray-400">No balance data available for the selected period</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Category Trends */}
        {selectedChart === 'category-trends' && (
          <motion.div variants={itemVariants}>
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Category Trends Over Time</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportAsImage('category-trends-chart', 'category-trends')}
                    leftIcon={<FiDownload />}
                  >
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent id="category-trends-chart">
                <div className="h-[400px]">
                  {categoryTrendsData.data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={categoryTrendsData.data}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={formatTooltip} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        {categoryTrendsData.categories.map((category, index) => (
                          <Line
                            key={category.id}
                            type="monotone"
                            dataKey={category.id}
                            name={category.name}
                            stroke={category.color || COLORS[index % COLORS.length]}
                            strokeWidth={2}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 dark:text-gray-400">No category trend data available for the selected period</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 