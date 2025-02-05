import { FC } from "react";
import Head from "next/head";
import { contact } from "@/constants/data";

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  image: string;
  url: string;
}

const SEO: FC<SEOProps> = ({ title, description, keywords, image, url }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Karens Tour" />
      <meta name="robots" content="index, follow" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5"
      />

      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:description" content={description} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <link rel="canonical" href={url} />

      <link rel="apple-touch-icon" href="/images/logo.png" />
      <link rel="icon" href="/images/logo.png" />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Karens Tour Official",
          url,
          sameAs: [
            contact.email,
            contact.instagram,
            contact.whatsapp,
            contact.address,
            contact.company,
            contact.phone,
          ],
        })}
      </script>
    </Head>
  );
};

export default SEO;
