'use client';

import React from 'react';
import { FiPlus, FiSave } from 'react-icons/fi';

import Button from '@/components/ui/Button';
import ColorPicker from '@/components/ui/ColorPicker';

interface SubcategoryFormProps {
  formData: {
    name: string;
    color: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onColorChange: (color: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitButtonText: string;
  isEdit?: boolean;
}

export default function SubcategoryForm({
  formData,
  onChange,
  onColorChange,
  onSubmit,
  onCancel,
  submitButtonText,
  isEdit = false
}: SubcategoryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 mt-2">
      <div className="space-y-2">
        <label htmlFor="subcategoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Subcategory Name
        </label>
        <input
          type="text"
          id="subcategoryName"
          name="name"
          value={formData.name}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="e.g., Fast Food, Utilities"
          required
          autoFocus
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="subcategoryColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Color
        </label>
        
        <div className="flex items-center">
          <div 
            className="w-8 h-8 rounded-full mr-3 border border-gray-300 dark:border-gray-700" 
            style={{ backgroundColor: formData.color }}
          />
          <ColorPicker 
            selectedColor={formData.color} 
            onChange={onColorChange} 
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
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
