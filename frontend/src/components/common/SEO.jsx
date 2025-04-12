import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { getSecurityHeaders } from '../../utils/security';

/**
 * SEO component for optimizing page metadata
 */
const SEO = ({
  title,
  description,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard,
  noIndex = false,
  schemaData,
  keywords
}) => {
  // Get security headers for meta tags
  const securityHeaders = getSecurityHeaders();
  
  return (
    <Helmet>
      {/* Primary meta tags */}
      <title>{title ? `${title} | Ibn Sina Health` : 'Ibn Sina Health - Your Medical Companion'}</title>
      {description && <meta name="description" content={description} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph tags */}
      <meta property="og:site_name" content="Ibn Sina Health" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle || title || 'Ibn Sina Health'} />
      <meta property="og:description" content={ogDescription || description || 'Your complete healthcare companion'} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content={twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={ogTitle || title || 'Ibn Sina Health'} />
      <meta name="twitter:description" content={ogDescription || description || 'Your complete healthcare companion'} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Search engine directives */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Structured data for SEO */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
      
      {/* Keywords for older search engines */}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Security headers */}
      {Object.entries(securityHeaders).map(([name, content]) => (
        <meta key={name} httpEquiv={name} content={content} />
      ))}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonicalUrl: PropTypes.string,
  ogTitle: PropTypes.string,
  ogDescription: PropTypes.string,
  ogImage: PropTypes.string,
  twitterCard: PropTypes.oneOf(['summary', 'summary_large_image', 'app', 'player']),
  noIndex: PropTypes.bool,
  schemaData: PropTypes.object,
  keywords: PropTypes.string
};

export default SEO;