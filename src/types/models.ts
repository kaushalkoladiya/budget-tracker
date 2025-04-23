import { v4 as uuidv4 } from 'uuid';

// Type definitions for commonly used string literals
export type TransactionType = 'income' | 'expense';
export const TRANSACTION_TYPES = {
  INCOME: 'income' as TransactionType,
  EXPENSE: 'expense' as TransactionType
};

export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export const BUDGET_PERIODS = {
  DAILY: 'daily' as BudgetPeriod,
  WEEKLY: 'weekly' as BudgetPeriod,
  MONTHLY: 'monthly' as BudgetPeriod,
  YEARLY: 'yearly' as BudgetPeriod
};

export type DebtType = 'borrowed' | 'lent';
export const DEBT_TYPES = {
  BORROWED: 'borrowed' as DebtType,
  LENT: 'lent' as DebtType
};

export type DebtStatus = 'active' | 'partially_paid' | 'paid';
export const DEBT_STATUS = {
  ACTIVE: 'active' as DebtStatus,
  PARTIALLY_PAID: 'partially_paid' as DebtStatus,
  PAID: 'paid' as DebtStatus
};

export type NotificationType = 'spike' | 'budget' | 'debt';
export const NOTIFICATION_TYPES = {
  SPIKE: 'spike' as NotificationType,
  BUDGET: 'budget' as NotificationType,
  DEBT: 'debt' as NotificationType
};

export type ThemeType = 'light' | 'dark' | 'system';
export const THEME_TYPES = {
  LIGHT: 'light' as ThemeType,
  DARK: 'dark' as ThemeType,
  SYSTEM: 'system' as ThemeType
};

// Base model with common fields for all entities
export interface BaseModel {
  id: string;
  createdAt: number;
  updatedAt: number;
}

// Subcategory model
export interface Subcategory extends BaseModel {
  name: string;
  color: string;
  parentCategoryId?: string;
}

// Category model
export interface Category extends BaseModel {
  name: string;
  color: string;
  icon: string;
  incomeOnly?: boolean;
  expenseOnly?: boolean;
  subcategories?: Subcategory[];
  parentId?: string;
}

// Transaction model
export interface Transaction extends BaseModel {
  amount: number;
  description: string;
  date: number; // timestamp
  type: TransactionType;
  categoryId: string;
  subcategoryId?: string;
  notes?: string;
  tags?: string[];
}

// Budget model
export interface Budget extends BaseModel {
  name?: string;
  amount: number;
  period: BudgetPeriod;
  categoryId: string;
  subcategoryId?: string;
  startDate: number; // timestamp
  endDate?: number; // timestamp
  rollover?: boolean;
}

// Debt model
export interface Debt extends BaseModel {
  name?: string;
  amount: number;
  type: DebtType;
  date: number; // timestamp
  dueDate: number; // timestamp
  personName: string;
  interest?: number;
  description: string;
  notes?: string;
  status: DebtStatus;
  isPaid?: boolean;
  paidDate?: number; // timestamp
}

// Repayment Model
export interface Repayment extends BaseModel {
  id: string;
  debtId: string;
  amount: number;
  date: number; // timestamp
  note?: string;
}

// Notification Model
export interface Notification extends BaseModel {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  date: number; // timestamp
  relatedId?: string; // ID of related item
}

// Settings model
export interface Settings {
  currency: string;
  theme?: ThemeType;
  language?: string;
  useCloudStorage?: boolean;
  mongoDbUrl?: string;
  startDayOfWeek?: number;
  spikeNotifications: {
    enabled: boolean;
    threshold: number; // percentage (e.g., 50 for 50%)
    period: number; // days
    mutedCategories: string[]; // category IDs
  };
}

// Helper functions to create new entities
export const generateId = () => `_${Date.now()}${Math.random().toString(36).substring(2, 9)}`;

export const createCategory = (data: Partial<Category>): Category => {
  const now = Date.now();
  return {
    id: data.id || uuidv4(),
    name: data.name || 'New Category',
    color: data.color || '#3B82F6',
    icon: data.icon || 'tag',
    incomeOnly: data.incomeOnly || false,
    expenseOnly: data.expenseOnly || false,
    subcategories: data.subcategories || [],
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
};

export const createSubcategory = (data: Partial<Subcategory>): Subcategory => {
  const now = Date.now();
  return {
    id: data.id || uuidv4(),
    name: data.name || 'New Subcategory',
    color: data.color || '#3B82F6',
    parentCategoryId: data.parentCategoryId || '',
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
};

export const createTransaction = (data: Partial<Transaction>): Transaction => {
  const now = Date.now();
  return {
    id: data.id || uuidv4(),
    amount: data.amount || 0,
    description: data.description || '',
    date: data.date || now,
    type: data.type || TRANSACTION_TYPES.EXPENSE,
    categoryId: data.categoryId || '',
    subcategoryId: data.subcategoryId,
    notes: data.notes,
    tags: data.tags || [],
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
};

export const createBudget = (data: Partial<Budget>): Budget => {
  const now = Date.now();
  return {
    id: data.id || uuidv4(),
    name: data.name,
    amount: data.amount || 0,
    period: data.period || BUDGET_PERIODS.MONTHLY,
    categoryId: data.categoryId || '',
    subcategoryId: data.subcategoryId,
    startDate: data.startDate || now,
    endDate: data.endDate,
    rollover: data.rollover || false,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
};

export const createDebt = (data: Partial<Debt>): Debt => {
  const now = Date.now();
  return {
    id: data.id || uuidv4(),
    name: data.name,
    amount: data.amount || 0,
    type: data.type || DEBT_TYPES.BORROWED,
    date: data.date || now,
    dueDate: data.dueDate || (now + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    personName: data.personName || '',
    description: data.description || '',
    notes: data.notes,
    status: data.status || DEBT_STATUS.ACTIVE,
    isPaid: data.isPaid || false,
    paidDate: data.paidDate,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
};

export const createRepayment = (data: Partial<Repayment>): Repayment => {
  const now = Date.now();
  return {
    id: data.id || uuidv4(),
    debtId: data.debtId || '',
    amount: data.amount || 0,
    date: data.date || now,
    note: data.note,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
};

export const createNotification = (data: Partial<Notification>): Notification => {
  const now = Date.now();
  return {
    id: data.id || uuidv4(),
    type: data.type || NOTIFICATION_TYPES.SPIKE,
    message: data.message || '',
    read: data.read || false,
    date: data.date || now,
    relatedId: data.relatedId,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
};

export const defaultSettings: Settings = {
  currency: 'USD',
  theme: THEME_TYPES.SYSTEM,
  language: 'en',
  useCloudStorage: false,
  startDayOfWeek: 0, // Sunday
  spikeNotifications: {
    enabled: true,
    threshold: 50, // 50%
    period: 30, // 30 days
    mutedCategories: []
  }
};