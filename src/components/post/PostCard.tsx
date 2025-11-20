import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Post } from '../../types';
import { useAuthStore } from '../../store/authStore';
import bookmarkService from '../../services/bookmark.service';
import { FiUser, FiClock, FiEye, FiHeart, FiMessageCircle, FiBookmark } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

const PostCard = ({ post, featured = false }: PostCardProps) => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // Check if post is bookmarked
  const { data: bookmarkData } = useQuery(
    ['bookmark-check', post._id],
    () => bookmarkService.checkBookmark(post._id),
    { enabled: isAuthenticated, retry: false }
  );

  const isBookmarked = bookmarkData?.data?.isBookmarked || false;

  // Bookmark mutation
  const bookmarkMutation = useMutation(
    async (bookmark: boolean) => {
      if (bookmark) {
        return await bookmarkService.addBookmark(post._id);
      } else {
        return await bookmarkService.removeBookmark(post._id);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookmark-check', post._id]);
        queryClient.invalidateQueries('bookmarks');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update bookmark');
      },
    }
  );

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to bookmark posts');
      return;
    }
    bookmarkMutation.mutate(!isBookmarked);
  };

  return (
    <article className={`card hover:shadow-lg transition-shadow ${featured ? 'ring-2 ring-primary-500' : ''}`}>
      {post.featuredImage && (
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        </Link>
      )}
      
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link
          to={`/category/${post.category.slug}`}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          {post.category.name}
        </Link>
        <span>•</span>
        <span>{format(new Date(post.publishedAt || post.createdAt), 'MMM d, yyyy')}</span>
      </div>

      <div className="flex items-start justify-between gap-2">
        <Link to={`/post/${post.slug}`} className="flex-1">
          <h3 className={`font-bold mb-2 hover:text-primary-600 transition-colors ${featured ? 'text-2xl' : 'text-xl'}`}>
            {post.title}
          </h3>
        </Link>
        {isAuthenticated && (
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                : 'text-gray-400 hover:text-primary-600 hover:bg-gray-100'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
          >
            <FiBookmark className={isBookmarked ? 'fill-current' : ''} />
          </button>
        )}
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <Link
          to={`/author/${post.author.username}`}
          className="flex items-center gap-2 hover:text-primary-600 transition-colors"
        >
          <FiUser />
          {post.author.username}
        </Link>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FiClock />
            {post.readingTime} min
          </span>
          <span className="flex items-center gap-1">
            <FiEye />
            {post.views}
          </span>
          <span className="flex items-center gap-1">
            <FiHeart />
            {post.likes.length}
          </span>
          <span className="flex items-center gap-1">
            <FiMessageCircle />
            {post.commentsCount}
          </span>
        </div>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag._id}
              to={`/tag/${tag.slug}`}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-primary-100 hover:text-primary-600 transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
};

export default PostCard;

