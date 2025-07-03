import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ onSearch, placeholder = "Search recipes...", className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== '') {
        setIsLoading(true);
        onSearch(searchTerm);
        setTimeout(() => setIsLoading(false), 300);
      } else {
        onSearch('');
      }
    }, 300);
    
    return () => clearTimeout(delayedSearch);
  }, [searchTerm, onSearch]);
  
  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };
  
  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={isLoading ? "Loader2" : "Search"}
        iconPosition="left"
        className={isLoading ? "[&>div>div>svg]:animate-spin" : ""}
      />
      {searchTerm && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name="X" className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};

export default SearchBar;