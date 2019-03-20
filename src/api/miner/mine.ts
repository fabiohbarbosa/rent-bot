import { Router } from 'express';
import { Db } from 'mongodb';

import Log from '@config/logger';
import PropertyCache from '@lib/property-cache';
import { executeQuery } from '@utils/batch-utils';
import HttpError from '@api/http-error';
import MinerBot from '@modules/miners/miner-bot';

import { logPrefix, path } from './consts';

const api = (router: Router, db: Db, cache: PropertyCache) => {
  router.post(path, async(req, res, next) => {
    try {
      const { url } = req.body;
      if (!url) throw new HttpError('Invalid url', 400);

      Log.info(`${logPrefix} Mining ${url}...`);
      const properties = await executeQuery(db, { url });
      const property = properties[0];
      res.send(204);

      new MinerBot(db, cache).mine(property);
    } catch (err) {
      next(err);
    }
  });
};

export default api;
