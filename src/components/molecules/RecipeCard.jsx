import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Rating from '@/components/atoms/Rating';
import Button from '@/components/atoms/Button';
import { formatTime } from '@/utils/helpers';

const RecipeCard = ({ recipe, onSave, onAddToGroceryList, isSaved = false }) => {
  const {
    Id,
    title,
    description,
    imageUrl,
    prepTime,
    cookTime,
    servings,
    difficulty,
    mealType,
    dietaryRestrictions,
    rating,
    reviewCount
  } = recipe;
  
  const totalTime = prepTime + cookTime;
  
  const difficultyColors = {
    'Easy': 'success',
    'Medium': 'warning',
    'Hard': 'error'
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSave(recipe);
  };
  
  const handleAddToGroceryList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToGroceryList(recipe);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card overflow-hidden group"
    >
      <Link to={`/recipe/${Id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {mealType.map((type) => (
              <Badge key={type} variant="primary" size="small">
                {type}
              </Badge>
            ))}
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant={difficultyColors[difficulty]} size="small">
              {difficulty}
            </Badge>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-display font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" className="w-4 h-4" />
              <span>{formatTime(totalTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Users" className="w-4 h-4" />
              <span>{servings} servings</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Rating rating={rating} size="small" />
              <span className="text-sm text-gray-500">({reviewCount})</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {dietaryRestrictions.map((restriction) => (
              <Badge key={restriction} variant="outline" size="small">
                {restriction}
              </Badge>
            ))}
          </div>
          
<div className="flex gap-2">
            <Button
              variant="ghost"
              size="small"
              icon={isSaved ? "BookmarkCheck" : "Bookmark"}
              onClick={handleSave}
              className="flex-1"
            >
              {isSaved ? "Saved" : "Save"}
            </Button>
            <Button
              variant="ghost"
              size="small"
              icon="ShoppingCart"
              onClick={handleAddToGroceryList}
              className="flex-1"
            >
              Add to List
            </Button>
          </div>
          
          {/* Folder selector for saved recipes */}
          {isSaved && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ApperIcon name="Folder" className="w-4 h-4" />
                <span>Move to folder</span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;