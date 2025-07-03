import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
const navItems = [
    { name: 'Browse Recipes', path: '/browse', icon: 'Search' },
    { name: 'My Recipes', path: '/my-recipes', icon: 'BookOpen' },
    { name: 'Meal Calendar', path: '/meal-calendar', icon: 'Calendar' },
    { name: 'Grocery List', path: '/grocery-list', icon: 'ShoppingCart' },
    { name: 'Create Recipe', path: '/create-recipe', icon: 'Plus' },
  ];
  
  const isActivePath = (path) => {
    if (path === '/browse') {
      return location.pathname === '/' || location.pathname === '/browse';
    }
    return location.pathname === path;
  };
  
  return (
    <header className="bg-gradient-to-r from-primary to-secondary shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white rounded-lg p-2">
              <ApperIcon name="ChefHat" className="w-8 h-8 text-primary" />
            </div>
            <span className="text-2xl font-display font-bold text-white">
              FlavorVault
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActivePath(item.path)
                    ? 'bg-white text-primary shadow-md'
                    : 'text-white hover:bg-white/10 hover:text-white'
                }`}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <ApperIcon name={isMobileMenuOpen ? 'X' : 'Menu'} className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-gray-200 shadow-lg"
        >
          <nav className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActivePath(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;