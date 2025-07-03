import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import RecipeCard from '@/components/molecules/RecipeCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { recipeService } from '@/services/api/recipeService';
import { savedRecipeService } from '@/services/api/savedRecipeService';
import { groceryService } from '@/services/api/groceryService';

const RecipeGrid = ({ filters, searchTerm }) => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadRecipes();
    loadSavedRecipes();
  }, []);
  
  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recipeService.getAll();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const loadSavedRecipes = async () => {
    try {
      const data = await savedRecipeService.getAll();
      setSavedRecipes(data);
    } catch (err) {
      console.error('Error loading saved recipes:', err);
    }
  };
  
  const handleSaveRecipe = async (recipe) => {
    try {
      const isAlreadySaved = savedRecipes.some(saved => saved.recipeId === recipe.Id);
      
      if (isAlreadySaved) {
        const savedRecipe = savedRecipes.find(saved => saved.recipeId === recipe.Id);
        await savedRecipeService.delete(savedRecipe.Id);
        setSavedRecipes(prev => prev.filter(saved => saved.recipeId !== recipe.Id));
        toast.success('Recipe removed from saved list');
      } else {
        const savedRecipe = await savedRecipeService.create({
          recipeId: recipe.Id,
          title: recipe.title,
          imageUrl: recipe.imageUrl,
          savedAt: new Date().toISOString()
        });
        setSavedRecipes(prev => [...prev, savedRecipe]);
        toast.success('Recipe saved successfully!');
      }
    } catch (err) {
      toast.error('Error saving recipe');
    }
  };
  
  const handleAddToGroceryList = async (recipe) => {
    try {
      for (const ingredient of recipe.ingredients) {
        await groceryService.create({
          ingredient: ingredient.name,
          quantity: ingredient.amount,
          unit: ingredient.unit,
          recipeIds: [recipe.Id],
          checked: false
        });
      }
      toast.success('Ingredients added to grocery list!');
    } catch (err) {
      toast.error('Error adding ingredients to grocery list');
    }
  };
  
  const filteredRecipes = recipes.filter(recipe => {
    // Search filter
    if (searchTerm && !recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Meal type filter
    if (filters.mealType?.length > 0 && !filters.mealType.some(type => recipe.mealType.includes(type))) {
      return false;
    }
    
    // Dietary restrictions filter
    if (filters.dietaryRestrictions?.length > 0 && 
        !filters.dietaryRestrictions.some(restriction => recipe.dietaryRestrictions.includes(restriction))) {
      return false;
    }
    
    // Difficulty filter
    if (filters.difficulty?.length > 0 && !filters.difficulty.includes(recipe.difficulty)) {
      return false;
    }
    
    // Cooking time filter
    if (filters.cookingTime?.length > 0) {
      const totalTime = recipe.prepTime + recipe.cookTime;
      const matchesTime = filters.cookingTime.some(timeRange => {
        switch (timeRange) {
          case '0-30': return totalTime <= 30;
          case '30-60': return totalTime > 30 && totalTime <= 60;
          case '60-120': return totalTime > 60 && totalTime <= 120;
          case '120+': return totalTime > 120;
          default: return true;
        }
      });
      if (!matchesTime) return false;
    }
    
    return true;
  });
  
  if (loading) return <Loading type="recipes" />;
  if (error) return <Error message={error} onRetry={loadRecipes} />;
  if (filteredRecipes.length === 0) {
    return (
      <Empty
        title="No recipes found"
        description="Try adjusting your filters or search terms to find more recipes."
        actionText="Clear Filters"
        actionIcon="RefreshCw"
        onAction={() => window.location.reload()}
      />
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {filteredRecipes.map((recipe, index) => (
        <motion.div
          key={recipe.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <RecipeCard
            recipe={recipe}
            onSave={handleSaveRecipe}
            onAddToGroceryList={handleAddToGroceryList}
            isSaved={savedRecipes.some(saved => saved.recipeId === recipe.Id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default RecipeGrid;