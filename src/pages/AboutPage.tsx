import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import { FiUsers, FiTarget, FiAward, FiHeart } from 'react-icons/fi';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('about.title') || 'About Gidix'}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('about.subtitle') || 'A modern blogging platform for creators worldwide'}
        </p>
      </div>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">{t('about.ourMission') || 'Our Mission'}</h2>
        <p className="text-gray-700 leading-relaxed">
          {t('about.missionText') || 
            'Gidix is dedicated to empowering creators by providing them with a powerful, ' +
            'flexible, and user-friendly platform to share their stories, ideas, and expertise ' +
            'with the world. We believe in the power of storytelling and aim to make content ' +
            'creation accessible to everyone.'}
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center p-6">
          <FiUsers className="text-4xl text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">{t('about.forCreators') || 'For Creators'}</h3>
          <p className="text-gray-600">
            {t('about.forCreatorsText') || 'Designed with creators in mind, offering powerful tools and features.'}
          </p>
        </Card>

        <Card className="text-center p-6">
          <FiTarget className="text-4xl text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">{t('about.globalReach') || 'Global Reach'}</h3>
          <p className="text-gray-600">
            {t('about.globalReachText') || 'Reach audiences worldwide with multi-language support.'}
          </p>
        </Card>

        <Card className="text-center p-6">
          <FiAward className="text-4xl text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">{t('about.quality') || 'Quality First'}</h3>
          <p className="text-gray-600">
            {t('about.qualityText') || 'Focus on delivering high-quality content and experiences.'}
          </p>
        </Card>

        <Card className="text-center p-6">
          <FiHeart className="text-4xl text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">{t('about.community') || 'Community'}</h3>
          <p className="text-gray-600">
            {t('about.communityText') || 'Building a vibrant community of creators and readers.'}
          </p>
        </Card>
      </div>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">{t('about.whyGidix') || 'Why Gidix?'}</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>{t('about.feature1') || 'AI-powered content creation and optimization tools'}</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>{t('about.feature2') || 'Comprehensive monetization options for creators'}</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>{t('about.feature3') || 'Advanced analytics and insights'}</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>{t('about.feature4') || 'Multi-platform content syndication'}</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>{t('about.feature5') || 'Gamification and engagement features'}</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default AboutPage;


