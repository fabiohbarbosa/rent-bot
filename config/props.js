const defaultVars = {
  env: process.env.NODE_ENV || 'local',
  server: {
    name: 'Rent Bot',
    maxConnections: 256
  },
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
    crawler: true,
    availability: true,
    dataMining: true
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
const availableInterval = 2.5 * 60 * 1000; // 2 1/2 minutes
const dataMiningInterval = 1.5 * 60 * 1000; // 1 1/2 minute
const maxPrice = 850;
const energeticCertificates = [
  'a+', '+a', 'a-', '-a', 'a',
  'b+', '+b', 'b-', '-b', 'b',
  'c+', '+c', 'c-', '-c', 'c',
];

export { crawlerInterval, availableInterval, dataMiningInterval, maxPrice, energeticCertificates };
export default !process.env.NODE_ENV ? localVars : envVars;
