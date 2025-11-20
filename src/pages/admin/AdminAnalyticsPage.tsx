import { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import analyticsService from '../../services/analytics.service';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AnalyticsChart from '../../components/analytics/AnalyticsChart';
import { FiTrendingUp, FiUsers, FiFileText, FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';

const AdminAnalyticsPage = () => {
  const { t } = useTranslation();
  const [days, setDays] = useState(30);

  const { data: overview, isLoading: isLoadingOverview } = useQuery('analyticsOverview', () =>
    analyticsService.getOverview()
  );

  const { data: trends, isLoading: isLoadingTrends } = useQuery(['analyticsTrends', days], () =>
    analyticsService.getTrends(days)
  );

  const { data: postsStats, isLoading: isLoadingPosts } = useQuery('analyticsPosts', () =>
    analyticsService.getPostsStats()
  );

  if (isLoadingOverview || isLoadingTrends || isLoadingPosts) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="input w-32"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{overview.users.total}</p>
              </div>
              <FiUsers className="text-4xl text-primary-600 opacity-50" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Posts</p>
                <p className="text-3xl font-bold">{overview.posts.total}</p>
              </div>
              <FiFileText className="text-4xl text-teal-600 opacity-50" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Views</p>
                <p className="text-3xl font-bold">{overview.views.total}</p>
              </div>
              <FiEye className="text-4xl text-blue-600 opacity-50" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Comments</p>
                <p className="text-3xl font-bold">{overview.comments.total}</p>
              </div>
              <FiMessageCircle className="text-4xl text-purple-600 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Trends Charts */}
      {trends && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsChart
            type="line"
            title="Posts Over Time"
            data={trends.posts.map((item: any) => ({
              label: `${item._id.year}-${item._id.month}-${item._id.day}`,
              value: item.count,
            }))}
          />
          <AnalyticsChart
            type="line"
            title="Users Over Time"
            data={trends.users.map((item: any) => ({
              label: `${item._id.year}-${item._id.month}-${item._id.day}`,
              value: item.count,
            }))}
          />
        </div>
      )}

      {/* Posts Statistics */}
      {postsStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsChart
            type="bar"
            title="Posts by Status"
            data={[
              { label: 'Published', value: postsStats.published, color: 'bg-teal-600' },
              { label: 'Draft', value: postsStats.draft, color: 'bg-yellow-600' },
            ]}
          />
          <AnalyticsChart
            type="bar"
            title="Top Categories"
            data={postsStats.byCategory.slice(0, 10).map((item: any) => ({
              label: item._id || 'Unknown',
              value: item.count,
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;

