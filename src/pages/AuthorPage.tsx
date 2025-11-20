import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import userService from '../services/user.service';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Pagination from '../components/ui/Pagination';
import { useState } from 'react';
import { FiUser, FiUsers, FiBook } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AuthorPage = () => {
  const { username } = useParams<{ username: string }>();
  const { t } = useTranslation();
  const { user: currentUser } = useAuthStore();
  const [page, setPage] = useState(1);

  const { data: author, isLoading: isLoadingAuthor } = useQuery(
    ['author', username],
    () => userService.getUserProfile(username!),
    { enabled: !!username }
  );

  const { data: postsData, isLoading: isLoadingPosts } = useQuery(
    ['authorPosts', author?._id, page],
    () => userService.getUserPosts(author!._id, { page, limit: 12 }),
    { enabled: !!author?._id }
  );

  const handleFollow = async () => {
    if (!author) return;
    try {
      await userService.followUser(author._id);
      toast.success('Successfully followed user');
      // TODO: Refresh author data
    } catch (error: any) {
      toast.error(error.message || 'Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    if (!author) return;
    try {
      await userService.unfollowUser(author._id);
      toast.success('Successfully unfollowed user');
      // TODO: Refresh author data
    } catch (error: any) {
      toast.error(error.message || 'Failed to unfollow user');
    }
  };

  if (isLoadingAuthor) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">{t('error.404')}</h1>
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  const isFollowing = author.followers?.some((follower: any) => follower._id === currentUser?._id);
  const isOwnProfile = currentUser?._id === author._id;

  return (
    <div className="space-y-6">
      {/* Author Header */}
      <div className="card">
        <div className="flex items-start gap-6">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.username}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-4xl font-bold">
              {author.username.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{author.username}</h1>
                {(author.firstName || author.lastName) && (
                  <p className="text-gray-600 text-lg">
                    {author.firstName} {author.lastName}
                  </p>
                )}
              </div>

              {!isOwnProfile && (
                <button
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  className="btn btn-primary"
                >
                  {isFollowing ? t('user.unfollow') : t('user.follow')}
                </button>
              )}
            </div>

            {author.bio && (
              <p className="text-gray-700 mb-4">{author.bio}</p>
            )}

            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <FiBook />
                <span>{author.postsCount || 0} {t('post.posts')}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers />
                <span>{author.followers?.length || 0} {t('user.followers')}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUser />
                <span>{author.following?.length || 0} {t('user.following')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">{t('post.posts')}</h2>
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
    </div>
  );
};

export default AuthorPage;

