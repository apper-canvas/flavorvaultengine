class SavedRecipeService {
  constructor() {
    this.tableName = 'saved_recipe';
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
          { field: { Name: "recipe_id" } },
          { field: { Name: "folder_id" } },
          { field: { Name: "title" } },
          { field: { Name: "image_url" } },
          { field: { Name: "saved_at" } }
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
        recipeId: item.recipe_id ? parseInt(item.recipe_id) : null,
        folderId: item.folder_id || null,
        title: item.title || '',
        imageUrl: item.image_url || '',
        savedAt: item.saved_at || new Date().toISOString()
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching saved recipes:", error?.response?.data?.message);
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
          { field: { Name: "recipe_id" } },
          { field: { Name: "folder_id" } },
          { field: { Name: "title" } },
          { field: { Name: "image_url" } },
          { field: { Name: "saved_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error('Saved recipe not found');
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        recipeId: item.recipe_id ? parseInt(item.recipe_id) : null,
        folderId: item.folder_id || null,
        title: item.title || '',
        imageUrl: item.image_url || '',
        savedAt: item.saved_at || new Date().toISOString()
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching saved recipe with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async create(savedRecipe) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: savedRecipe.title,
          recipe_id: savedRecipe.recipeId,
          folder_id: savedRecipe.folderId || null,
          title: savedRecipe.title,
          image_url: savedRecipe.imageUrl,
          saved_at: savedRecipe.savedAt || new Date().toISOString()
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
          throw new Error('Failed to create saved recipe');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return {
          Id: successfulRecord.data.Id,
          recipeId: savedRecipe.recipeId,
          folderId: savedRecipe.folderId || null,
          title: savedRecipe.title,
          imageUrl: savedRecipe.imageUrl,
          savedAt: savedRecipe.savedAt || new Date().toISOString()
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating saved recipe:", error?.response?.data?.message);
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
      
      if (updates.recipeId !== undefined) updateData.recipe_id = updates.recipeId;
      if (updates.folderId !== undefined) updateData.folder_id = updates.folderId;
      if (updates.title) updateData.title = updates.title;
      if (updates.imageUrl) updateData.image_url = updates.imageUrl;
      if (updates.savedAt) updateData.saved_at = updates.savedAt;
      
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
          throw new Error('Failed to update saved recipe');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        const item = successfulRecord.data;
        return {
          Id: item.Id,
          recipeId: item.recipe_id ? parseInt(item.recipe_id) : null,
          folderId: item.folder_id || null,
          title: item.title || '',
          imageUrl: item.image_url || '',
          savedAt: item.saved_at || new Date().toISOString()
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating saved recipe:", error?.response?.data?.message);
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
          throw new Error('Failed to delete saved recipe');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting saved recipe:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  // Folder management methods - keeping existing functionality for now
  async getAllFolders() {
    // Mock implementation - would need separate folder table in real database
    return [
      { Id: 1, name: "Breakfast", parentId: null, createdAt: "2024-01-15T10:00:00Z" },
      { Id: 2, name: "Healthy", parentId: null, createdAt: "2024-01-16T10:00:00Z" }
    ];
  }
  
  async getByFolder(folderId) {
    try {
      const allSavedRecipes = await this.getAll();
      return allSavedRecipes.filter(r => r.folderId === folderId);
    } catch (error) {
      console.error("Error fetching saved recipes by folder:", error.message);
      throw error;
    }
  }
  
  async moveToFolder(savedRecipeId, folderId) {
    return await this.update(savedRecipeId, { folderId });
  }
  
  async createFolder(folder) {
    // Mock implementation - would need separate folder table in real database
    const newFolder = {
      ...folder,
      Id: Date.now(), // Simple ID generation for mock
      createdAt: new Date().toISOString()
    };
    return newFolder;
  }
  
  async updateFolder(id, updates) {
    // Mock implementation - would need separate folder table in real database
    return { Id: id, ...updates };
  }
  
  async deleteFolder(id) {
    // Mock implementation - would need separate folder table in real database
    // Move recipes in this folder to root
    const savedRecipes = await this.getAll();
    const recipesToUpdate = savedRecipes.filter(recipe => recipe.folderId === id);
    
    for (const recipe of recipesToUpdate) {
      await this.update(recipe.Id, { folderId: null });
    }
    
    return true;
  }
}

export const savedRecipeService = new SavedRecipeService();