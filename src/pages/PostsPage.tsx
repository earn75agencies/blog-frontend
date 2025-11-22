import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import postService from '../services/post.service';
import categoryService from '../services/category.service';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Pagination from '../components/ui/Pagination';
import SearchBar from '../components/ui/SearchBar';
import { FiChevronDown, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const PostsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'publishedAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  
  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const search = searchParams.get('search') || undefined;

  const { data, isLoading, error } = useQuery(
    ['posts', page, category, tag, search, sortBy, sortOrder],
    () => postService.getPosts({
      page,
      limit: 12,
      category,
      tags: tag ? [tag] : undefined,
      search,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
    })
  );

  const { data: categories } = useQuery(
    'postsPageCategories',
    () => categoryService.getCategories({ limit: 50 }),
    { retry: 1, refetchOnWindowFocus: false }
  );

  const handlePageChange = (newPage: number) => {
    setSearchParams({ ...Object.fromEntries(searchParams), page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (catId: string) => {
    const params = Object.fromEntries(searchParams);
    if (catId) {
      params['category'] = catId;
    } else {
      delete params['category'];
    }
    params['page'] = '1';
    setSearchParams(params);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    const params = Object.fromEntries(searchParams);
    params['sortBy'] = newSortBy;
    params['sortOrder'] = newSortOrder;
    params['page'] = '1';
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setSortBy('publishedAt');
    setSortOrder('desc');
  };

  const hasActiveFilters = category || tag || search;

  const activeFiltersContent = hasActiveFilters ? (
    <div className="flex items-center gap-2 flex-wrap p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
      <span className="text-sm text-gray-600 font-medium">Active filters:</span>
      {category && categories && (
        <span className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full">
          Category: {categories?.find((c: any) => c._id === category)?.name || 'Unknown'}
        </span>
      )}
      {tag && (
        <span className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full">
          Tag: {tag}
        </span>
      )}
      {search && (
        <span className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full">
          Search: {search}
        </span>
      )}
    </div>
  ) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-900">
            Explore Posts
          </h1>
          <p className="text-xl text-gray-600 mt-3">
            Discover amazing stories from our community
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <SearchBar />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all font-semibold ${
              showFilters
                ? 'border-primary-600 bg-primary-50 text-primary-600'
                : 'border-gray-300 hover:border-primary-600'
            }`}
          >
            Filters
            <FiChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 space-y-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Category Filter */}
          {categories && categories.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Category</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    !category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border-2 border-gray-300 hover:border-primary-600'
                  }`}
                >
                  All
                </button>
                {categories.slice(0, 11).map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryChange(cat._id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all truncate ${
                      category === cat._id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border-2 border-gray-300 hover:border-primary-600'
                    }`}
                    title={cat.name}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort Options */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Sort By</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { value: 'publishedAt', label: 'Latest' },
                { value: 'views', label: 'Most Views' },
                { value: 'likes', label: 'Most Liked' },
                { value: 'title', label: 'Alphabetical' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value, sortOrder === 'desc' ? 'asc' : 'desc')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border-2 border-gray-300 hover:border-primary-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg border-2 border-red-300 hover:bg-red-100 transition-all font-semibold"
            >
              <FiX />
              Clear All Filters
            </button>
          )}
        </motion.div>
      )}

      {activeFiltersContent as any}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          className="text-center py-12 bg-red-50 rounded-lg border-2 border-red-200 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-red-600 text-lg font-semibold">Unable to load posts. Please try again later.</p>
        </motion.div>
      )}

      {/* Posts Grid */}
      {data && data.posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-medium">
              Showing {((page - 1) * 12) + 1} to {Math.min(page * 12, data.pagination?.total || 0)} of {data.pagination?.total || 0} posts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.posts.map((post, idx) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>

          {data.pagination && data.pagination.pages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.pages}
                onPageChange={handlePageChange}
              />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {data && data.posts.length === 0 && !isLoading && (
        <motion.div
          className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-3xl mb-4">📭</p>
          <p className="text-xl font-semibold text-gray-600 mb-3">{t('messages.noPostsFound')}</p>
          <p className="text-gray-500 mb-6">
            {search
              ? `${t('messages.noPostsMatch')} "${search}"`
              : category
              ? t('messages.noPostsCategory')
              : t('messages.startExploring')}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              {t('messages.clearFilters')}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default PostsPage;

