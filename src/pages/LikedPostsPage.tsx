import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiHeart } from 'react-icons/fi';
import postService from '../services/post.service';
import { Post } from '../types';

const LikedPostsPage = () => {
  const { t } = useTranslation();

  const { data: likedPosts, isLoading } = useQuery<Post[]>('likedPosts', async () => {
    const response = await postService.getPosts({});
    // Filter posts that user has liked
    // Note: This assumes the API returns a 'liked' field or we need a separate endpoint
    // If backend has /api/users/me/liked-posts endpoint, use that instead
    const allPosts = response.posts;
    // Fetch user's liked posts from backend endpoint
    try {
      const apiService = (await import('../services/api.service')).default;
      const response = await apiService.get('/api/users/me/liked-posts');
      return response.data?.posts || [];
    } catch (error) {
      // Fallback: return empty array if endpoint doesn't exist yet
      return [];
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="danger" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <FiHeart className="text-3xl text-red-600" />
        <h1 className="text-3xl font-bold">Liked Posts</h1>
      </div>

      {likedPosts && likedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedPosts.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FiHeart className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">You haven't liked any posts yet.</p>
          <Link to="/posts" className="btn btn-primary">
            Explore Posts
          </Link>
        </div>
      )}
    </div>
  );
};

export default LikedPostsPage;

