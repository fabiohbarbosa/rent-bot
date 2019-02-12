import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';


import Log from '../config/logger';
import props from '../config/props';
import Db from '../config/db';

import healthcheck from './api/healthcheck-api';
import fixes from './api/fixes-api';
import properties from './api/properties-api';
import errorHandler from './middleware/error-handler';

import Bot from './bot';
import MailJob from './mail/mail-job';

// initialize the express server
(async() => {
  const db = await Db.createConnection(props.db.url, props.db.dbName);

  const app = express();
  const server = http.createServer(app);
  const router = express.Router();

  // disable express default headers
  app.disable('x-powered-by');

  app.use(bodyParser.json());
  app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE']
  }));

  app.use('/', healthcheck(router));
  app.use('/', fixes(router, db));
  app.use('/', properties(router, db));
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
    Bot.crawlers(db);
    Bot.evaluateAvailability(db);
    Bot.dataMining(db);
    MailJob.schedule(db);
  });
})();
