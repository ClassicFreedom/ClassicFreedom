import Script from 'next/script';
import { useEffect } from 'react';

export default function BeehiveEmbed() {
  useEffect(() => {
    // Clean up any existing embed
    const existingEmbed = document.querySelector('#beehiiv-embed');
    if (existingEmbed) {
      existingEmbed.innerHTML = '';
    }
  }, []);

  return (
    <>
      <Script
        src="https://embed.beehiiv.com/v2/embed.js"
        data-beehive-id="6b0c1a4c-b9b8-4e91-8f7b-3307d0b88024"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Beehive script loaded successfully');
        }}
        onError={(e) => {
          console.error('Error loading Beehive script:', e);
        }}
      />
      <div id="beehiiv-embed" className="w-full" />
    </>
  );
} 