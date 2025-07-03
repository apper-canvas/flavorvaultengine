import { motion } from 'framer-motion';

const Loading = ({ type = 'recipes' }) => {
  const renderRecipeCardSkeleton = () => (
    <div className="card p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-48 animate-pulse"></div>
      <div className="p-6">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-3 animate-pulse"></div>
        <div className="flex items-center gap-4 mb-3">
          <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
          <div className="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
        </div>
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 animate-pulse"></div>
        <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  );

  const renderRecipeDetailSkeleton = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-80 rounded-lg mb-8 animate-pulse"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 animate-pulse"></div>
          <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        <div>
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="animate-fade-in"
    >
      {type === 'recipes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {renderRecipeCardSkeleton()}
            </motion.div>
          ))}
        </div>
      )}
      {type === 'recipe-detail' && renderRecipeDetailSkeleton()}
      {type === 'list' && renderListSkeleton()}
    </motion.div>
  );
};

export default Loading;