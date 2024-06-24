import mongoose from 'mongoose';

const publicPostSchema = mongoose.Schema({
  text: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('PublicPost', publicPostSchema);
