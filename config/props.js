const defaultVars = {
  env: process.env.NODE_ENV || 'local',
  server: {
    name: 'Rent Bot Crawler',
    maxConnections: 256
  }
};

const localVars = {
  ...defaultVars,
  server: {
    ...defaultVars.server,
    port: 3000
  },
  logLevel: 'info'
};

const envVars = {
  ...defaultVars,
  server: {
    ...defaultVars.server,
    port: process.env.PORT
  },
  logLevel: process.env.LOG_LEVEL,
};

export default !process.env.NODE_ENV ? localVars : envVars;
