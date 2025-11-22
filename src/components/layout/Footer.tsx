import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiFacebook, FiTwitter, FiInstagram, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { useState } from 'react';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribeMessage('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setSubscribeMessage(''), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2">{t('footer.stayUpdated')}</h3>
            <p className="text-gray-400 text-sm mb-4">{t('footer.getLatestPosts')}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailAddress')}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <FiMail className="w-4 h-4" />
                {t('footer.subscribe')}
              </button>
            </form>
            {subscribeMessage && (
              <p className="text-green-400 text-sm mt-2">{t('footer.thankYouSubscribe')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary-400">Gidix</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.gidixDescription')}
            </p>
          </div>

          {/* Content */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.content')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/posts" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.allPosts')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('nav.categories')}
                </Link>
              </li>
              <li>
                <Link to="/tags" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('nav.tags')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.platform')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.sitemap')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.termsConditions')}
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.cookiePolicy')}
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.connect')}</h4>
            <div className="flex gap-4 flex-wrap">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Facebook"
              >
                <FiFacebook className="text-xl" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Twitter"
              >
                <FiTwitter className="text-xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Instagram"
              >
                <FiInstagram className="text-xl" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="GitHub"
              >
                <FiGithub className="text-xl" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <FiLinkedin className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Gidix. {t('footer.copyright')}
            </p>
            <div className="flex gap-4 text-xs text-gray-500">
              <a href="/privacy" className="hover:text-gray-400 transition-colors">
                {t('footer.privacyPolicy')}
              </a>
              <span>•</span>
              <a href="/terms" className="hover:text-gray-400 transition-colors">
                {t('footer.termsConditions')}
              </a>
              <span>•</span>
              <a href="/cookies" className="hover:text-gray-400 transition-colors">
                {t('footer.cookiePolicy')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

