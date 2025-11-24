import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { searchAPI } from '../api/services';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Pagination from '../components/ui/Pagination';
import SearchBar from '../components/ui/SearchBar';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [page, setPage] = useState(1);

const { data, isLoading, error } = useQuery(
    ['search', query, page],
    () => searchAPI.searchPosts(query, { page, limit: 12 }),
    { enabled: !!query }
  );

  if (!query) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <FiSearch className="text-6xl text-gray-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">{t('search.searchResults')}</h1>
        <p className="text-gray-600 mb-8">{t('search.searchPlaceholder')}</p>
        <SearchBar />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="rainbow" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{t('common.error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {t('search.resultsFor')} "{query}"
        </h1>
        <SearchBar />
      </div>

      {data && data.posts.length > 0 ? (
        <>
          <p className="text-gray-600">
            Found {data.pagination?.total || data.posts.length} results
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.posts.map((post: any) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {data.pagination && data.pagination.pages > 1 && (
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.pages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <FiSearch className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('search.noResults')}</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

