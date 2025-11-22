import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../ui/LanguageSelector';
import NotificationBell from '../notification/NotificationBell';
import ThemeToggle from '../ui/ThemeToggle';
import CategoryNav from '../category/CategoryNav';
import { FiUser, FiLogOut, FiMenu, FiX, FiChevronDown, FiSearch } from 'react-icons/fi';
import { useState } from 'react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserDropdownOpen(false);
  };

  const mainNavItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600 flex-shrink-0">
            Gidix
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 flex-1 ml-8">
            {/* Main Nav Items */}
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}

            {/* Browse Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => navigate('/categories')}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium flex items-center gap-1"
              >
                {t('nav.categories')}
                <FiChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Search Icon */}
            <button
              onClick={() => navigate('/posts?search=')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              title={t('nav.search') || 'Search'}
            >
              <FiSearch className="text-xl" />
            </button>
          </div>

          {/* Right Side - Theme & Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications & User Menu */}
            {isAuthenticated ? (
              <>
                <NotificationBell />

                {/* User Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiUser />
                    <span className="text-sm font-medium truncate max-w-[100px]">
                      {user?.username}
                    </span>
                    <FiChevronDown className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        {t('nav.profile')}
                      </Link>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        {t('nav.dashboard')}
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        {t('nav.settings')}
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-t border-gray-200 dark:border-gray-600"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-200 dark:border-gray-600 flex items-center gap-2"
                      >
                        <FiLogOut className="w-4 h-4" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn btn-primary">
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isMobileMenuOpen ? (
              <FiX className="text-2xl" />
            ) : (
              <FiMenu className="text-2xl" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/categories"
              className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.categories')}
            </Link>
            <Link
              to="/posts?search="
              className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.search') || 'Search'}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/profile"
                  className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.profile') || 'Profile'}
                </Link>
                <Link
                  to="/settings"
                  className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.settings') || 'Settings'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 px-0"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

