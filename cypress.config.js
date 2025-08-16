const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Plugin para geração automática de relatórios de defeitos
      require('./cypress/plugins/defect-reporter')(on, config);
    },
    baseUrl: 'http://localhost:8080',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    videoUploadOnPasses: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    // Configurações de formato
    trashAssetsBeforeRuns: true,
    // Vídeos em MP4 (padrão do Cypress)
    // Screenshots em PNG (padrão, mas com alta qualidade)
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    // Variáveis de ambiente
    env: {
      baseUrl: 'http://localhost:8080/',
      testUser: {
        email: 'email@teste.com',
        password: '123456'
      }
    }
  },
});
