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
  parentCategoryId: string;
}

// Category model
export interface Category extends BaseModel {
  name: string;
  color: string;
  icon?: string;
  incomeOnly: boolean;
  expenseOnly: boolean;
  subcategories: Subcategory[];
}

// Transaction model
export interface Transaction extends BaseModel {
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  categoryId?: string;
  subcategoryId?: string;
  notes?: string;
  tags?: string[];
}

// Budget model
export interface Budget extends BaseModel {
  name: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  rollover?: boolean;
}

// Debt model
export interface Debt extends BaseModel {
  name: string;
  amount: number;
  type: 'borrowed' | 'lent';
  date: string;
  dueDate?: string;
  personName: string;
  notes?: string;
  isPaid: boolean;
  paidDate?: string;
}

// Settings model
export interface Settings {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  startDayOfWeek: number;
  useCloudStorage: boolean;
  mongoDbUrl?: string;
}

// Helper functions to create new entities
export const generateId = () => `_${Date.now()}${Math.random().toString(36).substring(2, 9)}`;

export const createCategory = (data: Partial<Category>): Category => {
  const now = Date.now();
  return {
    id: `cat_${now}_${Math.random().toString(36).substring(2, 9)}`,
    name: data.name || 'New Category',
    color: data.color || '#3B82F6',
    icon: data.icon || 'tag',
    incomeOnly: data.incomeOnly || false,
    expenseOnly: data.expenseOnly || false,
    subcategories: data.subcategories || [],
    createdAt: now,
    updatedAt: now
  };
};

export const createSubcategory = (data: Partial<Subcategory>): Subcategory => {
  const now = Date.now();
  return {
    id: `subcat_${now}_${Math.random().toString(36).substring(2, 9)}`,
    name: data.name || 'New Subcategory',
    color: data.color || '#3B82F6',
    parentCategoryId: data.parentCategoryId || '',
    createdAt: now,
    updatedAt: now
  };
};

export const createTransaction = (data: Partial<Transaction>): Transaction => {
  const now = Date.now();
  return {
    id: `txn_${now}_${Math.random().toString(36).substring(2, 9)}`,
    amount: data.amount || 0,
    description: data.description || '',
    date: data.date || new Date().toISOString().split('T')[0],
    type: data.type || 'expense',
    categoryId: data.categoryId,
    subcategoryId: data.subcategoryId,
    notes: data.notes,
    tags: data.tags || [],
    createdAt: now,
    updatedAt: now
  };
};

export const createBudget = (data: Partial<Budget>): Budget => {
  const now = Date.now();
  return {
    id: `bud_${now}_${Math.random().toString(36).substring(2, 9)}`,
    name: data.name || 'New Budget',
    amount: data.amount || 0,
    period: data.period || 'monthly',
    categoryId: data.categoryId,
    startDate: data.startDate,
    endDate: data.endDate,
    rollover: data.rollover || false,
    createdAt: now,
    updatedAt: now
  };
};

export const createDebt = (data: Partial<Debt>): Debt => {
  const now = Date.now();
  return {
    id: `debt_${now}_${Math.random().toString(36).substring(2, 9)}`,
    name: data.name || 'New Debt',
    amount: data.amount || 0,
    type: data.type || 'borrowed',
    date: data.date || new Date().toISOString().split('T')[0],
    dueDate: data.dueDate,
    personName: data.personName || '',
    notes: data.notes,
    isPaid: data.isPaid || false,
    paidDate: data.paidDate,
    createdAt: now,
    updatedAt: now
  };
};
