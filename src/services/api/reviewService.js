class ReviewService {
  constructor() {
    this.tableName = 'review';
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
          { field: { Name: "rating" } },
          { field: { Name: "comment" } },
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
        rating: item.rating || 0,
        comment: item.comment || '',
        createdAt: item.created_at || new Date().toISOString()
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching reviews:", error?.response?.data?.message);
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
          { field: { Name: "rating" } },
          { field: { Name: "comment" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error('Review not found');
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        recipeId: item.recipe_id ? parseInt(item.recipe_id) : null,
        rating: item.rating || 0,
        comment: item.comment || '',
        createdAt: item.created_at || new Date().toISOString()
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching review with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
  
  async getByRecipeId(recipeId) {
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
          { field: { Name: "rating" } },
          { field: { Name: "comment" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          {
            FieldName: "recipe_id",
            Operator: "EqualTo",
            Values: [recipeId.toString()]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform database fields to UI format
      return response.data.map(item => ({
        Id: item.Id,
        recipeId: item.recipe_id ? parseInt(item.recipe_id) : null,
        rating: item.rating || 0,
        comment: item.comment || '',
        createdAt: item.created_at || new Date().toISOString()
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching reviews by recipe ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
  
  async create(review) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: `Review for Recipe ${review.recipeId}`,
          recipe_id: review.recipeId,
          rating: review.rating,
          comment: review.comment,
          created_at: review.createdAt || new Date().toISOString()
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
          throw new Error('Failed to create review');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return {
          Id: successfulRecord.data.Id,
          recipeId: review.recipeId,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt || new Date().toISOString()
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating review:", error?.response?.data?.message);
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
      if (updates.rating !== undefined) updateData.rating = updates.rating;
      if (updates.comment !== undefined) updateData.comment = updates.comment;
      if (updates.createdAt) updateData.created_at = updates.createdAt;
      
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
          throw new Error('Failed to update review');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        const item = successfulRecord.data;
        return {
          Id: item.Id,
          recipeId: item.recipe_id ? parseInt(item.recipe_id) : null,
          rating: item.rating || 0,
          comment: item.comment || '',
          createdAt: item.created_at || new Date().toISOString()
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating review:", error?.response?.data?.message);
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
          throw new Error('Failed to delete review');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting review:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}
}

export default new ReviewService();