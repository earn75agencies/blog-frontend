import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../ui/LanguageSelector';
import NotificationBell from '../notification/NotificationBell';
import ThemeToggle from '../ui/ThemeToggle';
import CategoryNav from '../category/CategoryNav';
import { FiUser, FiLogOut, FiMenu, FiSettings } from 'react-icons/fi';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Gidix
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-primary-600 transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/posts" className="hover:text-primary-600 transition-colors">
              {t('nav.posts')}
            </Link>
            <CategoryNav />
            <Link to="/tags" className="hover:text-primary-600 transition-colors">
              {t('nav.tags')}
            </Link>

            <LanguageSelector />
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hover:text-primary-600 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="hover:text-primary-600 transition-colors"
                >
                  {t('nav.dashboard')}
                </Link>
                <NotificationBell />
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                >
                  <FiUser />
                  {user?.username}
                </Link>
                <Link
                  to="/settings"
                  className="hover:text-primary-600 transition-colors"
                >
                  <FiSettings />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:text-red-600 transition-colors"
                >
                  <FiLogOut />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden">
            <FiMenu className="text-2xl" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;

