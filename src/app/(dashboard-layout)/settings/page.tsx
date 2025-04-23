'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiSave,
  FiDownload,
  FiUpload,
  FiMoon,
  FiSun,
  FiDollarSign,
  FiDatabase,
  FiTrash2,
  FiAlertTriangle,
  FiCheckCircle
} from 'react-icons/fi';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import {
  categoryStorage,
  transactionStorage,
  budgetStorage,
  debtStorage,
  settingsStorage
} from '@/lib/storage/localStorage';
import { initializeMongoDb, testConnection } from '@/lib/storage/mongoDb';

import { Settings, defaultSettings, THEME_TYPES } from '@/types/models';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'success' | 'error'>('none');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = settingsStorage.get();
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Save settings
  const saveSettings = async () => {
    setIsSaving(true);

    try {
      // Save settings to localStorage
      settingsStorage.save(settings);

      // Apply theme
      if (settings.theme === THEME_TYPES.DARK) {
        document.documentElement.classList.add('dark');
      } else if (settings.theme === THEME_TYPES.LIGHT) {
        document.documentElement.classList.remove('dark');
      } else {
        // System preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      // Initialize MongoDB if cloud storage is enabled
      if (settings.useCloudStorage && settings.mongoDbUrl) {
        await initializeMongoDb(settings.mongoDbUrl);
      }

      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Test MongoDB connection
  const testMongoDbConnection = async () => {
    if (!settings.mongoDbUrl) {
      setConnectionStatus('error');
      return;
    }

    setIsTestingConnection(true);

    try {
      const isConnected = await testConnection(settings.mongoDbUrl);
      setConnectionStatus(isConnected ? 'success' : 'error');
    } catch (error) {
      console.error('Error testing MongoDB connection:', error);
      setConnectionStatus('error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Export data as JSON
  const exportData = () => {
    try {
      const data = {
        categories: categoryStorage.getAll(),
        transactions: transactionStorage.getAll(),
        budgets: budgetStorage.getAll(),
        debts: debtStorage.getAll(),
        settings: settingsStorage.get()
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

      const exportFileDefaultName = `budget-tracker-export-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    }
  };

  // Import data from JSON
  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);

        // Validate data structure
        if (!importedData.categories || !importedData.transactions ||
          !importedData.budgets || !importedData.debts) {
          throw new Error('Invalid data format');
        }

        // Confirm before overwriting
        if (window.confirm('This will overwrite your current data. Are you sure you want to continue?')) {
          // Import data
          categoryStorage.save(importedData.categories);
          transactionStorage.save(importedData.transactions);
          budgetStorage.save(importedData.budgets);
          debtStorage.save(importedData.debts);

          // Import settings if available
          if (importedData.settings) {
            settingsStorage.save(importedData.settings);
            setSettings(importedData.settings);
          }

          alert('Data imported successfully');
        }
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Failed to import data. The file may be corrupted or in an invalid format.');
      }
    };

    reader.readAsText(file);
  };

  // Delete all data
  const deleteAllData = () => {
    try {
      // Clear all data from localStorage
      categoryStorage.clear();
      transactionStorage.clear();
      budgetStorage.clear();
      debtStorage.clear();

      // Reset settings to defaults
      settingsStorage.save(defaultSettings);

      setShowDeleteConfirm(false);
      alert('All data has been deleted');

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Failed to delete data');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Customize your Budget Tracker experience</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Theme */}
                <div className="space-y-2">
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={settings.theme}
                    onChange={handleChange}
                  >
                    <option value={THEME_TYPES.LIGHT}>Light</option>
                    <option value={THEME_TYPES.DARK}>Dark</option>
                    <option value={THEME_TYPES.SYSTEM}>System Preference</option>
                  </select>
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Currency
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <select
                      id="currency"
                      name="currency"
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={settings.currency}
                      onChange={handleChange}
                    >
                      <option value="USD">USD - US Dollar ($)</option>
                      <option value="EUR">EUR - Euro (€)</option>
                      <option value="GBP">GBP - British Pound (£)</option>
                      <option value="JPY">JPY - Japanese Yen (¥)</option>
                      <option value="CAD">CAD - Canadian Dollar (C$)</option>
                      <option value="AUD">AUD - Australian Dollar (A$)</option>
                      <option value="INR">INR - Indian Rupee (₹)</option>
                      <option value="CNY">CNY - Chinese Yuan (¥)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Storage Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Data Storage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cloud Storage Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cloud Storage</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable to sync your data across devices using MongoDB
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="useCloudStorage"
                      className="sr-only peer"
                      checked={settings.useCloudStorage}
                      onChange={handleChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* MongoDB URL */}
                {settings.useCloudStorage && (
                  <div className="space-y-2">
                    <label htmlFor="mongoDbUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      MongoDB Connection URL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDatabase className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="mongoDbUrl"
                        name="mongoDbUrl"
                        placeholder="mongodb+srv://username:password@cluster.mongodb.net/database"
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={settings.mongoDbUrl || ''}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div>
                        {connectionStatus === 'success' && (
                          <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                            <FiCheckCircle className="mr-1" /> Connection successful
                          </p>
                        )}
                        {connectionStatus === 'error' && (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                            <FiAlertTriangle className="mr-1" /> Connection failed
                          </p>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testMongoDbConnection}
                        isLoading={isTestingConnection}
                      >
                        Test Connection
                      </Button>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your connection URL is stored securely in your browser&apos;s localStorage.
                    </p>
                  </div>
                )}

                {/* Data Import/Export */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Management</h3>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      leftIcon={<FiDownload />}
                      onClick={exportData}
                    >
                      Export Data
                    </Button>

                    <div className="relative">
                      <Button
                        variant="outline"
                        leftIcon={<FiUpload />}
                        onClick={() => document.getElementById('import-file')?.click()}
                      >
                        Import Data
                      </Button>
                      <input
                        type="file"
                        id="import-file"
                        accept=".json"
                        className="hidden"
                        onChange={importData}
                      />
                    </div>

                    <Button
                      variant="outline"
                      leftIcon={<FiTrash2 />}
                      className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete All Data
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  leftIcon={<FiSave />}
                  onClick={saveSettings}
                  isLoading={isSaving}
                >
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Budget Tracker</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Version 1.0.0</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Features</h4>
                <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                  <li>Track income and expenses</li>
                  <li>Set and monitor budgets</li>
                  <li>Manage debts and loans</li>
                  <li>Create custom categories</li>
                  <li>Works offline (PWA)</li>
                  <li>Optional cloud sync</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Technologies</h4>
                <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                  <li>Next.js</li>
                  <li>Tailwind CSS</li>
                  <li>Framer Motion</li>
                  <li>MongoDB (optional)</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your data is stored locally in your browser by default. Enable cloud storage to sync across devices.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
                <FiAlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                Delete All Data
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                This action cannot be undone. All your transactions, categories, budgets, and debts will be permanently deleted.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  leftIcon={<FiTrash2 />}
                  onClick={deleteAllData}
                >
                  Delete All Data
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
