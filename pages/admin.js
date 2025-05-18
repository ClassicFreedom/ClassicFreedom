import { useState, useEffect } from 'react';
import Head from 'next/head';
import PostEditor from '../components/PostEditor';

export default function Admin() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({ calendlyLink: '' });
  const [isSettingsSaving, setIsSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  useEffect(() => {
    Promise.all([fetchPosts(), fetchSettings()]);
  }, []);

  const fetchPosts = async () => {
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      setSettingsError('Failed to load settings');
    }
  };

  const handleSave = (updatedPost) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
    setSelectedPost(null);
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setIsSettingsSaving(true);
    setSettingsError('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      setSettingsError('Failed to save settings. Please try again.');
    } finally {
      setIsSettingsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Admin - ClassicFreedom</title>
        <meta name="robots" content="noindex" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Calendly Settings Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Freedom Consulting Settings</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure your Calendly link for consultation bookings. Make sure your Calendly is set up with Stripe integration for payments.
                </p>
              </div>
            </div>
            <form onSubmit={handleSettingsSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Calendly Consultation Link
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    value={settings.calendlyLink}
                    onChange={(e) => setSettings({ ...settings, calendlyLink: e.target.value })}
                    placeholder="https://calendly.com/your-link"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Enter your Calendly link where clients can book consultations. This will be displayed as a prominent button on your website.
                  </p>
                </div>
              </div>
              {settingsError && (
                <div className="text-red-600 text-sm">{settingsError}</div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSettingsSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                >
                  {isSettingsSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Posts Section */}
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
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Posts</h2>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                        <p className="text-sm text-gray-500">
                          Published on {new Date(post.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="px-3 py-1 text-sm text-teal-600 hover:text-teal-700"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Post</h2>
            <PostEditor
              post={selectedPost}
              onSave={handleSave}
              onCancel={() => setSelectedPost(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 