import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this post.'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content for this post.']
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide an excerpt for this post.'],
    maxlength: [200, 'Excerpt cannot be more than 200 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL for this post.']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema); 