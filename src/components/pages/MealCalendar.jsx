import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { mealPlanService } from '@/services/api/mealPlanService';
import { recipeService } from '@/services/api/recipeService';
import { formatTime } from '@/utils/helpers';

const MealCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedRecipe, setDraggedRecipe] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showRecipePanel, setShowRecipePanel] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [mealPlansData, recipesData] = await Promise.all([
        mealPlanService.getAll(),
        recipeService.getAll()
      ]);
      setMealPlans(mealPlansData);
      setRecipes(recipesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, recipe) => {
    setDraggedRecipe(recipe);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = async (e, date, timeSlot) => {
    e.preventDefault();
    if (!draggedRecipe) return;

    try {
const newMealPlan = {
        recipeId: draggedRecipe.Id,
        date: date.toISOString().split('T')[0],
        timeSlot,
        notes: ''
      };
      
      const created = await mealPlanService.create(newMealPlan);
      setMealPlans(prev => [...prev, created]);
      toast.success(`${draggedRecipe.title} scheduled for ${timeSlot}`);
    } catch (err) {
      toast.error('Failed to schedule meal');
    }
    
    setDraggedRecipe(null);
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await mealPlanService.delete(mealId);
      setMealPlans(prev => prev.filter(meal => meal.Id !== mealId));
      toast.success('Meal removed from calendar');
      setSelectedMeal(null);
    } catch (err) {
      toast.error('Failed to remove meal');
    }
  };

const getMealsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mealPlans.filter(meal => meal.date === dateStr);
  };

  const getRecipeById = (recipeId) => {
    return recipes.find(recipe => recipe.Id === recipeId);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const timeSlots = ['breakfast', 'lunch', 'dinner', 'snack'];

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Recipe Panel */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        showRecipePanel ? 'w-80' : 'w-0 overflow-hidden'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-gray-900">Available Recipes</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRecipePanel(false)}
              icon="X"
            />
          </div>
        </div>
        <div className="p-4 space-y-3 h-full overflow-y-auto">
          {recipes.map(recipe => (
            <div
              key={recipe.Id}
              draggable
              onDragStart={(e) => handleDragStart(e, recipe)}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {recipe.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <ApperIcon name="Clock" className="w-3 h-3" />
                    <span>{formatTime(recipe.prepTime + recipe.cookTime)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Meal Calendar
              </h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth(-1)}
                  icon="ChevronLeft"
                />
                <span className="font-medium text-gray-900 min-w-[120px] text-center">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth(1)}
                  icon="ChevronRight"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showRecipePanel ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setShowRecipePanel(!showRecipePanel)}
                icon="Book"
              >
                Recipes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {generateCalendarDays().map((day, index) => {
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = day.toDateString() === new Date().toDateString();
                const dayMeals = getMealsForDate(day);

                return (
                  <div
                    key={index}
                    className={`border-r border-b border-gray-200 last:border-r-0 min-h-[120px] p-2 ${
                      !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, 'breakfast')}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      isToday ? 'text-primary' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {day.getDate()}
                    </div>
                    
                    {/* Meal Slots */}
                    <div className="space-y-1">
{timeSlots.map(slot => {
                        const slotMeals = dayMeals.filter(meal => meal.timeSlot === slot);
                        return (
                          <div
                            key={slot}
                            className="min-h-[20px] rounded p-1 border border-dashed border-gray-200 hover:border-primary/50 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, day, slot)}
                          >
                            {slotMeals.map(meal => {
                              const recipe = getRecipeById(meal.recipeId);
                              if (!recipe) return null;
                              
                              return (
                                <div
                                  key={meal.Id}
                                  onClick={() => setSelectedMeal(meal)}
                                  className="text-xs bg-primary/10 text-primary p-1 rounded cursor-pointer hover:bg-primary/20 transition-colors truncate"
                                  title={`${slot}: ${recipe.title}`}
                                >
                                  {recipe.title}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-semibold text-gray-900">
                  Scheduled Meal
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMeal(null)}
                  icon="X"
                />
              </div>
              
              {(() => {
const recipe = getRecipeById(selectedMeal.recipeId);
                if (!recipe) return <div>Recipe not found</div>;
                return (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
<h4 className="font-medium text-gray-900">{recipe.title}</h4>
                        <p className="text-sm text-gray-600 capitalize">{selectedMeal.timeSlot}</p>
                        <p className="text-sm text-gray-600">{selectedMeal.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      <Button
                        variant="error"
                        size="sm"
                        onClick={() => handleDeleteMeal(selectedMeal.Id)}
                        icon="Trash2"
                      >
                        Remove
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMeal(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MealCalendar;