import { Link } from 'react-router-dom';
import { Tag } from '../../types';
import { useTranslation } from 'react-i18next';
import { FiTag } from 'react-icons/fi';

interface TagCloudProps {
  tags: Tag[];
}

const TagCloud = ({ tags }: TagCloudProps) => {
  const { t } = useTranslation();

  // Calculate tag sizes based on usage count
  const maxUsage = Math.max(...tags.map((tag) => tag.usageCount), 1);
  const getTagSize = (usageCount: number) => {
    const ratio = usageCount / maxUsage;
    if (ratio > 0.7) return 'text-2xl font-bold';
    if (ratio > 0.4) return 'text-xl font-semibold';
    if (ratio > 0.2) return 'text-lg font-medium';
    return 'text-base';
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FiTag />
        {t('tag.popularTags')}
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag._id}
            to={`/tag/${tag.slug}`}
            className={`${getTagSize(tag.usageCount)} text-primary-600 hover:text-primary-700 hover:underline transition-colors`}
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagCloud;

