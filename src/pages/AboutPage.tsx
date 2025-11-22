import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import { FiUsers, FiTarget, FiAward, FiHeart, FiCheckCircle, FiCode, FiBarChart, FiGlobe } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const { t } = useTranslation();

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
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-900">
          About Gidix
        </h1>
        <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A modern blogging platform empowering creators worldwide to share their stories and build engaged communities.
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.section
        className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-12 border-2 border-primary-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
            <span className="text-5xl">🎯</span> Our Mission
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Gidix is dedicated to empowering creators by providing them with a powerful, flexible, and user-friendly platform to share their stories, ideas, and expertise with the world. We believe in the power of storytelling and aim to make content creation accessible to everyone, regardless of their technical background.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our vision is to create a global community where diverse voices are heard, celebrated, and monetized fairly. We're committed to building tools that help creators succeed while fostering meaningful connections between writers and readers.
          </p>
        </div>
      </motion.section>

      {/* Core Values */}
      <motion.section
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FiUsers, title: 'For Creators', desc: 'Designed with creators in mind, offering powerful tools and features to bring your vision to life.' },
            { icon: FiGlobe, title: 'Global Reach', desc: 'Connect with audiences worldwide with multi-language support and culturally diverse communities.' },
            { icon: FiAward, title: 'Quality First', desc: 'Focused on delivering high-quality content creation tools and exceptional user experiences.' },
            { icon: FiHeart, title: 'Community', desc: 'Building a vibrant ecosystem where creators and readers form meaningful, lasting connections.' },
          ].map((value, idx) => {
            const Icon = value.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="h-full text-center p-8 hover:shadow-xl transition-all hover:scale-105">
                  <Icon className="text-5xl text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Why Gidix */}
      <motion.section
        className="space-y-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-center">Why Choose Gidix?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            { icon: FiCode, title: 'AI-Powered Tools', desc: 'Advanced AI content creation, optimization, and suggestions to enhance your writing.' },
            { icon: FiBarChart, title: 'Detailed Analytics', desc: 'Comprehensive insights into your audience, engagement, and content performance metrics.' },
            { icon: FiTarget, title: 'Monetization', desc: 'Multiple revenue streams including subscriptions, tips, ads, and partnerships.' },
            { icon: FiGlobe, title: 'Global Platform', desc: '25+ countries, 20+ languages, reaching millions of readers monthly.' },
            { icon: FiHeart, title: 'Community Features', desc: 'Gamification, followers, collaborations, and engagement tools built-in.' },
            { icon: FiCheckCircle, title: 'Easy Publishing', desc: 'Intuitive editor with rich formatting, media embedding, and scheduling.' },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                className="flex gap-6 p-6 rounded-lg border-2 border-gray-200 hover:border-primary-600 hover:bg-primary-50 transition-all"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Icon className="text-4xl text-primary-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {[
          { number: '1000+', label: 'Published Posts' },
          { number: '500+', label: 'Active Creators' },
          { number: '100K+', label: 'Monthly Readers' },
          { number: '25+', label: 'Countries' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="bg-gradient-to-br from-primary-600 to-primary-700 text-white p-8 rounded-xl text-center hover:shadow-xl transition-all"
            variants={itemVariants}
          >
            <div className="text-4xl font-bold mb-2">{stat.number}</div>
            <div className="text-primary-100">{stat.label}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-4">Join Our Creator Community</h2>
        <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
          Start your journey with Gidix today and share your unique voice with the world.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register" className="btn bg-white text-primary-600 hover:bg-primary-50 font-semibold px-8 py-3 rounded-lg">
            Create Account
          </Link>
          <Link to="/posts" className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-3 rounded-lg">
            Explore Posts
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;


