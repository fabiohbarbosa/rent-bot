const defaultVars = {
  env: process.env.NODE_ENV || 'local',
  server: {
    name: 'Rent Bot',
    maxConnections: 256
  },
  db: {
    dbName: 'rent-bot'
  },
  bots: {
    crawler: {
      interval: 1 * 60 * 1000,
      delay: 0 * 1000
    },
    dataMining: {
      batchSize: 1,
      interval: 0.5 * 60 * 1000,
      delay: 5 * 1000 // 5 seconds
    },
    availability: {
      batchSize: 1,
      interval: 0.5 * 60 * 1000,
      delay: 10 * 1000 // 10 seconds
    }
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
    ...defaultVars.db
  },
  bots: {
    crawler: {
      ...defaultVars.bots.crawler,
      enabled: true,
      delay: 0
    },
    dataMining: {
      ...defaultVars.bots.dataMining,
      enabled: false,
      delay: 0
    },
    availability: {
      ...defaultVars.bots.availability,
      enabled: false,
      delay: 0
    }
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
    ...defaultVars.db
  },
  bots: {
    crawler: {
      enabled: process.env.CRAWLER_BOT,
      ...defaultVars.bots.crawler
    },
    dataMining: {
      enabled: process.env.AVAILABILITY_BOT,
      ...defaultVars.bots.dataMining
    },
    availability: {
      enabled: process.env.DATA_MINING_BOT,
      ...defaultVars.bots.availability
    }
  },
  logLevel: process.env.LOG_LEVEL,
};

const maxPrice = 850;
const energeticCertificates = [
  'a+', '+a', 'a-', '-a', 'a',
  'b+', '+b', 'b-', '-b', 'b',
  'c+', '+c', 'c-', '-c', 'c',
];

export { maxPrice, energeticCertificates };
export default !process.env.NODE_ENV ? localVars : envVars;
