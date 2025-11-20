import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../ui/LoadingSpinner';
import UserCard from './UserCard';
import Pagination from '../ui/Pagination';
import { useState } from 'react';
import userService from '../../services/user.service';

interface UserListProps {
  endpoint?: string;
  queryKey?: string;
  showActions?: boolean;
}

const UserList: React.FC<UserListProps> = ({
  endpoint = '/api/users',
  queryKey = 'users',
  showActions = true,
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading } = useQuery(
    [queryKey, page],
    async () => {
      return await userService.getUsers({ page, limit });
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const users = data?.users || [];
  const totalPages = data?.pagination?.pages || 1;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {users.map((user: any) => (
          <UserCard key={user._id} user={user} showActions={showActions} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserList;

