import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import PostCard from '../components/PostCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faLinkedin, faCalendar } from '@fortawesome/free-brands-svg-icons';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({ calendlyLink: '' });

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch('/api/posts');
      const data = await response.json();
      if (data.success) {
        setPosts(data.data);
      } else {
        throw new Error('Failed to fetch posts');
      }
    } catch (error) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchPosts(), fetchSettings()]);
  }, [fetchPosts]);

  const handlePostClick = useCallback((post) => {
    setSelectedPost(post);
    // Add post view to browser history
    window.history.pushState({ post: post._id }, '', `/?post=${post._id}`);
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.post) {
        const post = posts.find(p => p._id === event.state.post);
        if (post) setSelectedPost(post);
      } else {
        setSelectedPost(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [posts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>ClassicFreedom</title>
        <meta name="description" content="ClassicFreedom - A blog about freedom and classic ideas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">ClassicFreedom</h1>
            <div className="flex space-x-4">
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faGithub} /></a>
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faLinkedin} /></a>
            </div>
          </div>
        </div>
      </header>

      <div className="relative">
        {/* Left Sidebar - Consulting Button */}
        <div className="fixed top-[100px] left-4 w-[300px]">
          {settings.calendlyLink && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Freedom Consulting</h2>
              <p className="text-gray-600 mb-4">Book a call now</p>
              <a
                href={settings.calendlyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-teal-600 text-white rounded-lg py-4 px-6 text-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                Schedule Consultation
              </a>
            </div>
          )}
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pl-[350px] pr-[350px]">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              {error}
              <button
                onClick={fetchPosts}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onClick={handlePostClick} />
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar - Newsletter */}
        <div className="fixed top-[100px] right-4 w-[300px]">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div id="beehiiv-embed"></div>
          </div>
        </div>
      </div>

      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setSelectedPost(null);
            window.history.pushState(null, '', '/');
          }}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setSelectedPost(null);
                window.history.pushState(null, '', '/');
              }}
            >
              ×
            </button>
            <article className="prose max-w-none">
              <h1>{selectedPost.title}</h1>
              <div className="text-sm text-gray-500 mb-4">
                Published on {new Date(selectedPost.date).toLocaleDateString()}
              </div>
              <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </article>
          </div>
        </div>
      )}
    </div>
  );
} 