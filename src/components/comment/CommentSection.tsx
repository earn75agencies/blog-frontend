import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import commentService from '../../services/comment.service';
import { Comment } from '../../types';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import LoadingSpinner from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  isLoading: boolean;
}

const CommentSection = ({ postId, comments: initialComments, isLoading: initialLoading }: CommentSectionProps) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: commentsData, isLoading } = useQuery(
    ['comments', postId],
    () => commentService.getComments(postId),
    { initialData: initialComments ? { comments: initialComments } : undefined }
  );

  const createCommentMutation = useMutation(
    (data: { content: string; parentComment?: string }) =>
      commentService.createComment({ ...data, post: postId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId]);
        toast.success(t('comment.commentPosted'));
      },
      onError: (error: any) => {
        toast.error(error.message || t('common.error'));
      },
    }
  );

  const comments = commentsData?.comments || [];

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6">
        {t('post.comments')} ({comments.length})
      </h2>

      {isAuthenticated ? (
        <CommentForm
          onSubmit={(content, parentComment) =>
            createCommentMutation.mutate({ content, parentComment })
          }
          isSubmitting={createCommentMutation.isLoading}
        />
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
          <p className="text-gray-600">
            <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('auth.login')}
            </a>
            {' '}{t('common.to')}{' '}{t('comment.addComment')}
          </p>
        </div>
      )}

      {isLoading || initialLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner variant="secondary" />
        </div>
      ) : comments.length > 0 ? (
        <CommentList comments={comments} postId={postId} />
      ) : (
        <p className="text-gray-500 text-center py-8">{t('comment.noComments')}</p>
      )}
    </section>
  );
};

export default CommentSection;

