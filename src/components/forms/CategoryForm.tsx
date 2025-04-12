'use client';

import React from 'react';
import { FiInfo, FiPlus, FiSave } from 'react-icons/fi';

import Button from '@/components/ui/Button';
import ColorPicker from '@/components/ui/ColorPicker';
import Tooltip from '@/components/ui/Tooltip';

interface CategoryFormProps {
  formData: {
    name: string;
    color: string;
    incomeOnly: boolean;
    expenseOnly: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onColorChange: (color: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText: string;
  isEdit?: boolean;
}

export default function CategoryForm({
  formData,
  onChange,
  onColorChange,
  onSubmit,
  submitButtonText,
  isEdit = false
}: CategoryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="e.g., Groceries, Rent, Salary"
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Color
          </label>
          <Tooltip content="Choose a color to help identify this category in charts and lists">
            <FiInfo className="w-4 h-4 text-gray-500" />
          </Tooltip>
        </div>
        
        <div className="flex items-center">
          <div 
            className="w-10 h-10 rounded-full mr-3 border border-gray-300 dark:border-gray-700" 
            style={{ backgroundColor: formData.color }}
          />
          <ColorPicker 
            selectedColor={formData.color} 
            onChange={onColorChange} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Category Type
          </span>
          <Tooltip content="Specify if this category should only be used for income, expenses, or both">
            <FiInfo className="w-4 h-4 text-gray-500" />
          </Tooltip>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
            formData.incomeOnly 
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
              : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
          }`}>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="incomeOnly"
                checked={formData.incomeOnly}
                onChange={onChange}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded flex items-center justify-center mr-2 ${
                formData.incomeOnly 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {formData.incomeOnly && <FiPlus className="w-3 h-3" />}
              </div>
              <span>Income Only</span>
            </div>
            <Tooltip content="This category will only appear when adding income transactions">
              <FiInfo className="w-4 h-4 text-gray-500" />
            </Tooltip>
          </label>
          
          <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
            formData.expenseOnly 
              ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
              : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
          }`}>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="expenseOnly"
                checked={formData.expenseOnly}
                onChange={onChange}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded flex items-center justify-center mr-2 ${
                formData.expenseOnly 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {formData.expenseOnly && <FiPlus className="w-3 h-3" />}
              </div>
              <span>Expense Only</span>
            </div>
            <Tooltip content="This category will only appear when adding expense transactions">
              <FiInfo className="w-4 h-4 text-gray-500" />
            </Tooltip>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          leftIcon={isEdit ? <FiSave /> : <FiPlus />}
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}
