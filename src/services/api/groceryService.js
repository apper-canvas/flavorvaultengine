class GroceryService {
  constructor() {
    this.tableName = 'grocery_item';
  }
  
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "ingredient" } },
          { field: { Name: "quantity" } },
          { field: { Name: "unit" } },
          { field: { Name: "recipe_ids" } },
          { field: { Name: "checked" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      return response.data.map(item => ({
        Id: item.Id,
        ingredient: item.ingredient || '',
        quantity: item.quantity || 0,
        unit: item.unit || '',
        recipeIds: item.recipe_ids ? item.recipe_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        checked: item.checked ? item.checked.includes('true') : false
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grocery items:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "ingredient" } },
          { field: { Name: "quantity" } },
          { field: { Name: "unit" } },
          { field: { Name: "recipe_ids" } },
          { field: { Name: "checked" } }
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error('Grocery item not found');
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        ingredient: item.ingredient || '',
        quantity: item.quantity || 0,
        unit: item.unit || '',
        recipeIds: item.recipe_ids ? item.recipe_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        checked: item.checked ? item.checked.includes('true') : false
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grocery item with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async create(item) {
    try {
      // First check if ingredient already exists and merge quantities
      const allItems = await this.getAll();
      const existingItem = allItems.find(
        existing => existing.ingredient.toLowerCase() === item.ingredient.toLowerCase() &&
                   existing.unit === item.unit
      );
      
      if (existingItem) {
        // Update existing item
        const updatedQuantity = existingItem.quantity + item.quantity;
        const updatedRecipeIds = [...new Set([...existingItem.recipeIds, ...item.recipeIds])];
        
        return await this.update(existingItem.Id, {
          quantity: updatedQuantity,
          recipeIds: updatedRecipeIds
        });
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: `${item.ingredient} - ${item.quantity} ${item.unit}`,
          ingredient: item.ingredient,
          quantity: item.quantity,
          unit: item.unit,
          recipe_ids: item.recipeIds.join(','),
          checked: item.checked ? 'true' : 'false'
        }]
      };
      
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create grocery item');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return {
          Id: successfulRecord.data.Id,
          ingredient: item.ingredient,
          quantity: item.quantity,
          unit: item.unit,
          recipeIds: item.recipeIds,
          checked: item.checked
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grocery item:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const updateData = {
        Id: id
      };
      
      if (updates.ingredient) updateData.ingredient = updates.ingredient;
      if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
      if (updates.unit) updateData.unit = updates.unit;
      if (updates.recipeIds) updateData.recipe_ids = updates.recipeIds.join(',');
      if (updates.checked !== undefined) updateData.checked = updates.checked ? 'true' : 'false';
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to update grocery item');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        const item = successfulRecord.data;
        return {
          Id: item.Id,
          ingredient: item.ingredient || '',
          quantity: item.quantity || 0,
          unit: item.unit || '',
          recipeIds: item.recipe_ids ? item.recipe_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
          checked: item.checked ? item.checked.includes('true') : false
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grocery item:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          throw new Error('Failed to delete grocery item');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grocery item:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}

export const groceryService = new GroceryService();