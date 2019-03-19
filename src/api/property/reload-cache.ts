import { Router } from 'express';

import Log from '@config/logger';
import PropertyCache from '@lib/property-cache';
import { logPrefix, path } from './consts';

const api = (router: Router, cache: PropertyCache) => {
  router.patch(`${path}/reload_cache`, async(req, res, next) => {
    try {
      Log.info(`${logPrefix} Reloading cache...`);
      res.sendStatus(204);
      cache.setup()
        .then(() => Log.info(`${logPrefix} Success to reload properties cache.`))
        .catch(() => Log.error(`${logPrefix} Error to load properties from cache.`));
    } catch (err) {
      next(err);
    }
  });
};

export default api;
