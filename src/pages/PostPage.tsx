import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import postService from '../services/post.service';
import commentService from '../services/comment.service';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PostContent from '../components/post/PostContent';
import CommentSection from '../components/comment/CommentSection';
import RelatedPosts from '../components/post/RelatedPosts';
import { usePostView } from '../hooks/usePostView';
import { FiUser, FiClock, FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  
  // Fetch post data
  const { data: post, isLoading: isLoadingPost } = useQuery(
    ['post', slug],
    () => postService.getPost(slug!),
    { enabled: !!slug }
  );
  
  // Track post view
  usePostView(post?._id || '');

  const { data: comments, isLoading: isLoadingComments } = useQuery(
    ['comments', post?._id],
    () => commentService.getComments(post!._id),
    { enabled: !!post?._id }
  );

  const { data: relatedPosts } = useQuery(
    ['relatedPosts', post?._id],
    () => postService.getRelatedPosts(post!._id),
    { enabled: !!post?._id }
  );

  if (isLoadingPost) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">{t('error.404')}</h1>
        <p className="text-gray-600">{t('post.noPosts')}</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Post Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>{post.category.name}</span>
          <span>•</span>
          <span>{format(new Date(post.publishedAt || post.createdAt), 'MMMM d, yyyy')}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FiUser />
            <span>{post.author.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock />
            <span>{post.readingTime} {t('post.readingTime')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiEye />
            <span>{post.views} {t('post.views')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiHeart />
            <span>{post.likes.length} {t('post.likes')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMessageCircle />
            <span>{post.commentsCount} {t('post.comments')}</span>
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <a
                key={tag._id}
                href={`/tag/${tag.slug}`}
                className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors"
              >
                #{tag.name}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-8">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      {/* Post Content */}
      <PostContent content={post.content} />

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <RelatedPosts posts={relatedPosts} />
      )}

      {/* Comments Section */}
      {post.allowComments && (
        <CommentSection
          postId={post._id}
          comments={comments?.comments || []}
          isLoading={isLoadingComments}
        />
      )}
    </article>
  );
};

export default PostPage;

