import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import categoryService from '../../services/category.service';
import { FiChevronDown } from 'react-icons/fi';
import MegaMenu from '../category/MegaMenu';

const SecondaryNav = () => {
  const { t } = useTranslation();
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  const { data: topCategories } = useQuery(
    'topCategoriesNav',
    () => categoryService.getCategories({ level: 0, limit: 12 }),
    { staleTime: 10 * 60 * 1000 }
  );

  if (!topCategories || topCategories.length === 0) {
    return null;
  }

  // Split categories: first 6 in main nav, rest in "More"
  const mainCategories = topCategories.slice(0, 6);
  const moreCategories = topCategories.slice(6);

  return (
    <nav className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0">
          {/* Primary Categories */}
          {mainCategories.map((category) => (
            <Link
              key={category._id}
              to={`/category/${category.slug}`}
              className="px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
            >
              {category.icon && <span>{category.icon}</span>}
              {category.name}
            </Link>
          ))}

          {/* More Button - Only show if there are overflow categories */}
          {moreCategories.length > 0 && (
            <button
              onClick={() => setShowMegaMenu(true)}
              className="px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
            >
              {t('nav.more')}
              <FiChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mega Menu Modal */}
      {showMegaMenu && <MegaMenu onClose={() => setShowMegaMenu(false)} />}
    </nav>
  );
};

export default SecondaryNav;
