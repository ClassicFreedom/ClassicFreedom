import { useState, useEffect } from 'react';
import Head from 'next/head';
import PostEditor from '../components/PostEditor';

export default function Admin() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({ calendlyLink: '', defaultThumbnail: '' });
  const [isSettingsSaving, setIsSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');

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
      console.log('Admin - Settings fetched:', data);
      if (data.success) {
        setSettings(data.data);
        console.log('Admin - Settings state updated:', data.data);
      }
    } catch (error) {
      console.error('Admin - Error fetching settings:', error);
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
    console.log('Admin - Saving settings:', settings);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      console.log('Admin - Save settings response:', data);
      if (!data.success) {
        throw new Error('Failed to save settings');
      }
      console.log('Admin - Settings saved successfully');
    } catch (error) {
      console.error('Admin - Error saving settings:', error);
      setSettingsError('Failed to save settings. Please try again.');
    } finally {
      setIsSettingsSaving(false);
    }
  };

  const TabButton = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-medium rounded-t-lg ${
        activeTab === tab
          ? 'bg-white text-teal-600 border-t border-l border-r'
          : 'bg-gray-100 text-gray-600 hover:text-gray-800'
      }`}
    >
      {label}
    </button>
  );

  const CalendlySettingsTab = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Site Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure your Calendly link and default image settings.
          </p>
        </div>
        <form onSubmit={handleSettingsSave} className="space-y-6">
          <div>
            <label htmlFor="calendlyLink" className="block text-sm font-medium text-gray-700">
              Calendly Consultation Link
            </label>
            <div className="mt-2">
              <input
                id="calendlyLink"
                type="url"
                name="calendlyLink"
                value={settings.calendlyLink}
                onChange={(e) => setSettings({ ...settings, calendlyLink: e.target.value })}
                placeholder="https://calendly.com/your-link"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-base"
                aria-describedby="calendly-link-description"
              />
            </div>
            <p id="calendly-link-description" className="mt-2 text-sm text-gray-500">
              Enter your Calendly link where clients can book consultations. Make sure your Calendly is set up with Stripe integration for payments.
            </p>
          </div>

          <div className="mt-6">
            <label htmlFor="defaultThumbnail" className="block text-sm font-medium text-gray-700">
              Default Post Thumbnail URL
            </label>
            <div className="mt-2">
              <input
                id="defaultThumbnail"
                type="url"
                name="defaultThumbnail"
                value={settings.defaultThumbnail}
                onChange={(e) => setSettings({ ...settings, defaultThumbnail: e.target.value })}
                placeholder="https://example.com/default-image.jpg"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-base"
                aria-describedby="default-thumbnail-description"
              />
            </div>
            <p id="default-thumbnail-description" className="mt-2 text-sm text-gray-500">
              Enter the URL for the default thumbnail image that will be used when a post doesn't have its own thumbnail.
            </p>
            {settings.defaultThumbnail && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={settings.defaultThumbnail}
                  alt="Default thumbnail preview"
                  className="w-[200px] h-[112px] object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x225';
                    e.target.alt = 'Invalid image URL';
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Calendly Preview</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="max-w-sm mx-auto">
                {settings.calendlyLink ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Your button will appear like this:</p>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Freedom Consulting</h2>
                      <p className="text-gray-600 mb-4">Book a call now</p>
                      <a
                        href={settings.calendlyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-teal-600 text-white rounded-lg py-4 px-6 text-lg font-semibold hover:bg-teal-700 transition-colors text-center"
                      >
                        Schedule Consultation
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Enter a Calendly link above to see how the button will appear on your website.
                  </p>
                )}
              </div>
            </div>
          </div>

          {settingsError && (
            <div className="text-red-600 text-sm mt-2" role="alert">
              {settingsError}
            </div>
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
  );

  const PostsTab = () => (
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
                  type="button"
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
  );

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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="border-b border-gray-200">
            <div className="flex space-x-2">
              <TabButton tab="posts" label="Posts" />
              <TabButton tab="calendly" label="Calendly Settings" />
            </div>
          </div>

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
            <>
              {activeTab === 'posts' && <PostsTab />}
              {activeTab === 'calendly' && <CalendlySettingsTab />}
            </>
          )}
        </div>
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