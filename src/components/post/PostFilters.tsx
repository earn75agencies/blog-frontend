import { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface PostFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  categories?: Array<{ _id: string; name: string; slug: string }>;
  tags?: Array<{ _id: string; name: string; slug: string }>;
}

interface FilterState {
  category?: string;
  tag?: string;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
  status?: 'published' | 'draft';
}

const PostFilters: React.FC<PostFiltersProps> = ({
  onFilterChange,
  categories = [],
  tags = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'newest',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = { sortBy: 'newest' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.category || filters.tag || filters.status;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FiFilter />
          Filters
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <FiX className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          {categories.length > 0 && (
            <Select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              placeholder="All Categories"
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
              ]}
            />
          )}

          {tags.length > 0 && (
            <Select
              value={filters.tag || ''}
              onChange={(e) => handleFilterChange('tag', e.target.value)}
              placeholder="All Tags"
              options={[
                { value: '', label: 'All Tags' },
                ...tags.map((tag) => ({ value: tag._id, label: tag.name })),
              ]}
            />
          )}

          <Select
            value={filters.sortBy || 'newest'}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                handleFilterChange('sortBy', value as FilterState['sortBy']);
              }
            }}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'popular', label: 'Most Popular' },
              { value: 'trending', label: 'Trending' },
            ]}
          />

          <Select
            value={filters.status || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                handleFilterChange('status', value as FilterState['status']);
              }
            }}
            placeholder="All Status"
            options={[
              { value: '', label: 'All Status' },
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default PostFilters;

