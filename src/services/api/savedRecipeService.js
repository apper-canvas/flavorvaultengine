import savedRecipesData from '@/services/mockData/savedRecipes.json';

class SavedRecipeService {
  constructor() {
    this.savedRecipes = [...savedRecipesData];
    this.folders = [
      { Id: 1, name: "Breakfast", parentId: null, createdAt: "2024-01-15T10:00:00Z" },
      { Id: 2, name: "Healthy", parentId: null, createdAt: "2024-01-16T10:00:00Z" }
    ];
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
  
// Folder management methods
  async getAllFolders() {
    await this.delay(200);
    return [...this.folders];
  }
  
  async getByFolder(folderId) {
    await this.delay(200);
    return this.savedRecipes.filter(r => r.folderId === folderId);
  }
  
  async moveToFolder(savedRecipeId, folderId) {
    await this.delay(300);
    const index = this.savedRecipes.findIndex(r => r.Id === savedRecipeId);
    if (index === -1) {
      throw new Error('Saved recipe not found');
    }
    this.savedRecipes[index] = { 
      ...this.savedRecipes[index], 
      folderId: folderId 
    };
    return { ...this.savedRecipes[index] };
  }
  
  async createFolder(folder) {
    await this.delay(300);
    const newFolder = {
      ...folder,
      Id: Math.max(...this.folders.map(f => f.Id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    this.folders.push(newFolder);
    return { ...newFolder };
  }
  
  async updateFolder(id, updates) {
    await this.delay(300);
    const index = this.folders.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error('Folder not found');
    }
    this.folders[index] = { ...this.folders[index], ...updates };
    return { ...this.folders[index] };
  }
  
  async deleteFolder(id) {
    await this.delay(300);
    const index = this.folders.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error('Folder not found');
    }
    
    // Move recipes in this folder to root
    this.savedRecipes.forEach((recipe, idx) => {
      if (recipe.folderId === id) {
        this.savedRecipes[idx] = { ...recipe, folderId: null };
      }
    });
    
    this.folders.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const savedRecipeService = new SavedRecipeService();