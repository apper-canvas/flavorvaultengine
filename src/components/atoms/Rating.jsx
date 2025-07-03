import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Rating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 'medium', 
  interactive = false, 
  onRatingChange,
  className = '' 
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };
  
  const handleRatingClick = (newRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= rating;
        const isHalfFilled = starRating - 0.5 <= rating && starRating > rating;
        
        return (
          <motion.button
            key={index}
            whileHover={interactive ? { scale: 1.1 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            onClick={() => handleRatingClick(starRating)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
          >
            <ApperIcon
              name={isFilled || isHalfFilled ? 'Star' : 'Star'}
              className={`${sizes[size]} ${
                isFilled 
                  ? 'text-yellow-400 fill-current' 
                  : isHalfFilled 
                  ? 'text-yellow-400 fill-current opacity-50' 
                  : 'text-gray-300'
              } transition-colors duration-200`}
            />
          </motion.button>
        );
      })}
    </div>
  );
};

export default Rating;