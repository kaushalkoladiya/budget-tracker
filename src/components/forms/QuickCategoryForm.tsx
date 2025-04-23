'use client';

import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';

import Button from '@/components/ui/Button';
import ColorPicker from '@/components/ui/ColorPicker';
import { categoryStorage } from '@/lib/storage/localStorage';
import { Category, createCategory } from '@/types/models';

interface QuickCategoryFormProps {
  type: 'income' | 'expense';
  onSuccess: (categoryId: string) => void;
  onCancel: () => void;
}

export default function QuickCategoryForm({ type, onSuccess, onCancel }: QuickCategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    color: '#4CAF50',
    incomeOnly: type === 'income',
    expenseOnly: type === 'expense',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate
      if (!formData.name.trim()) {
        throw new Error('Category name is required');
      }
      
      // Create new category
      const newCategory = createCategory({
        name: formData.name.trim(),
        color: formData.color,
        icon: 'tag',
        incomeOnly: formData.incomeOnly,
        expenseOnly: formData.expenseOnly,
      });
      
      // Get existing categories
      const categories = categoryStorage.getAll();
      
      // Save
      categoryStorage.save([...categories, newCategory]);
      
      // Success callback
      onSuccess(newCategory.id);
    } catch (error) {
      console.error('Error creating category:', error);
      setError(error instanceof Error ? error.message : 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="e.g., Groceries, Rent, Salary"
          required
          autoFocus
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Color
        </label>
        
        <div className="flex items-center">
          <div 
            className="w-10 h-10 rounded-full mr-3 border border-gray-300 dark:border-gray-700" 
            style={{ backgroundColor: formData.color }}
          />
          <ColorPicker 
            selectedColor={formData.color} 
            onChange={handleColorChange} 
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          leftIcon={<FiPlus />}
          isLoading={isSubmitting}
        >
          Create Category
        </Button>
      </div>
    </form>
  );
} 