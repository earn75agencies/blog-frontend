import { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import bookmarkService from '../services/bookmark.service';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Pagination from '../components/ui/Pagination';
import { FiBookmark } from 'react-icons/fi';

const BookmarksPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery(
    ['bookmarks', page],
    () => bookmarkService.getBookmarks(page, 20),
    { enabled: true }
  );

  const bookmarks = data?.data?.bookmarks || [];
  const bookmarkedPosts = bookmarks.map((bookmark: any) => bookmark.post);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="warning" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <FiBookmark className="text-3xl text-primary-600" />
        <h1 className="text-3xl font-bold">Bookmarked Posts</h1>
      </div>

      {bookmarkedPosts && bookmarkedPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedPosts.map((post: any) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          {data?.data?.pagination && data.data.pagination.pages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={data.data.pagination.pages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <FiBookmark className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">You haven't bookmarked any posts yet.</p>
          <Link to="/posts" className="btn btn-primary">
            Explore Posts
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;

