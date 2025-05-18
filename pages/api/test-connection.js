import dbConnect from '../../utils/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Test database connection
    await dbConnect();

    // Check if environment variables are set (don't return actual values for security)
    const envCheck = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      NEXT_PUBLIC_ADMIN_USERNAME: !!process.env.NEXT_PUBLIC_ADMIN_USERNAME,
      NEXT_PUBLIC_ADMIN_PASSWORD: !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    };

    return res.status(200).json({
      success: true,
      message: 'Connection test successful',
      environmentVariables: envCheck,
      database: 'Connected successfully'
    });
  } catch (error) {
    console.error('Test connection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Connection test failed',
      error: error.message
    });
  }
} 