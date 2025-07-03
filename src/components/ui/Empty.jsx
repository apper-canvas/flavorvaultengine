import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No recipes found", 
  description = "Start exploring our delicious collection of recipes!", 
  actionText = "Browse Recipes",
  actionIcon = "ChefHat",
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="bg-gradient-surface rounded-xl p-8 max-w-md text-center shadow-card">
        <div className="bg-gradient-primary rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <ApperIcon name={actionIcon} className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>
        {onAction && (
          <button
            onClick={onAction}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ApperIcon name={actionIcon} className="w-4 h-4" />
            {actionText}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;