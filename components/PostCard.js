import Image from 'next/image';

const PostCard = ({ post, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:-translate-y-1 hover:shadow-lg"
      onClick={() => onClick(post)}
    >
      <div className="relative h-48 w-full">
        <img
          src={post.thumbnail || '/images/default-thumbnail.jpg'}
          alt={post.title}
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</span>
          <button 
            className="text-teal-600 hover:text-teal-700 font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onClick(post);
            }}
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 