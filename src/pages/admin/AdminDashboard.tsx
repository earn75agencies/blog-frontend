import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import adminService from '../../services/admin.service';
import analyticsService from '../../services/analytics.service';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FiUsers, FiFileText, FiMessageCircle, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
  const { t } = useTranslation();

  const { data: overview, isLoading } = useQuery('adminOverview', () =>
    adminService.getOverview()
  );

  const { data: analytics } = useQuery('adminAnalytics', () =>
    analyticsService.getOverview()
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Overview */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{overview.stats.users}</p>
              </div>
              <FiUsers className="text-4xl text-primary-600 opacity-50" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Posts</p>
                <p className="text-3xl font-bold">{overview.stats.posts}</p>
              </div>
              <FiFileText className="text-4xl text-teal-600 opacity-50" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Comments</p>
                <p className="text-3xl font-bold">{overview.stats.comments}</p>
              </div>
              <FiMessageCircle className="text-4xl text-blue-600 opacity-50" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Comments</p>
                <p className="text-3xl font-bold">{overview.stats.pendingComments}</p>
              </div>
              <FiTrendingUp className="text-4xl text-yellow-600 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        {overview?.recent.users && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Recent Users</h2>
            <div className="space-y-3">
              {overview.recent.users.map((user: any) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Posts */}
        {overview?.recent.posts && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
            <div className="space-y-3">
              {overview.recent.posts.map((post: any) => (
                <div
                  key={post._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-gray-500">
                      by {post.author.username} • {post.status}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

