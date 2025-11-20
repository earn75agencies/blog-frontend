import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import userService from '../services/user.service';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiPlus, FiFileText, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const { data: postsData, isLoading, error } = useQuery(
    ['userPosts', user?._id],
    () => userService.getUserPosts(user!._id, { page: 1, limit: 12 }),
    { 
      enabled: !!user?._id,
      retry: 2,
      retryDelay: 1000,
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="info" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <p className="text-red-600 text-lg mb-4">Failed to load dashboard data</p>
        <p className="text-gray-500 text-sm">{(error as any)?.message || 'An error occurred'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  const posts = postsData?.posts || [];
  const publishedPosts = posts.filter((p) => p.status === 'published');
  const draftPosts = posts.filter((p) => p.status === 'draft');
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = posts.reduce((sum, p) => sum + p.likes.length, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.commentsCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('dashboard.dashboard')}</h1>
        <Link to="/create-post" className="btn btn-primary flex items-center gap-2">
          <FiPlus />
          {t('dashboard.createNewPost')}
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{t('dashboard.totalPosts')}</p>
              <p className="text-3xl font-bold">{posts.length}</p>
            </div>
            <FiFileText className="text-4xl text-primary-600 opacity-50" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{t('dashboard.publishedPosts')}</p>
              <p className="text-3xl font-bold">{publishedPosts.length}</p>
            </div>
            <FiEye className="text-4xl text-teal-600 opacity-50" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{t('dashboard.draftPosts')}</p>
              <p className="text-3xl font-bold">{draftPosts.length}</p>
            </div>
            <FiEdit2 className="text-4xl text-yellow-600 opacity-50" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{t('dashboard.totalViews')}</p>
              <p className="text-3xl font-bold">{totalViews}</p>
            </div>
            <FiEye className="text-4xl text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{t('dashboard.totalLikes')}</p>
              <p className="text-3xl font-bold">{totalLikes}</p>
            </div>
            <FiFileText className="text-4xl text-red-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div>
        <h2 className="text-2xl font-bold mb-6">{t('dashboard.myPosts')}</h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FiFileText className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">You haven't created any posts yet.</p>
            <Link to="/create-post" className="btn btn-primary inline-flex items-center gap-2">
              <FiPlus />
              {t('dashboard.createNewPost')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

