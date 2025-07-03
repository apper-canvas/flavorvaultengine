import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Rating from '@/components/atoms/Rating';

const ReviewSection = ({ reviews, averageRating, onAddReview }) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  const handleSubmitReview = () => {
    if (newReview.comment.trim()) {
      onAddReview(newReview);
      setNewReview({ rating: 5, comment: '' });
      setShowAddReview(false);
    }
  };
  
  return (
    <div className="bg-surface rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
            Reviews & Ratings
          </h3>
          <div className="flex items-center gap-2">
            <Rating rating={averageRating} size="medium" />
            <span className="text-gray-600">
              {averageRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="small"
          icon="Plus"
          onClick={() => setShowAddReview(true)}
        >
          Add Review
        </Button>
      </div>
      
      {showAddReview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-lg border border-gray-200 p-4 mb-6"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <Rating
              rating={newReview.rating}
              interactive
              onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
              size="large"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience with this recipe..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="4"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="small"
              onClick={handleSubmitReview}
              disabled={!newReview.comment.trim()}
            >
              Submit Review
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={() => setShowAddReview(false)}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
      
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-100 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Rating rating={review.rating} size="small" />
              <span className="text-sm text-gray-500">
                {format(new Date(review.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {review.comment}
            </p>
          </motion.div>
        ))}
        
        {reviews.length === 0 && (
          <div className="text-center py-8">
            <ApperIcon name="MessageCircle" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;