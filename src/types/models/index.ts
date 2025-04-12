import { v4 as uuidv4 } from 'uuid';

// Category Model
export interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
  parentId?: string;
  createdAt: number;
  updatedAt: number;
}

// Transaction Model
export interface Transaction {
  id: string;
  amount: number;
  date: number; // timestamp
  categoryId: string;
  subcategoryId?: string;
  description: string;
  type: 'income' | 'expense';
  createdAt: number;
  updatedAt: number;
}

// Budget Model
export interface Budget {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: number; // timestamp
  endDate?: number; // timestamp
  createdAt: number;
  updatedAt: number;
}

// Debt/Loan Model
export interface Debt {
  id: string;
  amount: number;
  date: number; // timestamp
  dueDate: number; // timestamp
  type: 'borrowed' | 'lent';
  personName: string;
  interest?: number;
  description: string;
  status: 'active' | 'partially_paid' | 'paid';
  createdAt: number;
  updatedAt: number;
}

// Repayment Model
export interface Repayment {
  id: string;
  debtId: string;
  amount: number;
  date: number; // timestamp
  note?: string;
  createdAt: number;
  updatedAt: number;
}

// Notification Model
export interface Notification {
  id: string;
  type: 'spike' | 'budget' | 'debt';
  message: string;
  read: boolean;
  date: number; // timestamp
  relatedId?: string; // ID of related item (transaction, budget, debt)
  createdAt: number;
}

// Settings Model
export interface Settings {
  currency: string;
  mongoDbUrl?: string;
  theme?: 'light' | 'dark' | 'system';
  useCloudStorage?: boolean;
  spikeNotifications: {
    enabled: boolean;
    threshold: number; // percentage (e.g., 50 for 50%)
    period: number; // days
    mutedCategories: string[]; // category IDs
  };
}

// Factory functions to create new objects
export const createCategory = (data: Partial<Category>): Category => ({
  id: uuidv4(),
  name: '',
  icon: 'default',
  color: '#4CAF50',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...data
});

export const createTransaction = (data: Partial<Transaction>): Transaction => ({
  id: uuidv4(),
  amount: 0,
  date: Date.now(),
  categoryId: '',
  description: '',
  type: 'expense',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...data
});

export const createBudget = (data: Partial<Budget>): Budget => ({
  id: uuidv4(),
  categoryId: '',
  amount: 0,
  period: 'monthly',
  startDate: Date.now(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...data
});

export const createDebt = (data: Partial<Debt>): Debt => ({
  id: uuidv4(),
  amount: 0,
  date: Date.now(),
  dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
  type: 'borrowed',
  personName: '',
  description: '',
  status: 'active',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...data
});

export const createRepayment = (data: Partial<Repayment>): Repayment => ({
  id: uuidv4(),
  debtId: '',
  amount: 0,
  date: Date.now(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...data
});

export const createNotification = (data: Partial<Notification>): Notification => ({
  id: uuidv4(),
  type: 'spike',
  message: '',
  read: false,
  date: Date.now(),
  createdAt: Date.now(),
  ...data
});

export const defaultSettings: Settings = {
  currency: 'USD',
  theme: 'system',
  useCloudStorage: false,
  spikeNotifications: {
    enabled: true,
    threshold: 50, // 50%
    period: 30, // 30 days
    mutedCategories: []
  }
};
