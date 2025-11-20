import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import postService from '../../services/post.service';
import { useTranslation } from 'react-i18next';
import { FiTrendingUp } from 'react-icons/fi';
import LoadingSpinner from '../ui/LoadingSpinner';

const PopularPosts = () => {
  const { t } = useTranslation();
  const { data: posts, isLoading } = useQuery(
    'featuredPosts',
    () => postService.getFeaturedPosts(5)
  );

  if (isLoading) {
    return (
      <div className="card">
        <LoadingSpinner />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FiTrendingUp />
        Popular Posts
      </h3>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post._id}>
            <Link
              to={`/post/${post.slug}`}
              className="block hover:text-primary-600 transition-colors"
            >
              <h4 className="font-semibold mb-1 line-clamp-2">{post.title}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{format(new Date(post.publishedAt || post.createdAt), 'MMM d, yyyy')}</span>
                <span>•</span>
                <span>{post.views} {t('post.views')}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularPosts;

