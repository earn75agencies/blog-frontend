import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSend } from 'react-icons/fi';

interface CommentFormProps {
  onSubmit: (content: string, parentComment?: string) => void | Promise<void>;
  onCancel?: () => void;
  initialContent?: string;
  isSubmitting?: boolean;
  parentComment?: string;
}

const CommentForm = ({
  onSubmit,
  onCancel,
  initialContent = '',
  isSubmitting = false,
  parentComment,
}: CommentFormProps) => {
  const { t } = useTranslation();
  const [content, setContent] = useState(initialContent);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      await onSubmit(content.trim(), parentComment);
      if (!initialContent) {
        setContent('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t('comment.commentPlaceholder')}
        className="textarea"
        rows={4}
        required
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSend />
          {isSubmitting ? t('comment.postingComment') : t('common.submit')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            {t('common.cancel')}
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;

