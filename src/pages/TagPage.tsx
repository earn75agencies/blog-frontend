import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import tagService from '../services/tag.service';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Pagination from '../components/ui/Pagination';
import { useState } from 'react';

const TagPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data: tag, isLoading: isLoadingTag } = useQuery(
    ['tag', slug],
    () => tagService.getTag(slug!),
    { enabled: !!slug }
  );

  const { data: postsData, isLoading: isLoadingPosts } = useQuery(
    ['tagPosts', tag?._id, page],
    () => tagService.getTagPosts(tag!._id, { page, limit: 12 }),
    { enabled: !!tag?._id }
  );

  if (isLoadingTag) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">{t('error.404')}</h1>
        <p className="text-gray-600">{t('tag.noTags')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tag Header */}
      <div className="card bg-gradient-to-r from-secondary-500 to-secondary-700 text-white">
        <h1 className="text-4xl font-bold mb-2">#{tag.name}</h1>
        {tag.description && (
          <p className="text-secondary-100 text-lg mb-2">{tag.description}</p>
        )}
        <p className="text-secondary-200">
          {tag.usageCount} {t('post.posts')}
        </p>
      </div>

      {/* Posts Grid */}
      {isLoadingPosts ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
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

export default TagPage;

