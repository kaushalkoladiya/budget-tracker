import React from 'react';
import { FiCheck } from 'react-icons/fi';

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

const PREDEFINED_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#EAB308', // Yellow
  '#84CC16', // Lime
  '#22C55E', // Green
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#0EA5E9', // Light Blue
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#A855F7', // Purple
  '#D946EF', // Fuchsia
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#000000', // Black
];

export default function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2 mt-2">
      {PREDEFINED_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          aria-label={`Select color ${color}`}
        >
          {selectedColor === color && (
            <FiCheck 
              className={`w-4 h-4 ${
                ['#000000', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#6B7280'].includes(color) 
                  ? 'text-white' 
                  : 'text-gray-900'
              }`} 
            />
          )}
        </button>
      ))}
    </div>
  );
}
