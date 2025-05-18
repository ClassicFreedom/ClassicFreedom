import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this post.'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please provide content for this post.'],
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide an excerpt for this post.'],
    maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL for this post.'],
    validate: {
      validator: function(v) {
        return /^(http|https):\/\/[^ "]+$/.test(v) || v.startsWith('/');
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  },
  thumbnail: {
    type: String,
    default: '/images/default-thumbnail.jpg',
    validate: {
      validator: function(v) {
        return /^(http|https):\/\/[^ "]+$/.test(v) || v.startsWith('/');
      },
      message: props => `${props.value} is not a valid thumbnail URL!`
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  }
});

// Add a pre-save hook to ensure dates are properly formatted
PostSchema.pre('save', function(next) {
  if (this.isModified('date')) {
    this.date = new Date(this.date);
  }
  next();
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema); 