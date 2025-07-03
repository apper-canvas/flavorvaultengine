import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const FilterSidebar = ({ filters, onFiltersChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
  const dietaryRestrictions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb', 'High-Protein'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const cookingTimes = [
    { label: 'Under 30 min', value: '0-30' },
    { label: '30-60 min', value: '30-60' },
    { label: '1-2 hours', value: '60-120' },
    { label: '2+ hours', value: '120+' }
  ];
  
  const handleFilterChange = (category, value) => {
    const currentFilters = filters[category] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(item => item !== value)
      : [...currentFilters, value];
    
    onFiltersChange({
      ...filters,
      [category]: newFilters
    });
  };
  
  const handleClearFilters = () => {
    onFiltersChange({
      mealType: [],
      dietaryRestrictions: [],
      difficulty: [],
      cookingTime: []
    });
  };
  
  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);
  
  const FilterSection = ({ title, options, category, icon }) => (
    <div className="mb-6">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
        <ApperIcon name={icon} className="w-4 h-4" />
        {title}
      </h3>
      <div className="space-y-2">
        {options.map((option) => {
          const value = option.value || option;
          const label = option.label || option;
          const isSelected = filters[category]?.includes(value);
          
          return (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleFilterChange(category, value)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className={`text-sm ${isSelected ? 'text-primary font-medium' : 'text-gray-700'} group-hover:text-primary transition-colors`}>
                {label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
  
  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-semibold text-gray-900">
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="small"
            onClick={handleClearFilters}
            className="text-sm"
          >
            Clear All
          </Button>
        )}
      </div>
      
      <FilterSection 
        title="Meal Type" 
        options={mealTypes} 
        category="mealType" 
        icon="Utensils"
      />
      
      <FilterSection 
        title="Dietary Restrictions" 
        options={dietaryRestrictions} 
        category="dietaryRestrictions" 
        icon="Leaf"
      />
      
      <FilterSection 
        title="Difficulty" 
        options={difficulties} 
        category="difficulty" 
        icon="BarChart3"
      />
      
      <FilterSection 
        title="Cooking Time" 
        options={cookingTimes} 
        category="cookingTime" 
        icon="Clock"
      />
    </div>
  );
  
  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          icon="Filter"
          className="w-full"
        >
          Filters {hasActiveFilters && `(${Object.values(filters).flat().length})`}
        </Button>
      </div>
      
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${className}`}>
        <div className="bg-surface rounded-lg p-6 shadow-card sticky top-4">
          {sidebarContent}
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="bg-white h-full w-80 p-6 shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-semibold text-gray-900">
                Filters
              </h2>
              <Button
                variant="ghost"
                size="small"
                icon="X"
                onClick={() => setIsOpen(false)}
              />
            </div>
            {sidebarContent}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default FilterSidebar;