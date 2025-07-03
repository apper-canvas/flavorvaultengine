import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { groceryService } from '@/services/api/groceryService';

const GroceryList = () => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadGroceryItems();
  }, []);
  
  const loadGroceryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await groceryService.getAll();
      setGroceryItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleItem = async (itemId, checked) => {
    try {
      const updatedItem = await groceryService.update(itemId, { checked: !checked });
      setGroceryItems(prev => 
        prev.map(item => item.Id === itemId ? updatedItem : item)
      );
    } catch (err) {
      toast.error('Error updating item');
    }
  };
  
  const handleDeleteItem = async (itemId) => {
    try {
      await groceryService.delete(itemId);
      setGroceryItems(prev => prev.filter(item => item.Id !== itemId));
      toast.success('Item removed from grocery list');
    } catch (err) {
      toast.error('Error removing item');
    }
  };
  
  const handleClearCompleted = async () => {
    try {
      const completedItems = groceryItems.filter(item => item.checked);
      for (const item of completedItems) {
        await groceryService.delete(item.Id);
      }
      setGroceryItems(prev => prev.filter(item => !item.checked));
      toast.success('Completed items cleared');
    } catch (err) {
      toast.error('Error clearing completed items');
    }
  };
  
  const handleClearAll = async () => {
    try {
      for (const item of groceryItems) {
        await groceryService.delete(item.Id);
      }
      setGroceryItems([]);
      toast.success('Grocery list cleared');
    } catch (err) {
      toast.error('Error clearing grocery list');
    }
  };
  
  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadGroceryItems} />;
  
  const completedCount = groceryItems.filter(item => item.checked).length;
  const totalCount = groceryItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  // Group items by category (using first letter as simple grouping)
  const groupedItems = groceryItems.reduce((groups, item) => {
    const key = item.ingredient.charAt(0).toUpperCase();
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Grocery List
          </h1>
          <p className="text-gray-600 mt-2">
            {completedCount} of {totalCount} items completed
          </p>
        </div>
        {totalCount > 0 && (
          <div className="flex gap-2">
            {completedCount > 0 && (
              <Button
                variant="outline"
                size="small"
                icon="CheckCheck"
                onClick={handleClearCompleted}
              >
                Clear Completed
              </Button>
            )}
            <Button
              variant="outline"
              size="small"
              icon="Trash2"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Shopping Progress
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-primary h-3 rounded-full"
            />
          </div>
        </div>
      )}
      
      {/* Grocery Items */}
      {totalCount === 0 ? (
        <Empty
          title="Your grocery list is empty"
          description="Add ingredients from your favorite recipes to start building your shopping list!"
          actionText="Browse Recipes"
          actionIcon="Search"
          onAction={() => window.location.href = '/browse'}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, items]) => (
              <div key={letter} className="bg-surface rounded-lg p-6 shadow-card">
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                  {letter}
                </h3>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-3 rounded-lg border-2 transition-all ${
                        item.checked 
                          ? 'border-success bg-green-50' 
                          : 'border-gray-200 bg-white hover:border-primary/20'
                      }`}
                    >
                      <button
                        onClick={() => handleToggleItem(item.Id, item.checked)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          item.checked 
                            ? 'bg-success border-success text-white' 
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        {item.checked && <ApperIcon name="Check" className="w-4 h-4" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className={`font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.quantity} {item.unit} {item.ingredient}
                        </div>
                        {item.recipeIds && item.recipeIds.length > 0 && (
                          <div className="text-sm text-gray-500 mt-1">
                            For {item.recipeIds.length} recipe{item.recipeIds.length > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleDeleteItem(item.Id)}
                        className="text-gray-400 hover:text-error transition-colors p-1"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </motion.div>
  );
};

export default GroceryList;