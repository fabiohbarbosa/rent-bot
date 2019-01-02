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
      interval: 30 * 60 * 1000,
      delay: 0 * 1000
    },
    dataMining: {
      batchSize: 4,
      interval: 10 * 60 * 1000,
      delay: 10 * 1000
    },
    availability: {
      batchSize: 4,
      interval: 10 * 60 * 1000,
      delay: 15 * 1000
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
      interval: 1 * 60 * 1000,
      enabled: true,
      delay: 0
    },
    dataMining: {
      ...defaultVars.bots.dataMining,
      enabled: true,
      interval: 0.5 * 60 * 1000,
      delay: 0
    },
    availability: {
      ...defaultVars.bots.availability,
      enabled: true,
      interval: 0.5 * 60 * 1000,
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

const dataFilters = {
  maxPrice: 850,
  energeticCertificates: [
    'a+', '+a', 'a-', '-a', 'a',
    'b+', '+b', 'b-', '-b', 'b',
    'c+', '+c', 'c-', '-c', 'c',
  ],
  topologies: ['t3', 't4']
};

export { dataFilters };
export default !process.env.NODE_ENV ? localVars : envVars;
