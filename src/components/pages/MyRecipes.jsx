import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { savedRecipeService } from '@/services/api/savedRecipeService';
import { recipeService } from '@/services/api/recipeService';

const MyRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadSavedRecipes();
  }, []);
  
  const loadSavedRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const saved = await savedRecipeService.getAll();
      setSavedRecipes(saved);
      
      // Load full recipe details
      const allRecipes = await recipeService.getAll();
      const fullRecipes = saved.map(savedRecipe => {
        const fullRecipe = allRecipes.find(recipe => recipe.Id === savedRecipe.recipeId);
        return { ...fullRecipe, savedAt: savedRecipe.savedAt, savedId: savedRecipe.Id };
      }).filter(Boolean);
      
      setRecipes(fullRecipes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveRecipe = async (savedId) => {
    try {
      await savedRecipeService.delete(savedId);
      setRecipes(prev => prev.filter(recipe => recipe.savedId !== savedId));
      setSavedRecipes(prev => prev.filter(saved => saved.Id !== savedId));
      toast.success('Recipe removed from saved list');
    } catch (err) {
      toast.error('Error removing recipe');
    }
  };
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const filteredRecipes = recipes.filter(recipe => {
    if (!searchTerm) return true;
    return recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadSavedRecipes} />;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            My Saved Recipes
          </h1>
          <p className="text-gray-600 mt-2">
            {recipes.length} saved recipes
          </p>
        </div>
        <Link to="/browse">
          <Button variant="primary" icon="Search">
            Discover More
          </Button>
        </Link>
      </div>
      
      {/* Search */}
      {recipes.length > 0 && (
        <div className="max-w-lg">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search your saved recipes..."
          />
        </div>
      )}
      
      {/* Recipes List */}
      {filteredRecipes.length === 0 && recipes.length === 0 ? (
        <Empty
          title="No saved recipes yet"
          description="Start building your personal recipe collection by saving your favorite recipes!"
          actionText="Browse Recipes"
          actionIcon="Search"
          onAction={() => window.location.href = '/browse'}
        />
      ) : filteredRecipes.length === 0 ? (
        <Empty
          title="No recipes match your search"
          description="Try adjusting your search term to find your saved recipes."
          actionText="Clear Search"
          actionIcon="RefreshCw"
          onAction={() => setSearchTerm('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden group"
            >
              <Link to={`/recipe/${recipe.Id}`} className="block">
                <div className="relative">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-display font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {recipe.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Clock" className="w-4 h-4" />
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Calendar" className="w-4 h-4" />
                      <span>
                        Saved {new Date(recipe.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="small"
                      icon="ExternalLink"
                      className="flex-1"
                    >
                      View Recipe
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      icon="Trash2"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveRecipe(recipe.savedId);
                      }}
                      className="text-error hover:text-error hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyRecipes;