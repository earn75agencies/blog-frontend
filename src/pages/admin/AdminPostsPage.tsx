import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import adminService from '../../services/admin.service';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import Badge from '../../components/ui/Badge';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const AdminPostsPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();

  const { data, isLoading } = useQuery(
    ['adminPosts', page, status],
    () => adminService.getAllPosts(page, 20, status),
    { enabled: true }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statusColors = {
    draft: 'secondary',
    published: 'success',
    archived: 'danger',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Post Management</h1>
        <select
          value={status || ''}
          onChange={(e) => setStatus(e.target.value || undefined)}
          className="input w-48"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {data && data.posts.length > 0 ? (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Author</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Views</th>
                  <th className="text-left p-4">Created</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.posts.map((post: any) => (
                  <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <Link
                        to={`/post/${post.slug}`}
                        className="font-medium hover:text-primary-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/author/${post.author.username}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {post.author.username}
                      </Link>
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/category/${post.category.slug}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {post.category.name}
                      </Link>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusColors[post.status as keyof typeof statusColors] as any}>
                        {post.status}
                      </Badge>
                    </td>
                    <td className="p-4">{post.views}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/post/${post.slug}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <FiEye />
                        </Link>
                        <Link
                          to={`/edit-post/${post._id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.pagination && data.pagination.pages > 1 && (
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.pages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">No posts found</p>
        </div>
      )}
    </div>
  );
};

export default AdminPostsPage;

