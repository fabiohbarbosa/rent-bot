import express from 'express';
import http from 'http';

import Log from '../config/logger';
import props from '../config/props';
import Db from '../config/db';

import healthcheck from './api/healthcheck-api';

import Bot from './bot';
import MailJob from './mail/mail-job';

// initialize the express server
const app = express();
const server = http.createServer(app);
const router = express.Router();

// disable express default headers
app.disable('x-powered-by');

app.use('/', healthcheck(router));

// wrong routes should be return 404 status code
app.use('*', (req, res) => res.status(404).send());

// Configure / start the server
server.maxConnections = props.server.maxConnections;

const port = props.server.port;
const serverName = props.server.name;

server.listen(port, async() => {
  Log.info(`${serverName} now listening on ${port}`);
  const db = await Db.createConnection(props.db.url, props.db.dbName);

  Log.info('Initialising rent bot');
  Bot.crawlers(db);
  Bot.evaluateAvailability(db);
  Bot.dataMining(db);
  MailJob.schedule(db);
});
