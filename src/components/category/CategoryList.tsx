import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { useTranslation } from 'react-i18next';
import { FiFolder } from 'react-icons/fi';

interface CategoryListProps {
  categories: Category[];
}

const CategoryList = ({ categories }: CategoryListProps) => {
  const { t } = useTranslation();

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FiFolder />
        {t('category.categories')}
      </h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category._id}>
            <Link
              to={`/category/${category.slug}`}
              className="flex items-center justify-between hover:text-primary-600 transition-colors"
            >
              <span>{category.name}</span>
              {category.postsCount !== undefined && (
                <span className="text-sm text-gray-500">({category.postsCount})</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;

