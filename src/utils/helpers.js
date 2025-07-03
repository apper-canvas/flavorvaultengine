import { 
  format, 
  parseISO, 
  isValid, 
  isToday as fnsIsToday, 
  isYesterday as fnsIsYesterday, 
  isTomorrow as fnsIsTomorrow,
  formatDistanceToNow,
  addDays as fnsAddDays,
  subDays as fnsSubDays,
  startOfDay as fnsStartOfDay,
  endOfDay as fnsEndOfDay,
  parse
} from 'date-fns';
import React from "react";

// Utility functions for the FlavorVault application

// Date validation and parsing functions
export const isValidDate = (date) => {
  if (!date) return false;
  if (date instanceof Date) return isValid(date);
  if (typeof date === 'string') {
    const parsed = parseISO(date);
    return isValid(parsed);
  }
  return false;
};

export const parseDate = (dateInput) => {
  if (!dateInput) return new Date();
  
  try {
    if (dateInput instanceof Date) {
      return isValid(dateInput) ? dateInput : new Date();
    }
    
    if (typeof dateInput === 'string') {
      const parsed = parseISO(dateInput);
      return isValid(parsed) ? parsed : new Date();
    }
    
    return new Date();
  } catch (error) {
    console.error('Date parsing error:', error);
    return new Date();
  }
};

export const safeDateParse = (dateValue, fallback = null) => {
  try {
    if (!dateValue) return fallback;
    
    // Handle various date formats
    if (typeof dateValue === 'string') {
      // Try ISO format first
      let parsed = parseISO(dateValue);
      if (isValid(parsed)) return parsed;
      
      // Try common formats
      const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd HH:mm:ss'];
      for (const formatStr of formats) {
        try {
          parsed = parse(dateValue, formatStr, new Date());
          if (isValid(parsed)) return parsed;
        } catch (e) {
          continue;
        }
      }
    }
    
    if (dateValue instanceof Date) {
      return isValid(dateValue) ? dateValue : fallback;
    }
    
    return fallback;
  } catch (error) {
    handleDateError('safeDateParse', error, dateValue);
    return fallback;
  }
};

// Date formatting functions
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  try {
    const validDate = safeDateParse(date);
    if (!validDate) return 'Invalid Date';
    return format(validDate, formatString);
  } catch (error) {
    handleDateError('formatDate', error, date);
    return 'Invalid Date';
  }
};

export const formatDateTime = (date, formatString = 'MMM dd, yyyy h:mm a') => {
  try {
    const validDate = safeDateParse(date);
    if (!validDate) return 'Invalid Date';
    return format(validDate, formatString);
  } catch (error) {
    handleDateError('formatDateTime', error, date);
    return 'Invalid Date';
  }
};

export const formatRelativeTime = (date) => {
  try {
    const validDate = safeDateParse(date);
    if (!validDate) return 'Unknown time';
    return formatDistanceToNow(validDate, { addSuffix: true });
  } catch (error) {
    handleDateError('formatRelativeTime', error, date);
    return 'Unknown time';
  }
};

export const formatDateForInput = (date) => {
  try {
    const validDate = safeDateParse(date);
    if (!validDate) return '';
    return format(validDate, 'yyyy-MM-dd');
  } catch (error) {
    handleDateError('formatDateForInput', error, date);
    return '';
  }
};

export const formatDateForDisplay = (date) => {
  try {
    const validDate = safeDateParse(date);
    if (!validDate) return 'No date';
    return format(validDate, 'EEEE, MMMM do, yyyy');
  } catch (error) {
    handleDateError('formatDateForDisplay', error, date);
    return 'No date';
  }
};

// Date utility functions
export const isToday = (date) => {
  try {
    const validDate = safeDateParse(date);
    return validDate ? fnsIsToday(validDate) : false;
  } catch (error) {
    handleDateError('isToday', error, date);
    return false;
  }
};

export const isYesterday = (date) => {
  try {
    const validDate = safeDateParse(date);
    return validDate ? fnsIsYesterday(validDate) : false;
  } catch (error) {
    handleDateError('isYesterday', error, date);
    return false;
  }
};

export const isTomorrow = (date) => {
  try {
    const validDate = safeDateParse(date);
    return validDate ? fnsIsTomorrow(validDate) : false;
  } catch (error) {
    handleDateError('isTomorrow', error, date);
    return false;
  }
};

export const getDateRange = (startDate, endDate) => {
  try {
    const validStartDate = safeDateParse(startDate, new Date());
    const validEndDate = safeDateParse(endDate, new Date());
    return { start: validStartDate, end: validEndDate };
  } catch (error) {
    handleDateError('getDateRange', error, { startDate, endDate });
    return { start: new Date(), end: new Date() };
  }
};

export const addDays = (date, days) => {
  try {
    const validDate = safeDateParse(date, new Date());
    return fnsAddDays(validDate, days);
  } catch (error) {
    handleDateError('addDays', error, { date, days });
    return new Date();
  }
};

export const subtractDays = (date, days) => {
  try {
    const validDate = safeDateParse(date, new Date());
    return fnsSubDays(validDate, days);
  } catch (error) {
    handleDateError('subtractDays', error, { date, days });
    return new Date();
  }
};

export const startOfDay = (date) => {
  try {
    const validDate = safeDateParse(date, new Date());
    return fnsStartOfDay(validDate);
  } catch (error) {
    handleDateError('startOfDay', error, date);
    return new Date();
  }
};

export const endOfDay = (date) => {
  try {
    const validDate = safeDateParse(date, new Date());
    return fnsEndOfDay(validDate);
  } catch (error) {
    handleDateError('endOfDay', error, date);
    return new Date();
  }
};

// Database date field handling
export const formatDateTimeField = (dateValue) => {
  try {
    if (!dateValue) return null;
    const validDate = safeDateParse(dateValue);
    return validDate ? format(validDate, "yyyy-MM-dd'T'HH:mm:ss") : null;
  } catch (error) {
    handleDateError('formatDateTimeField', error, dateValue);
    return null;
  }
};

export const prepareDateForAPI = (dateValue) => {
  try {
    if (!dateValue) return null;
    const validDate = safeDateParse(dateValue);
    return validDate ? validDate.toISOString() : null;
  } catch (error) {
    handleDateError('prepareDateForAPI', error, dateValue);
    return null;
  }
};

export const sanitizeDateFields = (data) => {
  try {
    const sanitized = { ...data };
    const dateFields = ['CreatedOn', 'ModifiedOn', 'created_at', 'saved_at', 'date'];
    
    dateFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = prepareDateForAPI(sanitized[field]);
      }
    });
    
    return sanitized;
  } catch (error) {
    handleDateError('sanitizeDateFields', error, data);
    return data;
  }
};

// Error handling for date operations
export const handleDateError = (functionName, error, input) => {
  console.error(`Date error in ${functionName}:`, error);
  console.error(`Input was:`, input);
  logDateError(functionName, error, input);
};

export const logDateError = (functionName, error, input) => {
  // Log to external service if needed
  // For now, just console logging
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Date handling warning in ${functionName}`, {
      error: error.message,
      input: input,
      timestamp: new Date().toISOString()
    });
  }
};

// Format time in minutes to hours and minutes display
export const formatTime = (minutes) => {
  if (!minutes || minutes <= 0) return '0 min';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes} min`;
  } else if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
  }
};

// Format difficulty level with proper capitalization
export const formatDifficulty = (difficulty) => {
  if (!difficulty) return 'Unknown';
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
};

// Generate initials from a name
export const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// Get color variant for dietary restrictions
export const getDietaryRestrictionColor = (restriction) => {
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
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};