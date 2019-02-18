const defaultVars = {
  env: process.env.NODE_ENV || 'local',
  retries: 6,
  receivers: [
    'fabiohbarbosa@gmail.com',
    'josiannygonzales@gmail.com'
  ],
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
      intervalIdealistaMultipler: 15,
      delay: 0 * 1000
    },
    dataMining: {
      batchSize: 4,
      interval: 9 * 60 * 1000, // a cada 9 minutos é possível verificar 600 imóveis por dia
      intervalIdealistaCounter: 0, // numbers of cycle before search by idealista URLs
      delay: 10 * 1000
    },
    availability: {
      batchSize: 4,
      ensureTimes: 5,
      interval: 9 * 60 * 1000, // a cada 9 minutos é possível verificar 600 imóveis por dia
      intervalIdealistaCounter: 0, // numbers of cycle before search by idealista URLs
      delay: 15 * 1000
    }
  },
  scheduler: {
    mail: {
      batchSize: 100,
      interval: 0.5 * 60 * 1000,
      delay: 5 * 1000
    }
  }
};

const localVars = {
  ...defaultVars,
  proxy: false,
  server: {
    ...defaultVars.server,
    port: 3000
  },
  db: {
    url: 'mongodb://localhost:27017',
    ...defaultVars.db
  },
  mail: {
    enabled: false,
  },
  bots: {
    crawler: {
      ...defaultVars.bots.crawler,
      interval: 1 * 60 * 1000,
      enabled: false,
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
    },
  },
  scheduler: {
    mail: {
      ...defaultVars.scheduler.mail,
      enabled: false
    }
  },
  logLevel: 'info'
};

const envVars = {
  ...defaultVars,
  proxy: true,
  server: {
    ...defaultVars.server,
    port: process.env.PORT
  },
  db: {
    url: process.env.DB_URL,
    ...defaultVars.db
  },
  mail: {
    enabled: process.env.MAIL,
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
  scheduler: {
    mail: {
      ...defaultVars.scheduler.mail,
      enabled: true
    }
  },
  logLevel: process.env.LOG_LEVEL,
};

const dataFilters = {
  maxPrice: 850,
  onlyPhoto: true,
  energeticCertificates: [
    'a+', '+a', 'a-', '-a', 'a',
    'b+', '+b', 'b-', '-b', 'b'
  ],
  topologies: ['t3', 't4']
};

export { dataFilters };
export default !process.env.NODE_ENV ? localVars : envVars;
