import '../styles/globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useEffect } from 'react';

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Check if all required resources are loaded
    const checkResources = () => {
      const stylesheets = document.styleSheets;
      console.log('Loaded stylesheets:', stylesheets.length);
      
      for (let i = 0; i < stylesheets.length; i++) {
        try {
          const rules = stylesheets[i].cssRules;
          console.log(`Stylesheet ${i} rules:`, rules.length);
        } catch (e) {
          console.warn(`Cannot read rules from stylesheet ${i}:`, e);
        }
      }
    };

    // Run check after a short delay to ensure all resources have had a chance to load
    setTimeout(checkResources, 1000);
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp; 