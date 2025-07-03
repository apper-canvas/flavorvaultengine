import reviewsData from '@/services/mockData/reviews.json';

class ReviewService {
  constructor() {
    this.reviews = [...reviewsData];
  }
  
  async getAll() {
    await this.delay(200);
    return [...this.reviews];
  }
  
  async getById(id) {
    await this.delay(200);
    const review = this.reviews.find(r => r.Id === id);
    if (!review) {
      throw new Error('Review not found');
    }
    return { ...review };
  }
  
  async getByRecipeId(recipeId) {
    await this.delay(200);
    return this.reviews.filter(r => r.recipeId === recipeId).map(r => ({ ...r }));
  }
  
  async create(review) {
    await this.delay(300);
    const newReview = {
      ...review,
      Id: Math.max(...this.reviews.map(r => r.Id), 0) + 1,
    };
    this.reviews.push(newReview);
    return { ...newReview };
  }
  
  async update(id, updates) {
    await this.delay(300);
    const index = this.reviews.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Review not found');
    }
    this.reviews[index] = { ...this.reviews[index], ...updates };
    return { ...this.reviews[index] };
  }
  
  async delete(id) {
    await this.delay(200);
    const index = this.reviews.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Review not found');
    }
    this.reviews.splice(index, 1);
    return true;
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const reviewService = new ReviewService();