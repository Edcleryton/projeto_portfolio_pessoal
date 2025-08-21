/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // Estado global para manejar datos de prueba
  let appState = {
    loginAttempts: {},
    notificationsSent: {},
    notificationPermission: 'default',
    notificationMocks: []
  };

  on('task', {
    // Resetear intentos de login
    resetLoginAttempts() {
      appState.loginAttempts = {};
      return null;
    },

    // Simular bloqueo de cuenta
    simulateAccountBlock({ email, minutes }) {
      const blockedUntil = new Date();
      blockedUntil.setMinutes(blockedUntil.getMinutes() + minutes);
      
      appState.loginAttempts[email] = {
        attempts: 3,
        blockedUntil: blockedUntil.toISOString()
      };
      return null;
    },

    // Obtener estado de intentos de login
    getLoginAttempts() {
      return appState.loginAttempts;
    },

    // Resetear notificaciones
    resetNotifications() {
      appState.notificationsSent = {};
      appState.notificationMocks = [];
      return null;
    },

    // Simular permiso de notificación
    mockNotificationPermission(permission) {
      appState.notificationPermission = permission;
      return null;
    },

    // Verificar si se envió notificación
    checkNotificationSent({ expectedTitle, expectedBody }) {
      const notification = appState.notificationMocks.find(n => 
        n.title === expectedTitle && n.body.includes(expectedBody)
      );
      return notification !== undefined;
    },

    // Agregar notificación mock
    addNotificationMock({ title, body }) {
      appState.notificationMocks.push({ title, body });
      return null;
    },

    // Obtener estado completo
    getAppState() {
      return appState;
    },

    // Resetear todo el estado
    resetAppState() {
      appState = {
        loginAttempts: {},
        notificationsSent: {},
        notificationPermission: 'default',
        notificationMocks: []
      };
      return null;
    },

    // Disparar verificación de notificaciones
    triggerNotificationCheck() {
      // Simular la verificación de notificaciones sin crear ninguna
      return null;
    }
  });
};