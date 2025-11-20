import { Comment } from '../../types';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  postId: string;
}

const CommentList = ({ comments, postId }: CommentListProps) => {
  const topLevelComments = comments.filter((comment) => !comment.parentComment);

  return (
    <div className="space-y-6 mt-6">
      {topLevelComments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} postId={postId} />
      ))}
    </div>
  );
};

export default CommentList;

