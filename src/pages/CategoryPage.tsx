import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import categoryService from '../services/category.service';
import postService from '../services/post.service';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Pagination from '../components/ui/Pagination';
import { useState } from 'react';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data: category, isLoading: isLoadingCategory } = useQuery(
    ['category', slug],
    () => categoryService.getCategory(slug!),
    { enabled: !!slug }
  );

  const { data: postsData, isLoading: isLoadingPosts } = useQuery(
    ['categoryPosts', category?._id, page],
    () => categoryService.getCategoryPosts(category!._id, { page, limit: 12 }),
    { enabled: !!category?._id }
  );

  if (isLoadingCategory) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="success" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">{t('error.404')}</h1>
        <p className="text-gray-600">{t('category.noCategories')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-8">
        <div className="flex items-center gap-3 mb-4">
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold">{category.name}</h1>
            {category.postsCount !== undefined && (
              <p className="text-primary-100 mt-1">
                {category.postsCount} {t('post.posts')}
              </p>
            )}
          </div>
        </div>
        {category.description && (
          <p className="text-primary-100 text-lg">{category.description}</p>
        )}
      </div>

      {/* Posts Grid */}
      {isLoadingPosts ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" variant="success" />
        </div>
      ) : postsData && postsData.posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsData.posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {postsData.pagination && postsData.pagination.pages > 1 && (
            <Pagination
              currentPage={postsData.pagination.page}
              totalPages={postsData.pagination.pages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('post.noPosts')}</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

