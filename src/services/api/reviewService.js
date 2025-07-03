import React from "react";
import Error from "@/components/ui/Error";
class ReviewService {
// Initialize ApperClient instance
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const tableName = 'review';

async function getAll() {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "recipe_id" } },
        { field: { Name: "rating" } },
        { field: { Name: "comment" } },
        { field: { Name: "created_at" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } }
      ],
      orderBy: [
        {
          fieldName: "created_at",
          sorttype: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching reviews:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error fetching reviews:", error.message);
      throw error;
    }
  }
}

async function getById(id) {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "recipe_id" } },
        { field: { Name: "rating" } },
        { field: { Name: "comment" } },
        { field: { Name: "created_at" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } }
      ]
    };
    
    const response = await apperClient.getRecordById(tableName, id, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching review with ID ${id}:`, error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error(`Error fetching review with ID ${id}:`, error.message);
      throw error;
    }
  }
}

async function getByRecipeId(recipeId) {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "recipe_id" } },
        { field: { Name: "rating" } },
        { field: { Name: "comment" } },
        { field: { Name: "created_at" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } }
      ],
      where: [
        {
          FieldName: "recipe_id",
          Operator: "EqualTo",
          Values: [recipeId]
        }
      ],
      orderBy: [
        {
          fieldName: "created_at",
          sorttype: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching reviews for recipe ${recipeId}:`, error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error(`Error fetching reviews for recipe ${recipeId}:`, error.message);
      throw error;
    }
  }
}

async function create(review) {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const reviewData = {
      Name: review.Name || `Review for Recipe ${review.recipe_id}`,
      recipe_id: review.recipe_id || review.recipeId,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at || review.createdAt || new Date().toISOString()
    };
    
    const params = {
      records: [reviewData]
    };
    
    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} reviews:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            throw new Error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulRecords[0]?.data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating review:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error creating review:", error.message);
      throw error;
    }
  }
}

async function update(id, updates) {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const updateData = {
      Id: id,
      ...(updates.Name && { Name: updates.Name }),
      ...(updates.recipe_id && { recipe_id: updates.recipe_id }),
      ...(updates.recipeId && { recipe_id: updates.recipeId }),
      ...(updates.rating !== undefined && { rating: updates.rating }),
      ...(updates.comment !== undefined && { comment: updates.comment }),
      ...(updates.created_at && { created_at: updates.created_at }),
      ...(updates.createdAt && { created_at: updates.createdAt })
    };
    
    const params = {
      records: [updateData]
    };
    
    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} reviews:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            throw new Error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulUpdates[0]?.data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating review:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error updating review:", error.message);
      throw error;
    }
  }
}

async function deleteReview(id) {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} reviews:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) throw new Error(record.message);
        });
      }
      
      return true;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting review:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error deleting review:", error.message);
      throw error;
    }
  }
}

export default {
  getAll,
  getById,
  getByRecipeId,
  create,
  update,
  delete: deleteReview
};
  async getAll() {
    try {
      
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
