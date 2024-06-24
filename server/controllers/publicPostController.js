import PublicPost from '../models/PublicPost.js';
import User from '../models/auth.js';

export const createPost = async (req, res) => {
  const { text } = req.body;
  const imageFile = req.files['image'] ? req.files['image'][0] : null;
  const videoFile = req.files['video'] ? req.files['video'][0] : null;

  try {
    const newPostData = {
      text,
      creator: req.userId, 
    };
    if (imageFile) newPostData.imageUrl = imageFile.path;
    if (videoFile) newPostData.videoUrl = videoFile.path;

    const newPost = new PublicPost(newPostData);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await PublicPost.find().populate('creator', 'name avatar').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};


export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PublicPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    
    if (post.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await PublicPost.findByIdAndRemove(id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};
