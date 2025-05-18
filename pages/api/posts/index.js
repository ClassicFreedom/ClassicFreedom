import dbConnect from '../../../utils/dbConnect';
import Post from '../../../models/Post';

export default async function handler(req, res) {
  const { method } = req;

  try {
    await dbConnect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ success: false, error: 'Database connection failed' });
  }

  switch (method) {
    case 'GET':
      try {
        const posts = await Post.find({}).sort({ date: -1 });
        console.log('Posts retrieved:', posts.length);
        res.status(200).json({ success: true, data: posts });
      } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        console.log('Attempting to create post:', req.body);
        const post = await Post.create(req.body);
        console.log('Post created successfully:', post);
        res.status(201).json({ success: true, data: post });
      } catch (error) {
        console.error('Error creating post:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
} 