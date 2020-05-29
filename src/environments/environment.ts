export const environment = {
  production: false,
  keycloak_data: {
    grant_type: 'password',
    client_id: 'pickvoice',
    username: '',
    password: ''
  },
  apiBaseUrl: '/api',
  apiKeycloak: '/auth',
  sessionDuration: 360, // session duration in minutes
  sessionInactivityTime: 30, // session inativity time in minutes
  debug: true,
  companyName: 'Pickvoice',
  companyEmail: '',
  companyPhones: '',
  companyAddress: '',
  footer: '',
  dataCacheDuration: 600, // duracion de datos cacheados, en segundos
  importOffset: 1000 // limite de registros a enviar por peticion
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
