class MealPlanService {
  constructor() {
    this.tableName = 'meal_plan';
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
          { field: { Name: "date" } },
          { field: { Name: "time_slot" } },
          { field: { Name: "notes" } },
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
        recipeId: item.recipe_id ? parseInt(item.recipe_id) : null,
        date: item.date || '',
        timeSlot: item.time_slot || '',
        notes: item.notes || '',
        createdAt: item.created_at || new Date().toISOString()
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching meal plans:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async getById(id) {
    if (!Number.isInteger(id)) {
      throw new Error('Invalid ID: must be an integer');
    }
    
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
          { field: { Name: "date" } },
          { field: { Name: "time_slot" } },
          { field: { Name: "notes" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error('Meal plan not found');
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        recipeId: item.recipe_id ? parseInt(item.recipe_id) : null,
        date: item.date || '',
        timeSlot: item.time_slot || '',
        notes: item.notes || '',
        createdAt: item.created_at || new Date().toISOString()
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching meal plan with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async create(mealPlan) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields and convert field names
      const params = {
        records: [{
          Name: `Meal Plan ${new Date().toISOString()}`,
          recipe_id: mealPlan.recipeId,
          date: mealPlan.date,
          time_slot: mealPlan.timeSlot,
          notes: mealPlan.notes || '',
          created_at: new Date().toISOString()
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
          throw new Error('Failed to create meal plan');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return {
          Id: successfulRecord.data.Id,
          recipeId: mealPlan.recipeId,
          date: mealPlan.date,
          timeSlot: mealPlan.timeSlot,
          notes: mealPlan.notes || '',
          createdAt: new Date().toISOString()
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating meal plan:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async update(id, updates) {
    if (!Number.isInteger(id)) {
      throw new Error('Invalid ID: must be an integer');
    }
    
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
      if (updates.date) updateData.date = updates.date;
      if (updates.timeSlot) updateData.time_slot = updates.timeSlot;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      
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
          throw new Error('Failed to update meal plan');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        const item = successfulRecord.data;
        return {
          Id: item.Id,
          recipeId: item.recipe_id ? parseInt(item.recipe_id) : null,
          date: item.date || '',
          timeSlot: item.time_slot || '',
          notes: item.notes || '',
          createdAt: item.created_at || new Date().toISOString()
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating meal plan:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async delete(id) {
    if (!Number.isInteger(id)) {
      throw new Error('Invalid ID: must be an integer');
    }
    
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
          throw new Error('Failed to delete meal plan');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting meal plan:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async getByDateRange(startDate, endDate) {
    try {
      const allMealPlans = await this.getAll();
      return allMealPlans.filter(meal => {
        const mealDate = new Date(meal.date);
        return mealDate >= new Date(startDate) && mealDate <= new Date(endDate);
      });
    } catch (error) {
      console.error("Error fetching meal plans by date range:", error.message);
      throw error;
    }
  }
}

export const mealPlanService = new MealPlanService();