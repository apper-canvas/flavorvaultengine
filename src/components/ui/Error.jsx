import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 max-w-md text-center shadow-lg">
        <div className="bg-gradient-to-r from-error to-orange-500 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">
          {message || "We encountered an issue while loading your recipes. Please try again."}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Error;