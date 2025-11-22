import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import categoryService from '../../services/category.service';
import { FiChevronDown } from 'react-icons/fi';
import MegaMenu from './MegaMenu';

const CategoryNav = () => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const { data: topCategories } = useQuery(
    'topCategories',
    () => categoryService.getCategories({ level: 0, limit: 8 }),
    { staleTime: 10 * 60 * 1000 }
  );

  return (
    <>
      <div className="hidden lg:flex items-center gap-1">
        {/* Top Categories Quick Links */}
        {topCategories && topCategories.length > 0 && (
          <>
            {topCategories.slice(0, 6).map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                style={{
                  color: hoveredCategory === category._id ? category.color || '#3B82F6' : undefined,
                }}
                onMouseEnter={() => setHoveredCategory(category._id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {category.icon && <span className="mr-1">{category.icon}</span>}
                {category.name}
              </Link>
            ))}
          </>
        )}

        {/* Browse All Button */}
        <button
          onClick={() => setShowMegaMenu(true)}
          className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-1"
        >
          Browse All
          <FiChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile: Simple dropdown */}
      <div className="lg:hidden">
        <select
          onChange={(e) => {
            if (e.target.value) {
              window.location.href = `/category/${e.target.value}`;
            }
          }}
          className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border-0 text-sm"
          defaultValue=""
        >
          <option value="">Select Category</option>
          {topCategories?.map((category) => (
            <option key={category._id} value={category.slug}>
              {category.icon} {category.name}
            </option>
          ))}
          <option value="all">View All Categories</option>
        </select>
      </div>

      {/* Mega Menu Modal */}
      {showMegaMenu && <MegaMenu onClose={() => setShowMegaMenu(false)} />}
    </>
  );
};

export default CategoryNav;

