import groceryItemsData from '@/services/mockData/groceryItems.json';

class GroceryService {
  constructor() {
    this.groceryItems = [...groceryItemsData];
  }
  
  async getAll() {
    await this.delay(200);
    return [...this.groceryItems];
  }
  
  async getById(id) {
    await this.delay(200);
    const item = this.groceryItems.find(i => i.Id === id);
    if (!item) {
      throw new Error('Grocery item not found');
    }
    return { ...item };
  }
  
  async create(item) {
    await this.delay(300);
    
    // Check if ingredient already exists and merge quantities
    const existingItem = this.groceryItems.find(
      existing => existing.ingredient.toLowerCase() === item.ingredient.toLowerCase() &&
                 existing.unit === item.unit
    );
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
      existingItem.recipeIds = [...new Set([...existingItem.recipeIds, ...item.recipeIds])];
      return { ...existingItem };
    }
    
    const newItem = {
      ...item,
      Id: Math.max(...this.groceryItems.map(i => i.Id), 0) + 1,
    };
    this.groceryItems.push(newItem);
    return { ...newItem };
  }
  
  async update(id, updates) {
    await this.delay(300);
    const index = this.groceryItems.findIndex(i => i.Id === id);
    if (index === -1) {
      throw new Error('Grocery item not found');
    }
    this.groceryItems[index] = { ...this.groceryItems[index], ...updates };
    return { ...this.groceryItems[index] };
  }
  
  async delete(id) {
    await this.delay(200);
    const index = this.groceryItems.findIndex(i => i.Id === id);
    if (index === -1) {
      throw new Error('Grocery item not found');
    }
    this.groceryItems.splice(index, 1);
    return true;
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const groceryService = new GroceryService();