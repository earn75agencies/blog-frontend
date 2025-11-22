import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import categoryService from '../../services/category.service';
import { FiChevronDown, FiX } from 'react-icons/fi';

interface MegaMenuProps {
  onClose?: () => void;
}

const MegaMenu = ({ onClose }: MegaMenuProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: categories, isLoading } = useQuery(
    'categoryHierarchy',
    () => categoryService.getCategoryHierarchy(),
    { staleTime: 10 * 60 * 1000 } // Cache for 10 minutes
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (onClose) onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  const topLevelCategories = categories.filter((cat) => cat.level === 0);

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-gray-800 shadow-2xl max-w-7xl mx-auto my-8 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Browse All Categories</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-700 rounded transition-colors"
              aria-label="Close menu"
            >
              <FiX className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topLevelCategories.map((category) => (
              <div
                key={category._id}
                className="group relative"
                onMouseEnter={() => setHoveredCategory(category._id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  to={`/category/${category.slug}`}
                  className="block p-4 rounded-lg border-2 border-transparent hover:border-primary-500 transition-all hover:shadow-lg"
                  style={{
                    borderColor: hoveredCategory === category._id ? category.color || '#3B82F6' : 'transparent',
                  }}
                  onClick={onClose}
                >
                  <div className="flex items-start gap-3">
                    {category.icon && (
                      <span className="text-3xl flex-shrink-0">{category.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold text-lg mb-1 truncate"
                        style={{ color: category.color || '#1F2937' }}
                      >
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      {category.postsCount !== undefined && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {category.postsCount} {category.postsCount === 1 ? 'post' : 'posts'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subcategories Preview */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                          Subcategories
                        </span>
                        <FiChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories.slice(0, 3).map((subcat) => (
                          <Link
                            key={subcat._id}
                            to={`/category/${subcat.slug}`}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onClose) onClose();
                            }}
                          >
                            {subcat.name}
                          </Link>
                        ))}
                        {category.subcategories.length > 3 && (
                          <span className="text-xs px-2 py-1 text-gray-500">
                            +{category.subcategories.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {topLevelCategories.length} main categories • Explore thousands of topics
            </p>
            <Link
              to="/categories"
              className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
              onClick={onClose}
            >
              View All Categories →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;

