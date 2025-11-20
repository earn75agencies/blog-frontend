import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
  url?: string;
  type?: string;
  author?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
}) => {
  const { i18n } = useTranslation();
  const siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:3000';
  const siteName = 'Gidix';
  const defaultImage = `${siteUrl}/og-image.png`;

  const metaTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || 'The ultimate international blogging platform';
  const metaKeywords = Array.isArray(keywords) ? keywords.join(', ') : keywords;
  const metaImage = image || defaultImage;
  const metaUrl = url || siteUrl;

  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      {author && <meta name="author" content={author} />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={siteName} />
      {author && <meta property="article:author" content={author} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={metaUrl} />
    </Helmet>
  );
};

export default SEOHead;

