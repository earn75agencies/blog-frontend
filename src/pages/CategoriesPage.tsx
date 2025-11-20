import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import categoryService from '../services/category.service';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { FiFolder, FiSearch, FiGrid, FiList, FiFilter } from 'react-icons/fi';
import { Category } from '../types';

const CategoriesPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: categories, isLoading } = useQuery('categories', () =>
    categoryService.getCategories()
  );

  const { data: hierarchy } = useQuery('categoryHierarchy', () =>
    categoryService.getCategoryHierarchy(),
    { staleTime: 10 * 60 * 1000 }
  );

  // Filter categories based on search and level
  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    let filtered = categories;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cat: Category) =>
          cat.name.toLowerCase().includes(query) ||
          (cat.description && cat.description.toLowerCase().includes(query))
      );
    }

    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter((cat: Category) => cat.level === selectedLevel);
    }

    return filtered;
  }, [categories, searchQuery, selectedLevel]);

  // Get top-level categories for filtering
  const topLevelCategories = useMemo(() => {
    if (!hierarchy) return [];
    return hierarchy.filter((cat: Category) => cat.level === 0);
  }, [hierarchy]);

  // Group categories by parent for better organization
  const groupedCategories = useMemo(() => {
    if (!hierarchy || selectedLevel !== 'all') return null;

    const groups: { [key: string]: Category[] } = {};
    hierarchy.forEach((cat: Category) => {
      if (cat.level === 0) {
        if (!groups[cat._id]) groups[cat._id] = [];
        groups[cat._id].push(cat);
      } else if (cat.parent) {
        const parentId = typeof cat.parent === 'string' ? cat.parent : cat.parent._id;
        if (!groups[parentId]) groups[parentId] = [];
        groups[parentId].push(cat);
      }
    });
    return groups;
  }, [hierarchy, selectedLevel]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.categories') || 'Browse All Categories'}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {categories?.length || 0} categories • Explore thousands of topics
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          </div>
          
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Levels</option>
            <option value="0">Main Categories</option>
            <option value="1">Subcategories</option>
            <option value="2">Sub-subcategories</option>
          </select>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-500'}`}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-500'}`}
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Found {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} matching "{searchQuery}"
        </p>
      )}

      {/* Categories Display */}
      {filteredCategories && filteredCategories.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category: Category) => (
              <Link key={category._id} to={`/category/${category.slug}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full group">
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      {category.icon ? (
                        <span className="text-3xl flex-shrink-0">{category.icon}</span>
                      ) : (
                        <FiFolder className="text-3xl text-primary-600 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h2 
                          className="text-lg font-bold mb-1 truncate group-hover:text-primary-600 transition-colors"
                          style={category.color ? { color: category.color } : {}}
                        >
                          {category.name}
                        </h2>
                        {category.level !== undefined && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Level {category.level}
                          </span>
                        )}
                      </div>
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        {category.postsCount || 0} {category.postsCount === 1 ? 'post' : 'posts'}
                      </span>
                      {category.featured && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-600 rounded text-xs font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCategories.map((category: Category) => (
              <Link key={category._id} to={`/category/${category.slug}`}>
                <Card className="hover:shadow-md transition-all cursor-pointer">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {category.icon ? (
                        <span className="text-2xl flex-shrink-0">{category.icon}</span>
                      ) : (
                        <FiFolder className="text-2xl text-primary-600 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="font-bold text-lg mb-1 truncate"
                          style={category.color ? { color: category.color } : {}}
                        >
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{category.postsCount || 0} posts</span>
                      {category.featured && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-600 rounded text-xs font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : (
        <Card className="text-center py-12">
          <FiFolder className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No categories found matching your search' : 'No categories found'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-primary-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </Card>
      )}
    </div>
  );
};

export default CategoriesPage;

