import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,
  screenshotOnRunFailure: false,
  video: false,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,
  responseTimeout: 30000,
  defaultCommandTimeout: 30000,
  fixturesFolder: 'cypress/local/fixtures',
  screenshotsFolder: 'cypress/local/screenshots',
  videosFolder: 'cypress/local/videos',
  downloadsFolder: 'cypress/local/downloads',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('./cypress/local/plugins/index.ts')(on, config);
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/local/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/local//support/index.ts',
  },
});
