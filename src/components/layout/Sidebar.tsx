import { useQuery } from 'react-query';
import categoryService from '../../services/category.service';
import tagService from '../../services/tag.service';
import CategoryList from '../category/CategoryList';
import TagCloud from '../tag/TagCloud';
import Newsletter from '../ui/Newsletter';
import PopularPosts from '../post/PopularPosts';

const Sidebar = () => {

  const { data: categories } = useQuery('categories', () => categoryService.getCategories());
  const { data: popularTags } = useQuery('popularTags', () => tagService.getPopularTags(20));

  return (
    <aside className="space-y-6">
      <Newsletter />
      {categories && <CategoryList categories={categories} />}
      {popularTags && <TagCloud tags={popularTags} />}
      <PopularPosts />
    </aside>
  );
};

export default Sidebar;

