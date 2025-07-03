import { useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/molecules/SearchBar';
import FilterSidebar from '@/components/molecules/FilterSidebar';
import RecipeGrid from '@/components/organisms/RecipeGrid';

const BrowseRecipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    mealType: [],
    dietaryRestrictions: [],
    difficulty: [],
    cookingTime: []
  });
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
          Discover Amazing Recipes
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore our collection of delicious recipes from around the world. 
          Find your next favorite dish and create memorable meals.
        </p>
      </div>
      
      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search recipes, ingredients, or cuisines..."
        />
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
        
        {/* Recipe Grid */}
        <div className="lg:col-span-3">
          <RecipeGrid
            filters={filters}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BrowseRecipes;