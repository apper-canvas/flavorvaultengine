import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { formatTime } from "@/utils/helpers";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Rating from "@/components/atoms/Rating";
import Button from "@/components/atoms/Button";
import RecipeCard from "@/components/molecules/RecipeCard";
import ReviewSection from "@/components/molecules/ReviewSection";
import IngredientList from "@/components/molecules/IngredientList";
import InstructionsList from "@/components/molecules/InstructionsList";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { recipeService } from "@/services/api/recipeService";
import { groceryService } from "@/services/api/groceryService";
import { savedRecipeService } from "@/services/api/savedRecipeService";
import reviewService from "@/services/api/reviewService";
const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    loadRecipe();
    loadReviews();
    checkIfSaved();
  }, [id]);
  
  const loadRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recipeService.getById(parseInt(id));
      setRecipe(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const loadReviews = async () => {
    try {
      const data = await reviewService.getByRecipeId(parseInt(id));
      setReviews(data);
    } catch (err) {
      console.error('Error loading reviews:', err);
    }
  };
  
  const checkIfSaved = async () => {
    try {
      const savedRecipes = await savedRecipeService.getAll();
      setIsSaved(savedRecipes.some(saved => saved.recipeId === parseInt(id)));
    } catch (err) {
      console.error('Error checking saved status:', err);
    }
  };
  
  const handleSaveRecipe = async () => {
    try {
      if (isSaved) {
        const savedRecipes = await savedRecipeService.getAll();
        const savedRecipe = savedRecipes.find(saved => saved.recipeId === parseInt(id));
        await savedRecipeService.delete(savedRecipe.Id);
        setIsSaved(false);
        toast.success('Recipe removed from saved list');
      } else {
        await savedRecipeService.create({
          recipeId: parseInt(id),
          title: recipe.title,
          imageUrl: recipe.imageUrl,
          savedAt: new Date().toISOString()
        });
        setIsSaved(true);
        toast.success('Recipe saved successfully!');
      }
    } catch (err) {
      toast.error('Error saving recipe');
    }
  };
  
  const handleAddToGroceryList = async (ingredients) => {
    try {
      for (const ingredient of ingredients) {
        await groceryService.create({
          ingredient: ingredient.name,
          quantity: ingredient.amount,
          unit: ingredient.unit,
          recipeIds: [parseInt(id)],
          checked: false
        });
      }
      toast.success('Ingredients added to grocery list!');
    } catch (err) {
      toast.error('Error adding ingredients to grocery list');
    }
  };
  
  const handleAddReview = async (reviewData) => {
    try {
      const newReview = await reviewService.create({
        recipeId: parseInt(id),
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date().toISOString()
      });
      setReviews(prev => [newReview, ...prev]);
      toast.success('Review added successfully!');
    } catch (err) {
      toast.error('Error adding review');
    }
  };
  
  if (loading) return <Loading type="recipe-detail" />;
  if (error) return <Error message={error} onRetry={loadRecipe} />;
  if (!recipe) return <Error message="Recipe not found" />;
  
  const totalTime = recipe.prepTime + recipe.cookTime;
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  const difficultyColors = {
    'Easy': 'success',
    'Medium': 'warning',
    'Hard': 'error'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        icon="ArrowLeft"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Back to Recipes
      </Button>
      
      {/* Hero Section */}
<div className="relative overflow-hidden rounded-xl">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.mealType.map((type) => (
              <Badge key={type} variant="primary" size="medium">
                {type}
              </Badge>
            ))}
            <Badge variant={difficultyColors[recipe.difficulty]} size="medium">
              {recipe.difficulty}
            </Badge>
          </div>
          <h1 className="text-4xl font-display font-bold mb-2">
            {recipe.title}
          </h1>
          <p className="text-xl opacity-90 mb-4">
            {recipe.description}
          </p>
          <div className="flex items-center gap-2">
            <Rating rating={averageRating} size="medium" />
            <span className="text-white/80">
              {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'} ({reviews.length} reviews)
            </span>
          </div>
        </div>
      </div>
      
      {/* Recipe Info & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-lg p-6 shadow-card">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="bg-primary/10 rounded-lg p-3 mb-2">
                  <ApperIcon name="Clock" className="w-6 h-6 text-primary mx-auto" />
                </div>
                <div className="text-sm text-gray-500">Prep Time</div>
                <div className="font-semibold">{formatTime(recipe.prepTime)}</div>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-lg p-3 mb-2">
                  <ApperIcon name="ChefHat" className="w-6 h-6 text-primary mx-auto" />
                </div>
                <div className="text-sm text-gray-500">Cook Time</div>
                <div className="font-semibold">{formatTime(recipe.cookTime)}</div>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-lg p-3 mb-2">
                  <ApperIcon name="Users" className="w-6 h-6 text-primary mx-auto" />
                </div>
                <div className="text-sm text-gray-500">Servings</div>
                <div className="font-semibold">{recipe.servings}</div>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-lg p-3 mb-2">
                  <ApperIcon name="Timer" className="w-6 h-6 text-primary mx-auto" />
                </div>
                <div className="text-sm text-gray-500">Total Time</div>
                <div className="font-semibold">{formatTime(totalTime)}</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {recipe.dietaryRestrictions.map((restriction) => (
                <Badge key={restriction} variant="outline" size="medium">
                  {restriction}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button
                variant={isSaved ? "success" : "outline"}
                icon={isSaved ? "BookmarkCheck" : "Bookmark"}
                onClick={handleSaveRecipe}
                className="flex-1"
              >
                {isSaved ? "Saved" : "Save Recipe"}
</Button>
              <Button
                variant="outline"
                icon="Share"
                onClick={async () => {
                  const url = window.location.href;
                  
                  // Try modern Clipboard API first
                  if (navigator.clipboard) {
                    try {
                      await navigator.clipboard.writeText(url);
                      toast.success('Recipe link copied to clipboard!');
                      return;
                    } catch (err) {
                      console.warn('Clipboard API failed, trying fallback:', err);
                    }
                  }
                  
                  // Fallback method for older browsers or when clipboard access is denied
                  try {
                    const textArea = document.createElement('textarea');
                    textArea.value = url;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    if (successful) {
                      toast.success('Recipe link copied to clipboard!');
                    } else {
                      throw new Error('Copy command failed');
                    }
                  } catch (err) {
                    console.error('All clipboard methods failed:', err);
                    toast.error('Unable to copy link. Please copy the URL manually.');
                  }
                }}
                className="flex-1"
              >
                Share
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <IngredientList
            ingredients={recipe.ingredients}
            onAddToGroceryList={handleAddToGroceryList}
          />
        </div>
      </div>
      
      {/* Instructions */}
      <InstructionsList instructions={recipe.instructions} />
      
      {/* Reviews */}
      <ReviewSection
        reviews={reviews}
        averageRating={averageRating}
        onAddReview={handleAddReview}
      />
    </motion.div>
  );
};

export default RecipeDetail;