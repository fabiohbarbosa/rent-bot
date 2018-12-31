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
    dataMining: true,
    availability: true
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

const crawlerInterval = 0.5 * 60 * 1000;
const dataMiningInterval = 0.4 * 60 * 1000;
const availableInterval = 1 * 60 * 1000;

const maxPrice = 850;
const energeticCertificates = [
  'a+', '+a', 'a-', '-a', 'a',
  'b+', '+b', 'b-', '-b', 'b',
  'c+', '+c', 'c-', '-c', 'c',
];

export { crawlerInterval, availableInterval, dataMiningInterval, maxPrice, energeticCertificates };
export default !process.env.NODE_ENV ? localVars : envVars;
