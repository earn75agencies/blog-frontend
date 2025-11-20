import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import userService from '../../services/user.service';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { FiUserPlus, FiUserMinus, FiMail, FiMapPin, FiCalendar } from 'react-icons/fi';

interface UserCardProps {
  user: {
    _id: string;
    username: string;
    email?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    followersCount?: number;
    followingCount?: number;
    postsCount?: number;
    createdAt?: string;
    isFollowing?: boolean;
    isVerified?: boolean;
  };
  showActions?: boolean;
  className?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  showActions = true,
  className = '',
}) => {
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const isOwnProfile = currentUser?._id === user._id;

  const followMutation = useMutation(
    () => userService.followUser(user._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', user._id]);
        queryClient.invalidateQueries('users');
        toast.success(`Now following ${user.username}`);
      },
      onError: () => {
        toast.error('Failed to follow user');
      },
    }
  );

  const unfollowMutation = useMutation(
    () => userService.unfollowUser(user._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', user._id]);
        queryClient.invalidateQueries('users');
        toast.success(`Unfollowed ${user.username}`);
      },
      onError: () => {
        toast.error('Failed to unfollow user');
      },
    }
  );

  const handleFollow = () => {
    if (user.isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <Link to={`/users/${user._id}`}>
          <Avatar src={user.avatar} name={user.username} size="lg" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={`/users/${user._id}`}
              className="font-bold text-lg hover:text-primary-600 transition-colors"
            >
              {user.username}
            </Link>
            {user.isVerified && (
              <Badge variant="info" size="sm">Verified</Badge>
            )}
          </div>
          {user.bio && (
            <p className="text-gray-600 text-sm mb-3">{user.bio}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {user.location && (
              <div className="flex items-center gap-1">
                <FiMapPin />
                <span>{user.location}</span>
              </div>
            )}
            {user.createdAt && (
              <div className="flex items-center gap-1">
                <FiCalendar />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-bold">{user.postsCount || 0}</span>
            <span className="text-gray-500 ml-1">Posts</span>
          </div>
          <div>
            <span className="font-bold">{user.followersCount || 0}</span>
            <span className="text-gray-500 ml-1">Followers</span>
          </div>
          <div>
            <span className="font-bold">{user.followingCount || 0}</span>
            <span className="text-gray-500 ml-1">Following</span>
          </div>
        </div>
      </div>

      {showActions && !isOwnProfile && (
        <Button
          variant={user.isFollowing ? 'outline' : 'primary'}
          onClick={handleFollow}
          disabled={followMutation.isLoading || unfollowMutation.isLoading}
          className="w-full"
        >
          {user.isFollowing ? (
            <>
              <FiUserMinus className="mr-2" />
              Unfollow
            </>
          ) : (
            <>
              <FiUserPlus className="mr-2" />
              Follow
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default UserCard;

