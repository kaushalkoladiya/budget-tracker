'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';

import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import CategoryForm from '@/components/forms/CategoryForm';
import SubcategoryForm from '@/components/forms/SubcategoryForm';
import Tooltip from '@/components/ui/Tooltip';
import { categoryStorage } from '@/lib/storage/localStorage';
import { Category, createCategory, createSubcategory } from '@/types/models';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [addingSubcategoryFor, setAddingSubcategoryFor] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{categoryId: string, subcategoryId: string} | null>(null);
  
  // Form states
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#3B82F6',
    icon: 'tag',
    incomeOnly: false,
    expenseOnly: false
  });
  
  const [editForm, setEditForm] = useState({
    name: '',
    color: '',
    icon: '',
    incomeOnly: false,
    expenseOnly: false
  });
  
  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    color: '#3B82F6'
  });
  
  const [editSubcategoryForm, setEditSubcategoryForm] = useState({
    name: '',
    color: ''
  });
  
  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = () => {
    try {
      const loadedCategories = categoryStorage.getAll();
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle adding a new category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    
    try {
      const category = createCategory({
        name: newCategory.name.trim(),
        color: newCategory.color,
        icon: newCategory.icon,
        incomeOnly: newCategory.incomeOnly,
        expenseOnly: newCategory.expenseOnly,
        subcategories: []
      });
      
      const updatedCategories = [...categories, category];
      categoryStorage.save(updatedCategories);
      setCategories(updatedCategories);
      setNewCategory({
        name: '',
        color: '#3B82F6',
        icon: 'tag',
        incomeOnly: false,
        expenseOnly: false
      });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };
  
  // Start editing a category
  const startEditing = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setEditForm({
        name: category.name,
        color: category.color || '#3B82F6',
        icon: category.icon || 'tag',
        incomeOnly: category.incomeOnly,
        expenseOnly: category.expenseOnly
      });
      setEditingCategory(categoryId);
    }
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingCategory(null);
    setEditForm({
      name: '',
      color: '',
      icon: '',
      incomeOnly: false,
      expenseOnly: false
    });
  };
  
  // Save edited category
  const saveCategory = (e: React.FormEvent, categoryId: string) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;
    
    try {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            name: editForm.name.trim(),
            color: editForm.color,
            icon: editForm.icon,
            incomeOnly: editForm.incomeOnly,
            expenseOnly: editForm.expenseOnly,
            updatedAt: Date.now()
          };
        }
        return category;
      });
      
      categoryStorage.save(updatedCategories);
      setCategories(updatedCategories);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };
  
  // Delete a category
  const deleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will not delete associated transactions, but they will become uncategorized.')) {
      try {
        const updatedCategories = categories.filter(c => c.id !== categoryId);
        categoryStorage.save(updatedCategories);
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };
  
  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  };
  
  // Start adding a subcategory
  const startAddingSubcategory = (categoryId: string) => {
    setAddingSubcategoryFor(categoryId);
    setNewSubcategory({
      name: '',
      color: categories.find(c => c.id === categoryId)?.color || '#3B82F6'
    });
  };
  
  // Cancel adding subcategory
  const cancelAddingSubcategory = () => {
    setAddingSubcategoryFor(null);
  };
  
  // Handle adding a new subcategory
  const handleAddSubcategory = (e: React.FormEvent, categoryId: string) => {
    e.preventDefault();
    if (!newSubcategory.name.trim()) return;
    
    try {
      const subcategory = createSubcategory({
        name: newSubcategory.name.trim(),
        color: newSubcategory.color,
        parentCategoryId: categoryId
      });
      
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            subcategories: [...(category.subcategories || []), subcategory],
            updatedAt: Date.now()
          };
        }
        return category;
      });
      
      categoryStorage.save(updatedCategories);
      setCategories(updatedCategories);
      setAddingSubcategoryFor(null);
      setExpandedCategory(categoryId); // Expand to show the new subcategory
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };
  
  // Start editing a subcategory
  const startEditingSubcategory = (categoryId: string, subcategoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const subcategory = category?.subcategories?.find(s => s.id === subcategoryId);
    
    if (subcategory) {
      setEditSubcategoryForm({
        name: subcategory.name,
        color: subcategory.color || '#3B82F6'
      });
      setEditingSubcategory({ categoryId, subcategoryId });
    }
  };
  
  // Cancel editing subcategory
  const cancelEditingSubcategory = () => {
    setEditingSubcategory(null);
  };
  
  // Save edited subcategory
  const saveSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubcategory || !editSubcategoryForm.name.trim()) return;
    
    try {
      const { categoryId, subcategoryId } = editingSubcategory;
      
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            subcategories: (category.subcategories || []).map(subcategory => {
              if (subcategory.id === subcategoryId) {
                return {
                  ...subcategory,
                  name: editSubcategoryForm.name.trim(),
                  color: editSubcategoryForm.color,
                  updatedAt: Date.now()
                };
              }
              return subcategory;
            }),
            updatedAt: Date.now()
          };
        }
        return category;
      });
      
      categoryStorage.save(updatedCategories);
      setCategories(updatedCategories);
      setEditingSubcategory(null);
    } catch (error) {
      console.error('Error updating subcategory:', error);
    }
  };
  
  // Delete a subcategory
  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    if (window.confirm('Are you sure you want to delete this subcategory? This will not delete associated transactions.')) {
      try {
        const updatedCategories = categories.map(category => {
          if (category.id === categoryId) {
            return {
              ...category,
              subcategories: (category.subcategories || []).filter(s => s.id !== subcategoryId),
              updatedAt: Date.now()
            };
          }
          return category;
        });
        
        categoryStorage.save(updatedCategories);
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Error deleting subcategory:', error);
      }
    }
  };
  
  // Handle form input changes for new category
  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setNewCategory(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  // Handle color change for new category
  const handleNewCategoryColorChange = (color: string) => {
    setNewCategory(prev => ({
      ...prev,
      color
    }));
  };
  
  // Handle form input changes for editing category
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  // Handle color change for editing category
  const handleEditFormColorChange = (color: string) => {
    setEditForm(prev => ({
      ...prev,
      color
    }));
  };
  
  // Handle form input changes for new subcategory
  const handleNewSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSubcategory(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle color change for new subcategory
  const handleNewSubcategoryColorChange = (color: string) => {
    setNewSubcategory(prev => ({
      ...prev,
      color
    }));
  };
  
  // Handle form input changes for editing subcategory
  const handleEditSubcategoryFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditSubcategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubcategoryColorChange = (color: string) => {
    setEditSubcategoryForm(prev => ({
      ...prev,
      color,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your income and expense categories</p>
      </motion.div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm
            formData={newCategory}
            onChange={handleNewCategoryChange}
            onColorChange={handleNewCategoryColorChange}
            onSubmit={handleAddCategory}
            submitButtonText="Add Category"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : categories.length > 0 ? (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {categories.map(category => (
                <motion.div
                  key={category.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {editingCategory === category.id ? (
                    <CategoryForm
                      formData={editForm}
                      onChange={handleEditFormChange}
                      onColorChange={handleEditFormColorChange}
                      onSubmit={(e) => saveCategory(e, category.id)}
                      submitButtonText="Save Changes"
                      isEdit={true}
                    />
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-6 h-6 rounded-full mr-3"
                            style={{ backgroundColor: category.color || '#3B82F6' }}
                          />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {category.incomeOnly ? 'Income Only' : category.expenseOnly ? 'Expense Only' : 'Income & Expense'}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => toggleCategoryExpansion(category.id)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-500"
                            aria-label={expandedCategory === category.id ? 'Collapse category' : 'Expand category'}
                          >
                            {expandedCategory === category.id ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                          <Button 
                            onClick={() => startEditing(category.id)}
                            variant="ghost" 
                            size="sm"
                            className="text-gray-500"
                            aria-label={`Edit ${category.name}`}
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={() => deleteCategory(category.id)}
                            variant="ghost" 
                            size="sm"
                            className="text-red-500"
                            aria-label={`Delete ${category.name}`}
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Subcategories section */}
                      {expandedCategory === category.id && (
                        <div className="mt-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                              Subcategories
                              <Tooltip content="Subcategories help you organize transactions within a category" position="right">
                                <FiInfo className="ml-1 w-4 h-4 text-gray-500" />
                              </Tooltip>
                            </h4>
                            <Button
                              onClick={() => startAddingSubcategory(category.id)}
                              variant="ghost"
                              size="sm"
                              className="text-blue-500"
                            >
                              <FiPlus className="w-4 h-4 mr-1" /> Add Subcategory
                            </Button>
                          </div>
                          
                          {addingSubcategoryFor === category.id && (
                            <SubcategoryForm
                              formData={newSubcategory}
                              onChange={handleNewSubcategoryChange}
                              onColorChange={handleNewSubcategoryColorChange}
                              onSubmit={(e) => handleAddSubcategory(e, category.id)}
                              onCancel={cancelAddingSubcategory}
                              submitButtonText="Add Subcategory"
                            />
                          )}
                          
                          {category.subcategories && category.subcategories.length > 0 ? (
                            <div className="space-y-2 mt-2">
                              {category.subcategories.map(subcategory => (
                                <div 
                                  key={subcategory.id}
                                  className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center justify-between"
                                >
                                  {editingSubcategory && editingSubcategory.subcategoryId === subcategory.id ? (
                                    <SubcategoryForm
                                      formData={editSubcategoryForm}
                                      onChange={handleEditSubcategoryFormChange}
                                      onColorChange={handleEditSubcategoryColorChange}
                                      onSubmit={saveSubcategory}
                                      onCancel={cancelEditingSubcategory}
                                      submitButtonText="Save"
                                      isEdit={true}
                                    />
                                  ) : (
                                    <>
                                      <div className="flex items-center">
                                        <div 
                                          className="w-4 h-4 rounded-full mr-2" 
                                          style={{ backgroundColor: subcategory.color || category.color || '#3B82F6' }}
                                        />
                                        <span className="text-sm">{subcategory.name}</span>
                                      </div>
                                      
                                      <div className="flex space-x-1">
                                        <Button 
                                          onClick={() => startEditingSubcategory(category.id, subcategory.id)}
                                          variant="ghost" 
                                          size="sm"
                                          className="text-gray-500 p-1"
                                          aria-label={`Edit ${subcategory.name}`}
                                        >
                                          <FiEdit2 className="w-3 h-3" />
                                        </Button>
                                        <Button 
                                          onClick={() => deleteSubcategory(category.id, subcategory.id)}
                                          variant="ghost" 
                                          size="sm"
                                          className="text-red-500 p-1"
                                          aria-label={`Delete ${subcategory.name}`}
                                        >
                                          <FiTrash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                              No subcategories yet. Add some to better organize your transactions.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Categories Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create categories to organize your transactions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
