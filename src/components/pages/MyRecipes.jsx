import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import { savedRecipeService } from "@/services/api/savedRecipeService";
import { recipeService } from "@/services/api/recipeService";

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
{/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            My Recipe Collection
          </h1>
          <p className="text-gray-600 mt-2">
            {recipes.length} saved recipes
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon="FolderPlus">
            New Folder
          </Button>
          <Link to="/browse">
            <Button variant="primary" icon="Search">
              Discover More
            </Button>
          </Link>
        </div>
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
      
      {/* Recipe Collection Manager */}
      <div className="bg-surface rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-gray-900">
            Recipe Collection
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ApperIcon name="Folder" className="w-4 h-4" />
            <span>Organize your recipes into folders</span>
          </div>
        </div>
        
        {filteredRecipes.length === 0 && recipes.length === 0 ? (
          <Empty
            title="No saved recipes yet"
            description="Start building your personal recipe collection by saving your favorite recipes!"
            actionText="Browse Recipes"
            actionIcon="Search"
            onAction={() => window.location.href = '/browse'}
          />
        ) : (
          <div className="space-y-6">
            {/* Collection view will be implemented here */}
            <div className="text-center py-8 text-gray-500">
              Recipe folder organization interface coming soon...
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

export default MyRecipes;