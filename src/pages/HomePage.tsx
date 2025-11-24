import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { postAPI, categoryAPI } from '../api/services';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiArrowRight, FiBookOpen, FiUsers, FiTrendingUp, FiGlobe } from 'react-icons/fi';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { t } = useTranslation();

  const { data: featuredPosts, isLoading: isLoadingFeatured, error: featuredError } = useQuery(
    'featuredPosts',
    () => postAPI.getFeaturedPosts({ limit: 3 }),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Failed to load featured posts:', error);
      }
    }
  );

  const { data: latestPosts, isLoading: isLoadingLatest, error: latestError } = useQuery(
    'latestPosts',
    () => postAPI.getPosts({ page: 1, limit: 6, sortBy: 'publishedAt', sortOrder: 'desc' }),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Failed to load latest posts:', error);
      }
    }
  );

  const { data: categories } = useQuery(
    'homeCategories',
    () => categoryAPI.getCategories({ limit: 6 }),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white rounded-2xl p-16 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full opacity-10 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400 rounded-full opacity-5 -ml-48 -mb-48"></div>
        <div className="relative z-10">
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-100"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Welcome to Gidix
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-10 text-primary-100 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            The ultimate international blogging platform. Share your stories with the world.
          </motion.p>
          <motion.div 
            className="flex gap-4 justify-center flex-wrap"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Link to="/posts" className="btn bg-white text-primary-600 hover:bg-primary-50 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
              Explore Posts
            </Link>
            <Link to="/register" className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-3 rounded-lg transition-all">
              Start Writing
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { icon: FiBookOpen, label: '1000+', desc: 'Published Posts', color: 'from-blue-500 to-blue-600' },
          { icon: FiUsers, label: '500+', desc: 'Active Writers', color: 'from-purple-500 to-purple-600' },
          { icon: FiTrendingUp, label: '100K+', desc: 'Monthly Readers', color: 'from-green-500 to-green-600' },
          { icon: FiGlobe, label: '25+', desc: 'Countries', color: 'from-orange-500 to-orange-600' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow`}
              variants={itemVariants}
            >
              <Icon className="text-4xl mb-3 opacity-80" />
              <div className="text-3xl font-bold mb-1">{stat.label}</div>
              <div className="text-sm opacity-90">{stat.desc}</div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* Featured Posts */}
      {!!featuredError && (
        <motion.div
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>Unable to load featured posts. Please check your connection.</p>
        </motion.div>
      )}
      {isLoadingFeatured && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="md" />
        </div>
      )}
      {featuredPosts && featuredPosts.length > 0 && (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold">✨ Featured Posts</h2>
              <p className="text-gray-600 mt-2">Handpicked stories worth reading</p>
            </div>
            <Link
              to="/posts?featured=true"
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold hover:gap-3 transition-all"
            >
              View All
              <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post: any) => (
              <motion.div key={post._id} variants={itemVariants}>
                <PostCard post={post} featured />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Popular Categories */}
      {categories && categories.length > 0 && (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold">📚 {t('messages.popularCategories')}</h2>
              <p className="text-gray-600 mt-2">{t('messages.exploreTopics')}</p>
            </div>
            <Link
              to="/categories"
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold hover:gap-3 transition-all"
            >
              {t('messages.browseAll')}
              <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category: any, idx: number) => (
              <motion.div key={category._id} variants={itemVariants}>
                <Link
                  to={`/category/${category.slug}`}
                  className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-200 hover:border-primary-600 hover:bg-primary-50 transition-all group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{category.icon || '📌'}</div>
                  <h3 className="font-semibold text-center text-sm group-hover:text-primary-600 transition-colors">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{(category as any).childrenCount || 0} posts</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Latest Posts */}
      {!!latestError && (
        <motion.div
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>Unable to load latest posts. Please check your connection.</p>
        </motion.div>
      )}
      {isLoadingLatest && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="md" />
        </div>
      )}
      {latestPosts && latestPosts.posts && latestPosts.posts.length > 0 && (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold">📰 Latest Posts</h2>
              <p className="text-gray-600 mt-2">Fresh content from our community</p>
            </div>
            <Link
              to="/posts"
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold hover:gap-3 transition-all"
            >
              View All
              <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.posts.map((post: any) => (
              <motion.div key={post._id} variants={itemVariants}>
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* CTA Section */}
      <motion.section
        className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-4">Ready to Share Your Story?</h2>
        <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
          Join thousands of creators and start publishing your content today.
        </p>
        <Link to="/register" className="btn bg-white text-primary-600 hover:bg-primary-50 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
          Get Started Now
        </Link>
      </motion.section>
    </div>
  );
};

export default HomePage;

