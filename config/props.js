const defaultVars = {
  env: process.env.NODE_ENV || 'local',
  server: {
    name: 'Rent Bot',
    maxConnections: 256
  }
};

const localVars = {
  ...defaultVars,
  server: {
    ...defaultVars.server,
    port: 3000
  },
  db: {
    url: 'mongodb://localhost:27017',
    dbName: 'rent-bot'
  },
  logLevel: 'info'
};

const envVars = {
  ...defaultVars,
  server: {
    ...defaultVars.server,
    port: process.env.PORT
  },
  db: {
    url: process.env.DB_URL,
    dbName: 'rent-bot'
  },
  logLevel: process.env.LOG_LEVEL,
};

export default !process.env.NODE_ENV ? localVars : envVars;
