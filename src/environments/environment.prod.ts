export const environment = {
  production: true,
  keycloak_data: {
    grant_type: 'password',
    client_id: 'pickvoice',
    username: '',
    password: ''
  },
  // apiBaseUrl: 'https://tau-tech.co:8443/api',
  apiBaseUrl: 'https://api.dev.pickvoice.com',
  apiKeycloak: 'https://keycloak.cclauth.com/auth',
  sessionDuration: 360, // session duration in minutes
  sessionInactivityTime: 30, // session inativity time in minutes
  debug: false,
  companyName: 'Pickvoice',
  companyEmail: '',
  companyPhones: '',
  companyAddress: '',
  footer: '',
  dataCacheDuration: 600, // duracion de datos cacheados, en segundos
  importOffset: 1000 // limite de registros a enviar por peticion
};
