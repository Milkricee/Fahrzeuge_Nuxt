import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Falls du weiterhin Node-Events benötigst, kannst du diese hier hinzufügen
      return config;
    },
    specPattern: 'cypress/component/**/*.{cy,js,ts,tsx}', // Hier kannst du deinen Test-Ordner und Dateiendung definieren
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'webpack', // Standard Webpack-Setup für Vue-Komponenten
    },
  },
});


