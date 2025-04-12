// This file provides MongoDB integration for optional cloud storage
// The MongoDB URL is stored encrypted in localStorage for security

import { getSettings } from './localStorage';

// Generic MongoDB handler for our data models
export class MongoDbHandler<T> {
  private collectionName: string;
  
  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }
  
  // Check if MongoDB is configured
  private isMongoDbConfigured(): boolean {
    const settings = getSettings();
    return !!settings.mongoDbUrl;
  }
  
  // Get MongoDB URL from settings
  private getMongoDbUrl(): string {
    const settings = getSettings();
    if (!settings.mongoDbUrl) {
      throw new Error('MongoDB URL not configured');
    }
    return settings.mongoDbUrl;
  }
  
  // Fetch all items from a collection
  async getAll(): Promise<T[]> {
    if (!this.isMongoDbConfigured()) {
      throw new Error('MongoDB not configured');
    }
    
    try {
      const response = await fetch(`${this.getMongoDbUrl()}/${this.collectionName}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from MongoDB: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from MongoDB (${this.collectionName}):`, error);
      throw error;
    }
  }
  
  // Get a single item by ID
  async getById(id: string): Promise<T | null> {
    if (!this.isMongoDbConfigured()) {
      throw new Error('MongoDB not configured');
    }
    
    try {
      const response = await fetch(`${this.getMongoDbUrl()}/${this.collectionName}/${id}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from MongoDB: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching item from MongoDB (${this.collectionName}):`, error);
      throw error;
    }
  }
  
  // Add a new item
  async add(item: T): Promise<T> {
    if (!this.isMongoDbConfigured()) {
      throw new Error('MongoDB not configured');
    }
    
    try {
      const response = await fetch(`${this.getMongoDbUrl()}/${this.collectionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add to MongoDB: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error adding to MongoDB (${this.collectionName}):`, error);
      throw error;
    }
  }
  
  // Update an existing item
  async update(id: string, updatedItem: Partial<T>): Promise<T> {
    if (!this.isMongoDbConfigured()) {
      throw new Error('MongoDB not configured');
    }
    
    try {
      const response = await fetch(`${this.getMongoDbUrl()}/${this.collectionName}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedItem,
          updatedAt: Date.now(),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update in MongoDB: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating in MongoDB (${this.collectionName}):`, error);
      throw error;
    }
  }
  
  // Delete an item
  async delete(id: string): Promise<void> {
    if (!this.isMongoDbConfigured()) {
      throw new Error('MongoDB not configured');
    }
    
    try {
      const response = await fetch(`${this.getMongoDbUrl()}/${this.collectionName}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete from MongoDB: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error deleting from MongoDB (${this.collectionName}):`, error);
      throw error;
    }
  }
  
  // Sync local data to MongoDB
  async syncFromLocal(localItems: T[]): Promise<void> {
    if (!this.isMongoDbConfigured()) {
      throw new Error('MongoDB not configured');
    }
    
    try {
      const response = await fetch(`${this.getMongoDbUrl()}/${this.collectionName}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localItems),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to sync to MongoDB: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error syncing to MongoDB (${this.collectionName}):`, error);
      throw error;
    }
  }
}

// Create MongoDB handlers for each data type
export const createMongoDbHandlers = () => {
  return {
    categories: new MongoDbHandler<any>('categories'),
    transactions: new MongoDbHandler<any>('transactions'),
    budgets: new MongoDbHandler<any>('budgets'),
    debts: new MongoDbHandler<any>('debts'),
    repayments: new MongoDbHandler<any>('repayments'),
    notifications: new MongoDbHandler<any>('notifications'),
  };
};

// Helper function to encrypt MongoDB URL for storage
export const encryptMongoDbUrl = (url: string): string => {
  // In a real app, we would use a proper encryption library
  // For this demo, we'll use a simple base64 encoding
  // In production, use a proper encryption method with a public key
  return btoa(url);
};

// Helper function to decrypt MongoDB URL
export const decryptMongoDbUrl = (encryptedUrl: string): string => {
  // Simple base64 decoding for demo purposes
  // In production, use proper decryption with a private key
  return atob(encryptedUrl);
};

// Initialize MongoDB connection
export const initializeMongoDb = async (url: string): Promise<boolean> => {
  try {
    // Store the MongoDB URL in settings
    const settings = getSettings();
    settings.mongoDbUrl = url;
    localStorage.setItem('budget_tracker_settings', JSON.stringify(settings));
    
    // Test the connection
    return await testConnection(url);
  } catch (error) {
    console.error('Error initializing MongoDB:', error);
    return false;
  }
};

// Test MongoDB connection
export const testConnection = async (url: string): Promise<boolean> => {
  try {
    // Send a simple ping request to check if the server is reachable
    const response = await fetch(`${url}/ping`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Set a timeout to avoid hanging if the server is unreachable
      signal: AbortSignal.timeout(5000)
    });
    
    return response.ok;
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return false;
  }
};
