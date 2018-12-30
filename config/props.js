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
  bots: {
    crawler: false,
    availability: true,
    dataMining: false
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
  bots: {
    crawler: process.env.CRAWLER_BOT,
    availability: process.env.AVAILABILITY_BOT,
    dataMining: process.env.DATA_MINING_BOT
  },
  logLevel: process.env.LOG_LEVEL,
};

const crawlerInterval = 1 * 60 * 1000; // 1 minute
const availableInterval = 5.5 * 60 * 1000; // 5 1/2 minutes
const dataMiningInterval = 1 * 60 * 1000; // 1 minute

export { crawlerInterval, availableInterval, dataMiningInterval };
export default !process.env.NODE_ENV ? localVars : envVars;
