import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const IngredientList = ({ ingredients, onAddToGroceryList, showAddButton = true }) => {
  const handleAddAllToGroceryList = () => {
    if (onAddToGroceryList) {
      onAddToGroceryList(ingredients);
    }
  };
  
  return (
    <div className="bg-surface rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold text-gray-900">
          Ingredients
        </h3>
        {showAddButton && (
          <Button
            variant="outline"
            size="small"
            icon="ShoppingCart"
            onClick={handleAddAllToGroceryList}
          >
            Add All
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <ApperIcon name="Dot" className="w-2 h-2 text-primary" />
              <span className="font-medium text-gray-900">
                {ingredient.amount} {ingredient.unit}
              </span>
              <span className="text-gray-700">
                {ingredient.name}
              </span>
            </div>
            {ingredient.notes && (
              <span className="text-sm text-gray-500 italic">
                {ingredient.notes}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IngredientList;