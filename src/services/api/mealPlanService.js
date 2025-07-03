import mealsData from '@/services/mockData/meals.json';

class MealPlanService {
  constructor() {
    this.mealPlans = [...mealsData];
    this.nextId = Math.max(...this.mealPlans.map(m => m.Id), 0) + 1;
  }
  
  async getAll() {
    await this.delay(300);
    return [...this.mealPlans];
  }
  
  async getById(id) {
    if (!Number.isInteger(id)) {
      throw new Error('Invalid ID: must be an integer');
    }
    await this.delay(200);
    const mealPlan = this.mealPlans.find(m => m.Id === id);
    if (!mealPlan) {
      throw new Error('Meal plan not found');
    }
    return { ...mealPlan };
  }
  
  async create(mealPlan) {
    await this.delay(400);
    const newMealPlan = {
      ...mealPlan,
      Id: this.nextId++,
      createdAt: new Date().toISOString()
    };
    this.mealPlans.push(newMealPlan);
    return { ...newMealPlan };
  }
  
  async update(id, updates) {
    if (!Number.isInteger(id)) {
      throw new Error('Invalid ID: must be an integer');
    }
    await this.delay(300);
    const index = this.mealPlans.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error('Meal plan not found');
    }
    this.mealPlans[index] = { ...this.mealPlans[index], ...updates };
    return { ...this.mealPlans[index] };
  }
  
  async delete(id) {
    if (!Number.isInteger(id)) {
      throw new Error('Invalid ID: must be an integer');
    }
    await this.delay(200);
    const index = this.mealPlans.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error('Meal plan not found');
    }
    this.mealPlans.splice(index, 1);
    return true;
  }
  
  async getByDateRange(startDate, endDate) {
    await this.delay(250);
    return this.mealPlans.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate >= new Date(startDate) && mealDate <= new Date(endDate);
    });
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mealPlanService = new MealPlanService();