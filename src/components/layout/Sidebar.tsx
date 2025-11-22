import { useQuery } from 'react-query';
import tagService from '../../services/tag.service';
import TagCloud from '../tag/TagCloud';
import PopularPosts from '../post/PopularPosts';

const Sidebar = () => {
  const { data: popularTags } = useQuery('popularTags', () => tagService.getPopularTags(20));

  return (
    <aside className="space-y-6">
      {/* Popular Posts */}
      <PopularPosts />

      {/* Popular Tags */}
      {popularTags && <TagCloud tags={popularTags} />}
    </aside>
  );
};

export default Sidebar;

