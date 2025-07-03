import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import { recipeService } from '@/services/api/recipeService';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    imageUrl: '',
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    mealType: [],
    dietaryRestrictions: [],
    ingredients: [{ name: '', amount: 0, unit: '', notes: '' }],
    instructions: [{ stepNumber: 1, text: '', duration: 0 }],
  });
  
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
  const dietaryRestrictions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb', 'High-Protein'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const units = ['cup', 'tbsp', 'tsp', 'oz', 'lb', 'g', 'kg', 'ml', 'l', 'piece', 'clove', 'slice'];
  
  const handleInputChange = (field, value) => {
    setRecipe(prev => ({ ...prev, [field]: value }));
  };
  
  const handleArrayToggle = (field, value) => {
    setRecipe(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };
  
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };
  
  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: 0, unit: '', notes: '' }]
    }));
  };
  
  const removeIngredient = (index) => {
    if (recipe.ingredients.length > 1) {
      setRecipe(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index)
      }));
    }
  };
  
  const handleInstructionChange = (index, field, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = { ...newInstructions[index], [field]: value };
    setRecipe(prev => ({ ...prev, instructions: newInstructions }));
  };
  
  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, { 
        stepNumber: prev.instructions.length + 1, 
        text: '', 
        duration: 0 
      }]
    }));
  };
  
  const removeInstruction = (index) => {
    if (recipe.instructions.length > 1) {
      const newInstructions = recipe.instructions
        .filter((_, i) => i !== index)
        .map((instruction, i) => ({ ...instruction, stepNumber: i + 1 }));
      setRecipe(prev => ({ ...prev, instructions: newInstructions }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!recipe.title.trim()) {
      toast.error('Recipe title is required');
      return;
    }
    
    if (recipe.ingredients.some(ing => !ing.name.trim())) {
      toast.error('All ingredients must have a name');
      return;
    }
    
    if (recipe.instructions.some(inst => !inst.text.trim())) {
      toast.error('All instructions must have text');
      return;
    }
    
    try {
      setLoading(true);
      
      const newRecipe = {
        ...recipe,
        rating: 0,
        reviewCount: 0,
        createdBy: 'user',
        createdAt: new Date().toISOString(),
        imageUrl: recipe.imageUrl || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=300&fit=crop'
      };
      
      const savedRecipe = await recipeService.create(newRecipe);
      toast.success('Recipe created successfully!');
      navigate(`/recipe/${savedRecipe.Id}`);
    } catch (err) {
      toast.error('Error creating recipe');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Create New Recipe
        </h1>
        <p className="text-gray-600">
          Share your culinary creation with the world
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Recipe Title"
                value={recipe.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter recipe title"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={recipe.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your recipe"
                className="input-field resize-none"
                rows="3"
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Image URL"
                value={recipe.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <Input
              label="Prep Time (minutes)"
              type="number"
              value={recipe.prepTime}
              onChange={(e) => handleInputChange('prepTime', parseInt(e.target.value) || 0)}
              min="0"
            />
            
            <Input
              label="Cook Time (minutes)"
              type="number"
              value={recipe.cookTime}
              onChange={(e) => handleInputChange('cookTime', parseInt(e.target.value) || 0)}
              min="0"
            />
            
            <Input
              label="Servings"
              type="number"
              value={recipe.servings}
              onChange={(e) => handleInputChange('servings', parseInt(e.target.value) || 1)}
              min="1"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={recipe.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="input-field"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Categories */}
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
            Categories
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Meal Type
              </label>
              <div className="flex flex-wrap gap-2">
                {mealTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleArrayToggle('mealType', type)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      recipe.mealType.includes(type)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Dietary Restrictions
              </label>
              <div className="flex flex-wrap gap-2">
                {dietaryRestrictions.map(restriction => (
                  <button
                    key={restriction}
                    type="button"
                    onClick={() => handleArrayToggle('dietaryRestrictions', restriction)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      recipe.dietaryRestrictions.includes(restriction)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {restriction}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Ingredients */}
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              Ingredients
            </h2>
            <Button
              type="button"
              variant="outline"
              size="small"
              icon="Plus"
              onClick={addIngredient}
            >
              Add Ingredient
            </Button>
          </div>
          
          <div className="space-y-4">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(index, 'amount', parseFloat(e.target.value) || 0)}
                    step="0.1"
                    min="0"
                  />
                </div>
                
                <div>
                  <select
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Unit</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Notes (optional)"
                    value={ingredient.notes}
                    onChange={(e) => handleIngredientChange(index, 'notes', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    icon="Trash2"
                    onClick={() => removeIngredient(index)}
                    disabled={recipe.ingredients.length === 1}
                    className="text-error hover:text-error"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              Instructions
            </h2>
            <Button
              type="button"
              variant="outline"
              size="small"
              icon="Plus"
              onClick={addInstruction}
            >
              Add Step
            </Button>
          </div>
          
          <div className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                    {instruction.stepNumber}
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Timer duration (minutes, optional)"
                      type="number"
                      value={instruction.duration}
                      onChange={(e) => handleInstructionChange(index, 'duration', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    icon="Trash2"
                    onClick={() => removeInstruction(index)}
                    disabled={recipe.instructions.length === 1}
                    className="text-error hover:text-error"
                  />
                </div>
                
                <textarea
                  value={instruction.text}
                  onChange={(e) => handleInstructionChange(index, 'text', e.target.value)}
                  placeholder="Describe this step in detail..."
                  className="input-field resize-none"
                  rows="3"
                  required
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            icon="Save"
            loading={loading}
            className="flex-1"
          >
            Create Recipe
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateRecipe;