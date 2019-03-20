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
      const urls = req.body;
      if (!urls) throw new HttpError('Invalid urls', 400);

      Log.info(`${logPrefix} Mining ${urls}...`);
      const properties = await executeQuery(db, { url: { $in: urls } });
      if (properties.length === 0) throw new HttpError('Invalid urls', 400);

      res.send(204);
      properties.forEach(p => new MinerBot(db, cache).mine(p))
    } catch (err) {
      next(err);
    }
  });
};

export default api;
