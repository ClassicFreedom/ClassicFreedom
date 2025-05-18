import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  calendlyLink: {
    type: String,
    required: [true, 'Please provide your Calendly link'],
    default: ''
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema); 