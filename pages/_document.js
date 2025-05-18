import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
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