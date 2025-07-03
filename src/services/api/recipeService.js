import recipesData from '@/services/mockData/recipes.json';

class RecipeService {
  constructor() {
    this.recipes = [...recipesData];
  }
  
  async getAll() {
    await this.delay(300);
    return [...this.recipes];
  }
  
  async getById(id) {
    await this.delay(200);
    const recipe = this.recipes.find(r => r.Id === id);
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    return { ...recipe };
  }
  
  async create(recipe) {
    await this.delay(400);
    const newRecipe = {
      ...recipe,
      Id: Math.max(...this.recipes.map(r => r.Id), 0) + 1,
    };
    this.recipes.push(newRecipe);
    return { ...newRecipe };
  }
  
  async update(id, updates) {
    await this.delay(300);
    const index = this.recipes.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Recipe not found');
    }
    this.recipes[index] = { ...this.recipes[index], ...updates };
    return { ...this.recipes[index] };
  }
  
  async delete(id) {
    await this.delay(200);
    const index = this.recipes.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Recipe not found');
    }
    this.recipes.splice(index, 1);
    return true;
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const recipeService = new RecipeService();