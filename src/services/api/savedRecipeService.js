import savedRecipesData from '@/services/mockData/savedRecipes.json';

class SavedRecipeService {
  constructor() {
    this.savedRecipes = [...savedRecipesData];
  }
  
  async getAll() {
    await this.delay(200);
    return [...this.savedRecipes];
  }
  
  async getById(id) {
    await this.delay(200);
    const savedRecipe = this.savedRecipes.find(r => r.Id === id);
    if (!savedRecipe) {
      throw new Error('Saved recipe not found');
    }
    return { ...savedRecipe };
  }
  
  async create(savedRecipe) {
    await this.delay(300);
    const newSavedRecipe = {
      ...savedRecipe,
      Id: Math.max(...this.savedRecipes.map(r => r.Id), 0) + 1,
    };
    this.savedRecipes.push(newSavedRecipe);
    return { ...newSavedRecipe };
  }
  
  async update(id, updates) {
    await this.delay(300);
    const index = this.savedRecipes.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Saved recipe not found');
    }
    this.savedRecipes[index] = { ...this.savedRecipes[index], ...updates };
    return { ...this.savedRecipes[index] };
  }
  
  async delete(id) {
    await this.delay(200);
    const index = this.savedRecipes.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Saved recipe not found');
    }
    this.savedRecipes.splice(index, 1);
    return true;
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const savedRecipeService = new SavedRecipeService();