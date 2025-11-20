import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import postService from '../services/post.service';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiArrowRight } from 'react-icons/fi';

const HomePage = () => {
  const { t } = useTranslation();

  const { data: featuredPosts, isLoading: isLoadingFeatured, error: featuredError } = useQuery(
    'featuredPosts',
    () => postService.getFeaturedPosts(3),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Failed to load featured posts:', error);
      }
    }
  );

  const { data: latestPosts, isLoading: isLoadingLatest, error: latestError } = useQuery(
    'latestPosts',
    () => postService.getPosts({ page: 1, limit: 6, sortBy: 'publishedAt', sortOrder: 'desc' }),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Failed to load latest posts:', error);
      }
    }
  );

  if (isLoadingFeatured || isLoadingLatest) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-12 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Gidix</h1>
        <p className="text-xl mb-8 text-primary-100">
          The ultimate international blogging platform. Share your stories with the world.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/posts" className="btn bg-white text-primary-600 hover:bg-primary-50">
            {t('nav.posts')}
          </Link>
          <Link to="/register" className="btn bg-transparent border-2 border-white hover:bg-white hover:text-primary-600">
            {t('nav.register')}
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          <p>Unable to load featured posts. Please check your connection.</p>
        </div>
      )}
      {featuredPosts && featuredPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">{t('post.featured')} {t('nav.posts')}</h2>
            <Link
              to="/posts?featured=true"
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              {t('common.viewAll')}
              <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <PostCard key={post._id} post={post} featured />
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts */}
      {latestError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          <p>Unable to load latest posts. Please check your connection.</p>
        </div>
      )}
      {latestPosts && latestPosts.posts && latestPosts.posts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Latest {t('nav.posts')}</h2>
            <Link
              to="/posts"
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              {t('common.viewAll')}
              <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;

