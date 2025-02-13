import { defineConfig } from 'cypress';
import webpackPreprocessor from '@cypress/webpack-preprocessor';
import path from 'path';

export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  const options = {
    webpackOptions: {
      resolve: {
        alias: {
          vue$: 'vue/dist/vue.esm.js', // Standard-Vue-Compiler
        },
      },
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader', // Verwendet vue-loader für .vue-Dateien
          },
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
    },
  };

  // Verwende den Webpack-Preprocessor mit der oben definierten Konfiguration
  on('file:preprocessor', webpackPreprocessor(options));

  return config;
};
