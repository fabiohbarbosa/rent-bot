import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';

import Log from '@config/logger';
import props from '@config/props';
import Db from '@config/db';

import healthcheck from '@api/healthcheck-api';
import fix from '@api/fix-api';
import property from '@api/property-api';
import provider from '@api/provider-api';
import status from '@api/status-api';
import topology from '@api/topology-api';
import miner from '@api/miner-api';
import errorHandler from '@api/middleware/error-handler';

import Bot from './bot';
import PropertyCache from '@lib/property-cache';

const boostrap = async() => {
  const db = await Db.createConnection(props.db.url, props.db.dbName);

  // it should be blocked to load all data before start the crawler
  const cache = new PropertyCache(db);
  await cache.setup();

  const app = express();
  const server = http.createServer(app);
  const router = express.Router();

  // disable express default headers
  app.disable('x-powered-by');

  app.use(bodyParser.json());

  app.use(cors());

  app.use('/api', healthcheck(router));
  app.use('/api', fix(router, db));
  app.use('/api', property(router, db, cache));
  app.use('/api', provider(router, db));
  app.use('/api', status(router, db));
  app.use('/api', topology(router, db));
  app.use('/api', miner(router, db, cache));
  app.use(errorHandler);

  // wrong routes should be return 404 status code
  app.use('*', (req, res) => res.status(404).send());

  // Configure / start the server
  server.maxConnections = props.server.maxConnections;

  const port = props.server.port;
  const serverName = props.server.name;

  server.listen(port, () => {
    Log.info(`${serverName} now listening on ${port}`);
    Log.info('Initialising rent bot');

    new Bot(db, cache)
      .crawlers()
      .evaluateAvailability()
      .dataMining();
  });
};

boostrap();
