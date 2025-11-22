import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import categoryService from '../services/category.service';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FiFolder, FiSearch, FiChevronDown, FiChevronUp, FiTag, FiArrowRight } from 'react-icons/fi';
import { Category } from '../types';

const CategoriesPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: hierarchy, isLoading } = useQuery('categoryHierarchy', () =>
    categoryService.getCategoryHierarchy(),
    { staleTime: 10 * 60 * 1000 }
  );

  // Group categories by parent
  const groupedHierarchy = useMemo(() => {
    if (!hierarchy) return { root: [], grouped: {} };

    const grouped: { [key: string]: Category[] } = {};
    const root: Category[] = [];

    hierarchy.forEach((cat: Category) => {
      if (cat.level === 0) {
        root.push(cat);
        grouped[cat._id] = [];
      }
    });

    hierarchy.forEach((cat: Category) => {
      if ((cat.level ?? 0) > 0 && cat.parent) {
        const parentId = typeof cat.parent === 'string' ? cat.parent : (cat.parent as any)?._id || '';
        if (parentId && grouped[parentId]) {
          grouped[parentId].push(cat);
        }
      }
    });

    return { root, grouped };
  }, [hierarchy]);

  // Filter categories based on search
  const filteredHierarchy = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedHierarchy;
    }

    const query = searchQuery.toLowerCase();
    const filteredRoot = groupedHierarchy.root.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        (cat.description && cat.description.toLowerCase().includes(query))
    );

    const filteredGrouped: { [key: string]: Category[] } = {};

    filteredRoot.forEach((parent) => {
      filteredGrouped[parent._id] = (groupedHierarchy.grouped[parent._id] || []).filter(
        (cat) =>
          cat.name.toLowerCase().includes(query) ||
          (cat.description && cat.description.toLowerCase().includes(query))
      );
    });

    return { root: filteredRoot, grouped: filteredGrouped };
  }, [groupedHierarchy, searchQuery]);

  const toggleParent = (parentId: string) => {
    const newExpanded = new Set(expandedParents);
    if (newExpanded.has(parentId)) {
      newExpanded.delete(parentId);
    } else {
      newExpanded.add(parentId);
    }
    setExpandedParents(newExpanded);
  };

  // Calculate total posts and subcategories for a parent
  const getParentStats = (parentId: string) => {
    const subcats = filteredHierarchy.grouped[parentId] || [];
    const parentCat = filteredHierarchy.root.find((c) => c._id === parentId);
    const postsCount = (parentCat?.postsCount || 0) + subcats.reduce((sum, c) => sum + (c.postsCount || 0), 0);
    return { subcatsCount: subcats.length, postsCount };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="primary" />
      </div>
    );
  }

  const hasResults = filteredHierarchy.root.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">{t('nav.categories') || 'Browse Categories'}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore {hierarchy?.length || 0} topics across {filteredHierarchy.root.length} main categories
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search categories, subcategories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-lg"
        />
      </div>

      {/* Results Info */}
      {searchQuery && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <p>
            Showing {filteredHierarchy.root.length} main {filteredHierarchy.root.length === 1 ? 'category' : 'categories'}
            {Object.values(filteredHierarchy.grouped).flat().length > 0 &&
              ` with ${Object.values(filteredHierarchy.grouped).flat().length} matching subcategories`}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-primary-600 hover:underline font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Categories List */}
      {hasResults ? (
        <div className="space-y-4">
          {filteredHierarchy.root.map((parentCategory) => {
            const isExpanded = expandedParents.has(parentCategory._id);
            const subcategories = filteredHierarchy.grouped[parentCategory._id] || [];
            const stats = getParentStats(parentCategory._id);
            const isSelected = selectedCategory === parentCategory._id;

            return (
              <div key={parentCategory._id}>
                {/* Parent Category Card */}
                <Card
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-primary-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {parentCategory.icon ? (
                          <span className="text-4xl">{parentCategory.icon}</span>
                        ) : (
                          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <FiFolder className="text-2xl text-primary-600" />
                          </div>
                        )}
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <Link to={`/category/${parentCategory.slug}`}>
                              <h2
                                className="text-2xl font-bold hover:text-primary-600 transition-colors truncate"
                                style={parentCategory.color ? { color: parentCategory.color } : {}}
                              >
                                {parentCategory.name}
                              </h2>
                            </Link>
                            {parentCategory.featured && (
                              <span className="inline-block mt-1 px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-xs font-semibold">
                                ⭐ Featured
                              </span>
                            )}
                          </div>

                          {/* Toggle Button */}
                          {subcategories.length > 0 && (
                            <button
                              onClick={() => toggleParent(parentCategory._id)}
                              className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                              title={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              {isExpanded ? (
                                <FiChevronUp className="text-xl text-primary-600" />
                              ) : (
                                <FiChevronDown className="text-xl text-gray-400" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Description */}
                        {parentCategory.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {parentCategory.description}
                          </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            📝 {stats.postsCount} {stats.postsCount === 1 ? 'post' : 'posts'}
                          </span>
                          {subcategories.length > 0 && (
                            <span className="flex items-center gap-1">
                              <FiTag className="text-xs" />
                              {subcategories.length} {subcategories.length === 1 ? 'subcategory' : 'subcategories'}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                          <Link to={`/category/${parentCategory.slug}`} className="flex-1">
                            <Button
                              variant="primary"
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedCategory(parentCategory._id);
                              }}
                            >
                              View Posts
                              <FiArrowRight className="text-sm" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Subcategories (Expandable) */}
                {subcategories.length > 0 && isExpanded && (
                  <div className="mt-3 ml-8 space-y-2 border-l-2 border-primary-200 dark:border-primary-900 pl-4">
                    {subcategories.map((subcat) => (
                      <Link
                        key={subcat._id}
                        to={`/category/${subcat.slug}`}
                        className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors truncate flex items-center gap-2">
                              {subcat.icon && <span>{subcat.icon}</span>}
                              {subcat.name}
                            </h3>
                            {subcat.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                                {subcat.description}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {subcat.postsCount || 0} posts
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-16">
          <FiSearch className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No categories match your search' : 'No categories found'}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              className="mt-4 mx-auto"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </Button>
          )}
        </Card>
      )}

      {/* Quick Stats Footer */}
      {hasResults && (
        <Card className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {filteredHierarchy.root.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Main Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {Object.values(filteredHierarchy.grouped).flat().length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Subcategories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {hierarchy?.reduce((sum, cat) => sum + (cat.postsCount || 0), 0) || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Posts</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CategoriesPage;

