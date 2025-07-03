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