import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  calendlyLink: {
    type: String,
    required: [true, 'Please provide your Calendly link'],
    default: ''
  },
  defaultThumbnail: {
    type: String,
    required: [true, 'Please provide a default thumbnail URL'],
    default: 'https://via.placeholder.com/400x225'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema); 