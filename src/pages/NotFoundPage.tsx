import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiHome } from 'react-icons/fi';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-20">
      <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-4xl font-bold mb-4">{t('error.404')}</h2>
      <p className="text-gray-600 text-lg mb-8">{t('error.404Message')}</p>
      <Link
        to="/"
        className="btn btn-primary inline-flex items-center gap-2"
      >
        <FiHome />
        {t('error.goHome')}
      </Link>
    </div>
  );
};

export default NotFoundPage;

