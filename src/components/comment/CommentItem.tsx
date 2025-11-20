import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { formatDistance } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import commentService from '../../services/comment.service';
import { Comment } from '../../types';
import CommentForm from './CommentForm';
import { FiHeart, FiCornerUpRight, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

const CommentItem = ({ comment, postId }: CommentItemProps) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const likeMutation = useMutation(
    () => commentService.likeComment(comment._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId]);
      },
    }
  );

  const deleteMutation = useMutation(
    () => commentService.deleteComment(comment._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId]);
        toast.success(t('comment.commentDeleted'));
      },
      onError: (error: any) => {
        toast.error(error.message || t('common.error'));
      },
    }
  );

  const isLiked = user && comment.likes.includes(user._id);
  const isAuthor = user && comment.author._id === user._id;
  const canEdit = isAuthor;
  const canDelete = isAuthor || user?.role === 'admin';

  return (
    <div className="border-l-2 border-gray-200 pl-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          {comment.author.avatar ? (
            <img
              src={comment.author.avatar}
              alt={comment.author.username}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
              {comment.author.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-semibold">{comment.author.username}</div>
            <div className="text-sm text-gray-500">
              {formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => likeMutation.mutate()}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              isLiked
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiHeart className={isLiked ? 'fill-current' : ''} />
            <span>{comment.likes.length}</span>
          </button>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <FiCornerUpRight />
            {t('comment.reply')}
          </button>

          {canEdit && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <FiEdit2 />
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => {
                if (confirm(t('common.confirmDelete'))) {
                  deleteMutation.mutate();
                }
              }}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        {isEditing ? (
          <CommentForm
            initialContent={comment.content}
            onSubmit={async (content) => {
              try {
                await commentService.updateComment(comment._id, { content });
                queryClient.invalidateQueries(['comments', postId]);
                setIsEditing(false);
                toast.success(t('comment.commentUpdated') || 'Comment updated successfully');
              } catch (error: any) {
                toast.error(error.response?.data?.message || t('common.error') || 'Failed to update comment');
              }
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
        )}
      </div>

      {isReplying && (
        <div className="ml-8 mt-4">
          <CommentForm
            onSubmit={async (content) => {
              try {
                await commentService.createComment({
                  content,
                  post: postId,
                  parentComment: comment._id,
                });
                queryClient.invalidateQueries(['comments', postId]);
                setIsReplying(false);
                toast.success(t('comment.replyPosted') || 'Reply posted successfully');
              } catch (error: any) {
                toast.error(error.response?.data?.message || t('common.error') || 'Failed to post reply');
              }
            }}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply._id} comment={reply} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;

