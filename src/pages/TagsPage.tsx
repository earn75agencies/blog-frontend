import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import tagService from '../services/tag.service';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';
import { FiTag } from 'react-icons/fi';
import { useState } from 'react';
import Pagination from '../components/ui/Pagination';

const TagsPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data: tagsData, isLoading } = useQuery(
    ['tags', page],
    () => tagService.getTags(page, 50)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="secondary" />
      </div>
    );
  }

  const tags = tagsData?.tags || [];
  const pagination = tagsData?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.tags') || 'Tags'}</h1>
        <p className="text-gray-600">
          {t('tags.description') || 'Explore posts by tags'}
        </p>
      </div>

      {tags && tags.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Link
                key={tag._id}
                to={`/tag/${tag.slug}`}
                className="inline-block"
              >
                <Badge
                  variant="secondary"
                  className="text-base px-4 py-2 hover:bg-primary-100 hover:text-primary-600 transition-colors cursor-pointer"
                >
                  <FiTag className="inline mr-1" />
                  {tag.name}
                  {tag.usageCount !== undefined && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({tag.usageCount})
                    </span>
                  )}
                </Badge>
              </Link>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <FiTag className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('tags.noTags') || 'No tags found'}</p>
        </div>
      )}
    </div>
  );
};

export default TagsPage;


