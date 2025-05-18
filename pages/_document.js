import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Add your beehive embed script here */}
        <script 
          data-beehive-id="YOUR_BEEHIVE_ID" 
          src="https://embed.beehiiv.com/v2/embed.js" 
          async
        />
        <style dangerouslySetInnerHTML={{ __html: `
          /* Custom styling for beehive embed */
          #beehiiv-embed {
            width: 100% !important;
            max-width: none !important;
          }
          #beehiiv-embed iframe {
            width: 100% !important;
          }
        `}} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 