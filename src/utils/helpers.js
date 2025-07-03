export const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${remainingMinutes} min`;
    }
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getDietaryBadgeColor = (restriction) => {
  const colorMap = {
    'Vegetarian': 'success',
    'Vegan': 'success',
    'Gluten-Free': 'info',
    'Dairy-Free': 'info',
    'Keto': 'warning',
    'Low-Carb': 'warning',
    'High-Protein': 'secondary'
  };
  return colorMap[restriction] || 'neutral';
};

export const getMealTypeColor = (mealType) => {
  const colorMap = {
    'Breakfast': 'warning',
    'Lunch': 'info',
    'Dinner': 'primary',
    'Snack': 'secondary',
    'Dessert': 'error'
  };
  return colorMap[mealType] || 'neutral';
};

export const calculateTotalTime = (prepTime, cookTime) => {
  return prepTime + cookTime;
};

export const pluralize = (count, singular, plural) => {
  return count === 1 ? singular : plural || `${singular}s`;
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};