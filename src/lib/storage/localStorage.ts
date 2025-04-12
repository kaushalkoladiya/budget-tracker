import { 
  Category, 
  Transaction, 
  Budget, 
  Debt, 
  Repayment, 
  Notification, 
  Settings,
  defaultSettings,
} from '@/types/models/index';

// Storage keys
const STORAGE_KEYS = {
  CATEGORIES: 'budget-tracker-categories',
  TRANSACTIONS: 'budget-tracker-transactions',
  BUDGETS: 'budget-tracker-budgets',
  DEBTS: 'budget-tracker-debts',
  REPAYMENTS: 'budget-tracker-repayments',
  NOTIFICATIONS: 'budget-tracker-notifications',
  SETTINGS: 'budget-tracker-settings'
};

// Generic storage handler
class LocalStorageHandler<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  getAll(): T[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error retrieving ${this.key} from localStorage:`, error);
      return [];
    }
  }

  getById(id: string): T | undefined {
    const items = this.getAll();
    return items.find((item: any) => item.id === id);
  }

  save(items: T[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.key, JSON.stringify(items));
    } catch (error) {
      console.error(`Error saving ${this.key} to localStorage:`, error);
      
      // Check if we're hitting storage limits
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('LocalStorage quota exceeded. Consider enabling MongoDB storage in settings.');
      }
    }
  }

  add(item: T): void {
    const items = this.getAll();
    items.push(item);
    this.save(items);
  }

  update(id: string, updatedItem: Partial<T>): void {
    const items = this.getAll();
    const index = items.findIndex((item: any) => item.id === id);
    
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedItem, updatedAt: Date.now() };
      this.save(items);
    }
  }

  delete(id: string): void {
    const items = this.getAll();
    const filteredItems = items.filter((item: any) => item.id !== id);
    this.save(filteredItems);
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.key);
  }
}

// Specific storage handlers
export const categoryStorage = new LocalStorageHandler<Category>(STORAGE_KEYS.CATEGORIES);
export const transactionStorage = new LocalStorageHandler<Transaction>(STORAGE_KEYS.TRANSACTIONS);
export const budgetStorage = new LocalStorageHandler<Budget>(STORAGE_KEYS.BUDGETS);
export const debtStorage = new LocalStorageHandler<Debt>(STORAGE_KEYS.DEBTS);
export const repaymentStorage = new LocalStorageHandler<Repayment>(STORAGE_KEYS.REPAYMENTS);
export const notificationStorage = new LocalStorageHandler<Notification>(STORAGE_KEYS.NOTIFICATIONS);

// Settings storage handler
export const settingsStorage = {
  getAll: (): Settings[] => {
    const settings = getSettings();
    return settings ? [settings] : [];
  },
  
  get: (): Settings => {
    return getSettings();
  },
  
  save: (settings: Settings): void => {
    saveSettings(settings);
  },
  
  update: (updatedSettings: Partial<Settings>): void => {
    const currentSettings = getSettings();
    saveSettings({ ...currentSettings, ...updatedSettings });
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
};

// Settings storage with default values
export const getSettings = (): Settings => {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch (error) {
    console.error('Error retrieving settings from localStorage:', error);
    return defaultSettings;
  }
};

export const saveSettings = (settings: Settings): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
};

// Clear all data
export const clearAllData = (): void => {
  if (typeof window === 'undefined') return;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Check if data exists (for first-time users)
export const hasExistingData = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return Object.values(STORAGE_KEYS).some(key => {
    const data = localStorage.getItem(key);
    return data && data !== '[]' && data !== '{}';
  });
};

// Get storage usage info
export const getStorageInfo = (): { used: number, total: number, percentage: number } => {
  if (typeof window === 'undefined') {
    return { used: 0, total: 5 * 1024 * 1024, percentage: 0 };
  }
  
  let totalSize = 0;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    const item = localStorage.getItem(key);
    if (item) {
      totalSize += item.length * 2; // Approximate size in bytes (2 bytes per character)
    }
  });
  
  // Estimate total localStorage size (typically 5-10MB)
  const estimatedTotal = 5 * 1024 * 1024; // 5MB
  
  return {
    used: totalSize,
    total: estimatedTotal,
    percentage: (totalSize / estimatedTotal) * 100
  };
};
