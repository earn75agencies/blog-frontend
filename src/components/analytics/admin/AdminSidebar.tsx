import { Link, useLocation } from 'react-router-dom';
import { FiLayout, FiUsers, FiFileText, FiSettings, FiBarChart2 } from 'react-icons/fi';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <FiLayout /> },
    { path: '/admin/users', label: 'Users', icon: <FiUsers /> },
    { path: '/admin/posts', label: 'Posts', icon: <FiFileText /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
    { path: '/admin/settings', label: 'Settings', icon: <FiSettings /> },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-primary-100 text-primary-600 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;

