import Head from "next/head";

interface SEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, url, image }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
      <link
        rel="apple-touch-icon"
        href="/favicon.png"
        type="image/png"
        sizes="32x32"
      />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={"website"} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Structured Data (Schema Markup) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description: description,
            url: url,
            image: image,
          }),
        }}
      />
    </Head>
  );
};

export default SEO;
