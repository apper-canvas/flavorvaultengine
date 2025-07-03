class RecipeService {
  constructor() {
    this.tableName = 'recipe';
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "image_url" } },
          { field: { Name: "prep_time" } },
          { field: { Name: "cook_time" } },
          { field: { Name: "servings" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "meal_type" } },
          { field: { Name: "dietary_restrictions" } },
          { field: { Name: "rating" } },
          { field: { Name: "review_count" } },
          { field: { Name: "created_by" } },
          { field: { Name: "created_at" } }
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
        title: item.title || '',
        description: item.description || '',
        imageUrl: item.image_url || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=300&fit=crop',
        prepTime: item.prep_time || 0,
        cookTime: item.cook_time || 0,
        servings: item.servings || 1,
        difficulty: item.difficulty || 'Easy',
        mealType: item.meal_type ? item.meal_type.split(',') : [],
        dietaryRestrictions: item.dietary_restrictions ? item.dietary_restrictions.split(',') : [],
        rating: item.rating || 0,
        reviewCount: item.review_count || 0,
        createdBy: item.created_by || 'user',
        createdAt: item.created_at || new Date().toISOString(),
        ingredients: [], // Will be loaded separately from ingredient table
        instructions: [] // Will be loaded separately from instruction table
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recipes:", error?.response?.data?.message);
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "image_url" } },
          { field: { Name: "prep_time" } },
          { field: { Name: "cook_time" } },
          { field: { Name: "servings" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "meal_type" } },
          { field: { Name: "dietary_restrictions" } },
          { field: { Name: "rating" } },
          { field: { Name: "review_count" } },
          { field: { Name: "created_by" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error('Recipe not found');
      }
      
      const item = response.data;
      
      // Transform database fields to UI format and add mock ingredients/instructions for now
      return {
        Id: item.Id,
        title: item.title || '',
        description: item.description || '',
        imageUrl: item.image_url || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=300&fit=crop',
        prepTime: item.prep_time || 0,
        cookTime: item.cook_time || 0,
        servings: item.servings || 1,
        difficulty: item.difficulty || 'Easy',
        mealType: item.meal_type ? item.meal_type.split(',') : [],
        dietaryRestrictions: item.dietary_restrictions ? item.dietary_restrictions.split(',') : [],
        rating: item.rating || 0,
        reviewCount: item.review_count || 0,
        createdBy: item.created_by || 'user',
        createdAt: item.created_at || new Date().toISOString(),
        // Mock data for now - will be replaced with separate service calls
        ingredients: [
          { name: "Sample ingredient", amount: 1, unit: "cup", notes: "" }
        ],
        instructions: [
          { stepNumber: 1, text: "Sample instruction", duration: 5 }
        ]
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching recipe with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async create(recipe) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: recipe.title,
          title: recipe.title,
          description: recipe.description,
          image_url: recipe.imageUrl,
          prep_time: recipe.prepTime,
          cook_time: recipe.cookTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          meal_type: recipe.mealType.join(','),
          dietary_restrictions: recipe.dietaryRestrictions.join(','),
          rating: recipe.rating || 0,
          review_count: recipe.reviewCount || 0,
          created_by: recipe.createdBy,
          created_at: recipe.createdAt
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
          throw new Error('Failed to create recipe');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return {
          ...recipe,
          Id: successfulRecord.data.Id
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating recipe:", error?.response?.data?.message);
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
      
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.imageUrl) updateData.image_url = updates.imageUrl;
      if (updates.prepTime !== undefined) updateData.prep_time = updates.prepTime;
      if (updates.cookTime !== undefined) updateData.cook_time = updates.cookTime;
      if (updates.servings !== undefined) updateData.servings = updates.servings;
      if (updates.difficulty) updateData.difficulty = updates.difficulty;
      if (updates.mealType) updateData.meal_type = updates.mealType.join(',');
      if (updates.dietaryRestrictions) updateData.dietary_restrictions = updates.dietaryRestrictions.join(',');
      if (updates.rating !== undefined) updateData.rating = updates.rating;
      if (updates.reviewCount !== undefined) updateData.review_count = updates.reviewCount;
      
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
          throw new Error('Failed to update recipe');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return successfulRecord.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating recipe:", error?.response?.data?.message);
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
          throw new Error('Failed to delete recipe');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting recipe:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}

export const recipeService = new RecipeService();