import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

// Default meta data
const siteValues = {
  title: "Dimas Tri Mulyo - Portfolio",
  description: "Personal Portfolio of Dimas Tri Mulyo - AI Engineer & Full Stack Developer",
  name: "Dimas Tri Mulyo",
  url: "https://dimasu.site",
  image: "/logo.png", // Ensure this exists in public folder
  twitter: "@dimasu21", // Replace with actual handle if available
  type: "website",
};

export default function SEO({ title, description, keywords, image, url, type }) {
  const metaTitle = title ? `${title} | ${siteValues.name}` : siteValues.title;
  const metaDescription = description || siteValues.description;
  const metaUrl = url || siteValues.url;
  const metaImage = image || `${siteValues.url}${siteValues.image}`;
  const metaType = type || siteValues.type;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={metaType} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteValues.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={siteValues.twitter} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Structured Data (JSON-LD) for SEO Entity Recognition */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": siteValues.name,
          "alternateName": ["Dimas Tri M", "dimasu", "Dimas Tri Mulyo"],
          "url": siteValues.url,
          "image": `${siteValues.url}${siteValues.image}`,
          "sameAs": [
            "https://github.com/dimasu21",
            "https://facebook.com/dimas.tri.m",
            "https://instagram.com/dimas_tm21",
            "https://www.linkedin.com/in/dimastrimumulyo" // Hypothetical/Placeholder if not known, but good to have structure
          ],
          "jobTitle": ["AI Engineer", "Full Stack Developer"],
          "worksFor": {
            "@type": "Organization",
            "name": "Freelance"
          },
          "description": siteValues.description
        })}
      </script>
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
};
